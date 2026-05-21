package com.haniu.tthieu.haniu.service;

import java.util.Map;
import java.util.UUID;

public interface PaymentService {
    String createPaymentLink(UUID orderId, String gateway);
    void processWebhook(String gateway, Map<String, String> ipnParams);
}
