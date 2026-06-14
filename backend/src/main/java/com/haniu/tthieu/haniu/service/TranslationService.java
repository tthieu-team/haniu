package com.haniu.tthieu.haniu.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.haniu.tthieu.haniu.entity.system.TranslationCache;
import com.haniu.tthieu.haniu.repository.TranslationCacheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TranslationService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final TranslationCacheRepository translationCacheRepository;

    private boolean isAlreadyVietnamese(String text) {
        if (text == null) return true;
        String accents = "àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ" +
                         "ÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰÝỲỶỸỴĐ";
        for (char c : text.toCharArray()) {
            if (accents.indexOf(c) >= 0) {
                return true;
            }
        }
        return false;
    }

    @Cacheable(value = "translations", key = "#text + '_' + #targetLang")
    public String translate(String text, String targetLang) {
        if (text == null || text.trim().isEmpty() || targetLang == null) {
            return text;
        }

        String lang = targetLang.trim().toLowerCase();
        if (("vi".equals(lang) || "vi-vn".equals(lang)) && isAlreadyVietnamese(text)) {
            return text;
        }

        // Map client language formats to Google Translate formats
        if (lang.startsWith("en")) {
            lang = "en";
        } else if (lang.startsWith("ja")) {
            lang = "ja";
        } else if (lang.startsWith("zh")) {
            lang = "zh-CN";
        } else if (lang.startsWith("ko")) {
            lang = "ko";
        }

        // 1. Generate text hash
        String textHash = DigestUtils.md5DigestAsHex(text.getBytes(StandardCharsets.UTF_8));

        // 2. Lookup from DB cache first
        try {
            Optional<TranslationCache> cachedOpt = translationCacheRepository.findByTextHashAndTargetLang(textHash, lang);
            if (cachedOpt.isPresent()) {
                return cachedOpt.get().getTranslatedText();
            }
        } catch (Exception e) {
            System.err.println("Error reading translation cache from DB: " + e.getMessage());
        }

        // 3. Fallback to Translation API
        String translated = callTranslationApi(text, lang);

        // 4. Save to DB cache
        try {
            TranslationCache cacheEntry = TranslationCache.builder()
                    .textHash(textHash)
                    .originalText(text)
                    .targetLang(lang)
                    .translatedText(translated)
                    .build();
            translationCacheRepository.save(cacheEntry);
        } catch (Exception e) {
            System.err.println("Failed to save translation cache to DB: " + e.getMessage());
        }

        return translated;
    }

    private String callTranslationApi(String text, String lang) {
        try {
            String urlStr = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" 
                    + lang 
                    + "&dt=t&q=" 
                    + URLEncoder.encode(text, StandardCharsets.UTF_8);

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");

            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
                StringBuilder response = new StringBuilder();
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                // Parse the response
                JsonNode rootNode = objectMapper.readTree(response.toString());
                if (rootNode.isArray() && rootNode.size() > 0) {
                    JsonNode translationSegments = rootNode.get(0);
                    if (translationSegments.isArray()) {
                        StringBuilder translatedText = new StringBuilder();
                        for (JsonNode segment : translationSegments) {
                            if (segment.isArray() && segment.size() > 0) {
                                JsonNode translatedPart = segment.get(0);
                                if (translatedPart != null && !translatedPart.isNull()) {
                                    translatedText.append(translatedPart.asText());
                                }
                            }
                        }
                        return translatedText.toString();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error translating via Google Translate: " + e.getMessage());
        }

        // Fallback to original text if translation fails
        return text;
    }
}
