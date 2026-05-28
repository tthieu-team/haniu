package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.dto.CartDto;
import com.haniu.tthieu.haniu.dto.CartItemDto;
import com.haniu.tthieu.haniu.dto.CartItemRequestDto;
import com.haniu.tthieu.haniu.entity.cart.Cart;
import com.haniu.tthieu.haniu.entity.cart.CartItem;
import com.haniu.tthieu.haniu.entity.product.Product;
import com.haniu.tthieu.haniu.entity.product.ProductMedia;
import com.haniu.tthieu.haniu.entity.product.ProductVariant;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.repository.*;
import com.haniu.tthieu.haniu.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductMediaRepository productMediaRepository;
    private final UserRepository userRepository;

    @Override
    public CartDto getCart(String email, String sessionId) {
        Cart cart = getOrCreateCart(email, sessionId);
        return convertToDto(cart);
    }

    @Override
    public CartDto addToCart(String email, String sessionId, CartItemRequestDto request) {
        Cart cart = getOrCreateCart(email, sessionId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariant variant = null;
        BigDecimal price = product.getPrice();

        if (request.getVariantId() != null) {
            variant = productVariantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));
            price = variant.getSalePrice() != null ? variant.getSalePrice() : variant.getPrice();
        } else if (product.getSalePrice() != null) {
            price = product.getSalePrice();
        }

        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        
        ProductVariant finalVariant = variant;
        Optional<CartItem> existingItem = items.stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()) &&
                        Objects.equals(item.getVariant() != null ? item.getVariant().getId() : null,
                                finalVariant != null ? finalVariant.getId() : null))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .unitPrice(price)
                    .totalPrice(price.multiply(BigDecimal.valueOf(request.getQuantity())))
                    .customizationInfo(request.getCustomizationInfo())
                    .build();
            cartItemRepository.save(newItem);
        }

        updateCartTotals(cart);
        return convertToDto(cart);
    }

    @Override
    public CartDto updateQuantity(String email, String sessionId, UUID itemId, int quantity) {
        Cart cart = getOrCreateCart(email, sessionId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Unauthorized cart modification");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(quantity)));
            cartItemRepository.save(item);
        }

        updateCartTotals(cart);
        return convertToDto(cart);
    }

    @Override
    public CartDto removeItem(String email, String sessionId, UUID itemId) {
        Cart cart = getOrCreateCart(email, sessionId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Unauthorized cart modification");
        }

        cartItemRepository.delete(item);
        updateCartTotals(cart);
        return convertToDto(cart);
    }

    @Override
    public void mergeCarts(String email, String sessionId) {
        if (email == null || sessionId == null) return;

        Optional<Cart> guestCartOpt = cartRepository.findBySessionId(sessionId);
        if (guestCartOpt.isEmpty()) return;

        Cart guestCart = guestCartOpt.get();
        List<CartItem> guestItems = cartItemRepository.findByCartId(guestCart.getId());

        if (guestItems.isEmpty()) {
            cartRepository.delete(guestCart);
            return;
        }

        Cart userCart = getOrCreateCart(email, null);
        List<CartItem> userItems = cartItemRepository.findByCartId(userCart.getId());

        for (CartItem guestItem : guestItems) {
            Optional<CartItem> existingItem = userItems.stream()
                    .filter(item -> item.getProduct().getId().equals(guestItem.getProduct().getId()) &&
                            Objects.equals(item.getVariant() != null ? item.getVariant().getId() : null,
                                    guestItem.getVariant() != null ? guestItem.getVariant().getId() : null))
                    .findFirst();

            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + guestItem.getQuantity());
                item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                cartItemRepository.save(item);
            } else {
                guestItem.setCart(userCart);
                cartItemRepository.save(guestItem);
            }
        }

        cartRepository.delete(guestCart);
        updateCartTotals(userCart);
    }

    @Override
    public void clearCart(UUID cartId) {
        cartItemRepository.deleteByCartId(cartId);
        cartRepository.findById(cartId).ifPresent(cart -> {
            cart.setTotalItems(0);
            cart.setTotalPrice(BigDecimal.ZERO);
            cartRepository.save(cart);
        });
    }

    private Cart getOrCreateCart(String email, String sessionId) {
        Cart cart;
        if (email != null && !email.trim().isEmpty()) {
            cart = cartRepository.findByUserEmail(email)
                    .orElseGet(() -> {
                        User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                        Cart newCart = Cart.builder()
                                .user(user)
                                .totalItems(0)
                                .totalPrice(BigDecimal.ZERO)
                                .build();
                        return cartRepository.save(newCart);
                    });
        } else if (sessionId != null && !sessionId.trim().isEmpty()) {
            cart = cartRepository.findBySessionId(sessionId)
                    .orElseGet(() -> {
                        Cart newCart = Cart.builder()
                                .sessionId(sessionId)
                                .totalItems(0)
                                .totalPrice(BigDecimal.ZERO)
                                .build();
                        return cartRepository.save(newCart);
                    });
        } else {
            throw new IllegalArgumentException("Either email or sessionId must be provided");
        }

        int deletedCount = cartItemRepository.deleteInvalidCartItems(cart.getId());
        if (deletedCount > 0) {
            updateCartTotals(cart);
        }

        return cart;
    }

    private void updateCartTotals(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        int totalItems = items.stream().mapToInt(CartItem::getQuantity).sum();
        BigDecimal totalPrice = items.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalItems(totalItems);
        cart.setTotalPrice(totalPrice);
        cartRepository.save(cart);
    }

    private CartDto convertToDto(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItemDto> itemDtos = items.stream().map(item -> {
            List<ProductMedia> media = productMediaRepository.findByProductIdOrderBySortOrderAsc(item.getProduct().getId());
            String imageUrl = media.stream()
                    .filter(ProductMedia::isThumbnail)
                    .map(ProductMedia::getUrl)
                    .findFirst()
                    .orElse(media.isEmpty() ? null : media.get(0).getUrl());

            BigDecimal originalPrice = item.getVariant() != null ? item.getVariant().getPrice() : item.getProduct().getPrice();
            int stock = item.getVariant() != null ? item.getVariant().getStock() : item.getProduct().getStock();
            String color = item.getVariant() != null ? item.getVariant().getColor() : item.getProduct().getColor();
            String size = item.getVariant() != null ? item.getVariant().getSize() : null;
            String material = item.getVariant() != null ? item.getVariant().getMaterial() : item.getProduct().getMaterial();

            return CartItemDto.builder()
                    .id(item.getId())
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .productSlug(item.getProduct().getSlug())
                    .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                    .variantName(item.getVariant() != null ? item.getVariant().getName() : null)
                    .variantSku(item.getVariant() != null ? item.getVariant().getSku() : item.getProduct().getSku())
                    .imageUrl(imageUrl)
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getTotalPrice())
                    .customizationInfo(item.getCustomizationInfo())
                    .originalPrice(originalPrice)
                    .stock(stock)
                    .color(color)
                    .size(size)
                    .material(material)
                    .build();
        }).collect(Collectors.toList());

        return CartDto.builder()
                .id(cart.getId())
                .totalItems(cart.getTotalItems())
                .totalPrice(cart.getTotalPrice())
                .items(itemDtos)
                .build();
    }
}
