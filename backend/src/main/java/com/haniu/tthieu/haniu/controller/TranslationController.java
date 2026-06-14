package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.service.TranslationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/translate")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TranslationController {

    private final TranslationService translationService;

    @PostMapping
    public ResponseEntity<?> translate(@RequestBody Map<String, List<String>> request, HttpServletRequest servletRequest) {
        List<String> texts = request.get("texts");
        if (texts == null || texts.isEmpty()) {
            return ResponseEntity.ok(Map.of());
        }

        String acceptLanguage = servletRequest.getHeader("Accept-Language");
        String lang = extractPrimaryLanguage(acceptLanguage);

        Map<String, String> result = new HashMap<>();
        for (String text : texts) {
            if (text != null) {
                result.put(text, translationService.translate(text, lang));
            }
        }

        return ResponseEntity.ok(result);
    }

    private String extractPrimaryLanguage(String acceptLanguage) {
        if (acceptLanguage == null || acceptLanguage.trim().isEmpty()) {
            return "vi";
        }
        String primary = acceptLanguage.split(",")[0].trim();
        primary = primary.split(";")[0].trim();
        primary = primary.toLowerCase();
        if (primary.contains("-")) {
            primary = primary.split("-")[0].trim();
        }
        return primary;
    }
}
