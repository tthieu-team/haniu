package com.haniu.tthieu.haniu.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.haniu.tthieu.haniu.dto.OrderResponseDto;
import com.haniu.tthieu.haniu.entity.enums.Role;
import com.haniu.tthieu.haniu.entity.system.Notification;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.handler.RealtimeWebSocketHandler;
import com.haniu.tthieu.haniu.repository.NotificationRepository;
import com.haniu.tthieu.haniu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocketIOService {

    private final RealtimeWebSocketHandler webSocketHandler;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public void sendOrderNotification(OrderResponseDto order) {
        try {
            // Save notification to DB for all Admins
            List<User> admins = userRepository.findByRole(Role.ADMIN);
            log.info("Saving notifications for {} admins", admins.size());
            
            for (User admin : admins) {
                Notification notification = Notification.builder()
                        .user(admin)
                        .title("Đơn hàng mới #" + order.getOrderCode())
                        .content("Khách hàng " + order.getCustomerName() + " vừa đặt đơn hàng trị giá " + order.getTotalPrice().longValue() + " đ")
                        .type("NEW_ORDER")
                        .isRead(false)
                        .build();
                notificationRepository.save(notification);
            }

            // Broadcast real-time event
            Map<String, Object> payload = new HashMap<>();
            payload.put("event", "realtime.notification.created");
            payload.put("data", order);
            String json = objectMapper.writeValueAsString(payload);
            
            log.info("Broadcasting order notification via WebSockets: {}", order.getOrderCode());
            webSocketHandler.broadcast(json);
        } catch (Exception e) {
            log.error("Failed to save and broadcast order notification", e);
        }
    }
}
