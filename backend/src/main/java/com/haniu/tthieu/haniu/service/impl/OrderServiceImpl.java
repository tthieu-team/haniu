package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.dto.OrderRequestDto;
import com.haniu.tthieu.haniu.dto.OrderResponseDto;
import com.haniu.tthieu.haniu.entity.cart.Cart;
import com.haniu.tthieu.haniu.entity.cart.CartItem;
import com.haniu.tthieu.haniu.entity.enums.*;
import com.haniu.tthieu.haniu.entity.marketing.Coupon;
import com.haniu.tthieu.haniu.entity.order.Order;
import com.haniu.tthieu.haniu.entity.order.OrderItem;
import com.haniu.tthieu.haniu.entity.product.Product;
import com.haniu.tthieu.haniu.entity.product.ProductMedia;
import com.haniu.tthieu.haniu.entity.product.ProductVariant;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.repository.*;
import com.haniu.tthieu.haniu.service.CartService;
import com.haniu.tthieu.haniu.service.OrderService;
import com.haniu.tthieu.haniu.service.EmailService;
import com.haniu.tthieu.haniu.service.SocketIOService;
import com.haniu.tthieu.haniu.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderServiceImpl implements OrderService {


    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CouponRepository couponRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductMediaRepository productMediaRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final EmailService emailService;
    private final SocketIOService socketIOService;


    @Override
    public OrderResponseDto createOrder(String email, OrderRequestDto request) {
        Cart cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        User user = null;
        if (email != null && !email.trim().isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        BigDecimal subtotal = cartItems.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = BigDecimal.ZERO;
        Coupon coupon = null;

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new RuntimeException("Coupon invalid"));

            if (!coupon.isActive() ||
                    (coupon.getStartDate() != null && coupon.getStartDate().isAfter(LocalDateTime.now())) ||
                    (coupon.getEndDate() != null && coupon.getEndDate().isBefore(LocalDateTime.now())) ||
                    (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit())) {
                throw new RuntimeException("Coupon expired or limit reached");
            }

            if (subtotal.compareTo(coupon.getMinOrderValue()) < 0) {
                throw new RuntimeException("Minimum order value for coupon not met");
            }

            if (coupon.getDiscountType() == DiscountType.PERCENT) {
                discount = subtotal.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
                if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                    discount = coupon.getMaxDiscount();
                }
            } else {
                discount = coupon.getDiscountValue();
            }

            if (discount.compareTo(subtotal) > 0) {
                discount = subtotal;
            }

            // Atomic usage update
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        }

        // Deduct inventory
        for (CartItem item : cartItems) {
            if (item.getVariant() != null) {
                ProductVariant variant = item.getVariant();
                if (variant.getStock() < item.getQuantity()) {
                    throw new RuntimeException("Not enough stock for variant: " + variant.getName());
                }
                variant.setStock(variant.getStock() - item.getQuantity());
                productVariantRepository.save(variant);
            } else {
                Product product = item.getProduct();
                if (product.getStock() < item.getQuantity()) {
                    throw new RuntimeException("Not enough stock for product: " + product.getName());
                }
                product.setStock(product.getStock() - item.getQuantity());
                productRepository.save(product);
            }
        }

        BigDecimal shippingFee = BigDecimal.valueOf(30000); // default standard shipping fee
        String shippingMethodStr = request.getShippingMethod() != null ? request.getShippingMethod().toUpperCase() : "STANDARD";
        if ("FAST".equals(shippingMethodStr)) {
            shippingFee = subtotal.compareTo(BigDecimal.valueOf(500000)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(50000);
        } else if ("EXPRESS".equals(shippingMethodStr)) {
            shippingFee = subtotal.compareTo(BigDecimal.valueOf(1000000)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(100000);
        } else { // STANDARD
            shippingFee = subtotal.compareTo(BigDecimal.valueOf(300000)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(30000);
        }

        BigDecimal total = subtotal.add(shippingFee).subtract(discount);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        String trackingToken = UUID.randomUUID().toString();
        String orderCode = "HN-" + System.currentTimeMillis();

        Order order = Order.builder()
                .user(user)
                .trackingToken(trackingToken)
                .orderCode(orderCode)
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .shippingProvince(request.getShippingProvince())
                .shippingDistrict(request.getShippingDistrict())
                .shippingWard(request.getShippingWard())
                .shippingAddressLine(request.getShippingAddressLine())
                .shippingMethod(shippingMethodStr)
                .note(request.getNote())
                .subtotalPrice(subtotal)
                .shippingFee(shippingFee)
                .discountAmount(discount)
                .totalPrice(total)
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()))
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.PENDING)
                .orderedAt(LocalDateTime.now())
                .build();

        order = orderRepository.save(order);

        // Batch fetch product media for all cart items
        List<UUID> productIds = cartItems.stream()
                .map(item -> item.getProduct().getId())
                .distinct()
                .collect(Collectors.toList());

        java.util.Map<UUID, List<ProductMedia>> mediaMap = new java.util.HashMap<>();
        if (!productIds.isEmpty()) {
            List<ProductMedia> allMedia = productMediaRepository.findByProductIdInOrderBySortOrderAsc(productIds);
            mediaMap = allMedia.stream().collect(Collectors.groupingBy(m -> m.getProduct().getId()));
        }

        java.util.Map<UUID, List<ProductMedia>> finalMediaMap = mediaMap;

        // Save order items
        for (CartItem item : cartItems) {
            List<ProductMedia> media = finalMediaMap.getOrDefault(item.getProduct().getId(), java.util.Collections.emptyList());
            String thumbnail = media.stream()
                    .filter(ProductMedia::isThumbnail)
                    .map(ProductMedia::getUrl)
                    .findFirst()
                    .orElse(media.isEmpty() ? null : media.get(0).getUrl());

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(item.getProduct())
                    .variant(item.getVariant())
                    .productName(item.getProduct().getName())
                    .productSlug(item.getProduct().getSlug())
                    .productThumbnail(thumbnail)
                    .variantName(item.getVariant() != null ? item.getVariant().getName() : null)
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getTotalPrice())
                    .customizationInfo(item.getCustomizationInfo())
                    .build();
            orderItemRepository.save(orderItem);
        }

        // Clear user/guest cart items
        cartService.clearCart(cart.getId());

        OrderResponseDto responseDto = convertToDto(order);
        try {
            if (responseDto.getCustomerEmail() != null && !responseDto.getCustomerEmail().trim().isEmpty()) {
                emailService.sendOrderConfirmation(responseDto.getCustomerEmail(), responseDto);
            }
        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order code: {}", responseDto.getOrderCode(), e);
        }

        try {
            socketIOService.sendOrderNotification(responseDto);
        } catch (Exception e) {
            log.error("Failed to broadcast real-time order notification for code: {}", responseDto.getOrderCode(), e);
        }

        return responseDto;
    }


    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderByCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return convertToDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderByTrackingToken(String trackingToken) {
        Order order = orderRepository.findByTrackingToken(trackingToken)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with tracking token"));
        return convertToDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByUser(String email) {
        List<Order> orders = orderRepository.findByUserEmailOrderByCreatedAtDesc(email);
        List<UUID> orderIds = orders.stream().map(Order::getId).collect(Collectors.toList());
        java.util.Map<UUID, List<OrderItem>> itemsMap = new java.util.HashMap<>();
        if (!orderIds.isEmpty()) {
            List<OrderItem> allItems = orderItemRepository.findByOrderIdIn(orderIds);
            itemsMap = allItems.stream().collect(Collectors.groupingBy(item -> item.getOrder().getId()));
        }
        
        java.util.Map<UUID, List<OrderItem>> finalItemsMap = itemsMap;
        return orders.stream()
                .map(order -> convertToDto(order, finalItemsMap.getOrDefault(order.getId(), java.util.Collections.emptyList())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        List<UUID> orderIds = orders.stream().map(Order::getId).collect(Collectors.toList());
        java.util.Map<UUID, List<OrderItem>> itemsMap = new java.util.HashMap<>();
        if (!orderIds.isEmpty()) {
            List<OrderItem> allItems = orderItemRepository.findByOrderIdIn(orderIds);
            itemsMap = allItems.stream().collect(Collectors.groupingBy(item -> item.getOrder().getId()));
        }
        
        java.util.Map<UUID, List<OrderItem>> finalItemsMap = itemsMap;
        return orders.stream()
                .map(order -> convertToDto(order, finalItemsMap.getOrDefault(order.getId(), java.util.Collections.emptyList())))
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDto updateOrderStatus(UUID orderId, String orderStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setOrderStatus(OrderStatus.valueOf(orderStatus.toUpperCase()));
        if (order.getOrderStatus() == OrderStatus.CONFIRMED) {
            order.setConfirmedAt(LocalDateTime.now());
        } else if (order.getOrderStatus() == OrderStatus.SHIPPING) {
            order.setShippedAt(LocalDateTime.now());
        } else if (order.getOrderStatus() == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
            order.setPaymentStatus(PaymentStatus.PAID);
        } else if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            order.setCancelledAt(LocalDateTime.now());
        }

        order = orderRepository.save(order);
        OrderResponseDto responseDto = convertToDto(order);

        if (order.getOrderStatus() == OrderStatus.DELIVERED || order.getOrderStatus() == OrderStatus.CANCELLED) {
            try {
                if (responseDto.getCustomerEmail() != null && !responseDto.getCustomerEmail().trim().isEmpty()) {
                    emailService.sendOrderStatusUpdate(responseDto.getCustomerEmail(), responseDto, order.getOrderStatus().name());
                }
            } catch (Exception e) {
                log.error("Failed to send order status update email for order code: {}", responseDto.getOrderCode(), e);
            }
        }

        return responseDto;
    }

    @Override
    public OrderResponseDto updatePaymentStatus(UUID orderId, String paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setPaymentStatus(PaymentStatus.valueOf(paymentStatus.toUpperCase()));
        order = orderRepository.save(order);
        return convertToDto(order);
    }

    private OrderResponseDto convertToDto(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        return convertToDto(order, items);
    }

    private OrderResponseDto convertToDto(Order order, List<OrderItem> items) {
        List<OrderResponseDto.OrderItemResponseDto> itemDtos = items.stream().map(item -> 
            OrderResponseDto.OrderItemResponseDto.builder()
                    .id(item.getId())
                    .productId(item.getProduct().getId())
                    .productName(item.getProductName())
                    .productSlug(item.getProductSlug())
                    .productThumbnail(item.getProductThumbnail())
                    .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                    .variantName(item.getVariantName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getTotalPrice())
                    .customizationInfo(item.getCustomizationInfo())
                    .build()
        ).collect(Collectors.toList());

        return OrderResponseDto.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .trackingToken(order.getTrackingToken())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .customerEmail(order.getCustomerEmail())
                .shippingProvince(order.getShippingProvince())
                .shippingDistrict(order.getShippingDistrict())
                .shippingWard(order.getShippingWard())
                .shippingAddressLine(order.getShippingAddressLine())
                .note(order.getNote())
                .subtotalPrice(order.getSubtotalPrice())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .totalPrice(order.getTotalPrice())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus(order.getPaymentStatus().name())
                .orderStatus(order.getOrderStatus().name())
                .shippingMethod(order.getShippingMethod())
                .orderedAt(order.getOrderedAt())
                .items(itemDtos)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> lookupOrders(String query) {
        if (query == null || query.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        String cleanQuery = query.trim();
        List<Order> orders = orderRepository.lookupOrders(cleanQuery);
        
        List<UUID> orderIds = orders.stream().map(Order::getId).collect(Collectors.toList());
        java.util.Map<UUID, List<OrderItem>> itemsMap = new java.util.HashMap<>();
        if (!orderIds.isEmpty()) {
            List<OrderItem> allItems = orderItemRepository.findByOrderIdIn(orderIds);
            itemsMap = allItems.stream().collect(Collectors.groupingBy(item -> item.getOrder().getId()));
        }
        
        java.util.Map<UUID, List<OrderItem>> finalItemsMap = itemsMap;
        return orders.stream()
                .map(order -> convertToDto(order, finalItemsMap.getOrDefault(order.getId(), java.util.Collections.emptyList())))
                .collect(Collectors.toList());
    }
}

