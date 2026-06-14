package com.haniu.tthieu.haniu.advice;

import com.haniu.tthieu.haniu.service.TranslationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.lang.reflect.Field;
import java.util.*;

@ControllerAdvice
@RequiredArgsConstructor
public class TranslationResponseAdvice implements ResponseBodyAdvice<Object> {

    private final TranslationService translationService;
    private final jakarta.persistence.EntityManager entityManager;

    // Set of field names that are eligible for translation
    private static final Set<String> TRANSLATABLE_FIELDS = new HashSet<>(Arrays.asList(
            "name", "description", "shortDescription", "title", "content", 
            "value", "specifications", "includedItems", "color", "size", 
            "material", "altText", "configValue", "role", "summary"
    ));

    private static final Set<String> TRANSLATABLE_JSON_KEYS = new HashSet<>(Arrays.asList(
            "name", "text", "title", "description", "label", "placeholder", 
            "buttonText", "subtitle", "announcement", "linkText", "content", "heading",
            "desc", "summary", "question", "answer", "address", "bulletPoints", 
            "promotions", "brandCommitment", "whyChooseUs", "value", "role",
            "badge", "limitedTag", "buyNowText"
    ));

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // Intercept all endpoints returning JSON or Object data
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (body == null) {
            return null;
        }

        // Retrieve Accept-Language header from request
        if (request instanceof ServletServerHttpRequest) {
            HttpServletRequest servletRequest = ((ServletServerHttpRequest) request).getServletRequest();
            String acceptLanguage = servletRequest.getHeader("Accept-Language");
            String lang = extractPrimaryLanguage(acceptLanguage);
            if (!"vi".equalsIgnoreCase(lang)) {
                try {
                    translateObject(body, lang, new HashSet<>());
                } catch (Exception e) {
                    // Fail silently or log if using a proper logger
                }
            }
        }

        return body;
    }

    private String extractPrimaryLanguage(String acceptLanguage) {
        if (acceptLanguage == null || acceptLanguage.trim().isEmpty()) {
            return "vi";
        }
        // Get the first language preference (before comma)
        String primary = acceptLanguage.split(",")[0].trim();
        // Get the language code before semicolon (q-value)
        primary = primary.split(";")[0].trim();
        // Normalize case and strip country code (e.g., vi-VN -> vi, en-US -> en)
        primary = primary.toLowerCase();
        if (primary.contains("-")) {
            primary = primary.split("-")[0].trim();
        }
        return primary;
    }

    private void translateObject(Object obj, String lang, Set<Object> visited) throws IllegalAccessException {
        if (obj == null || visited.contains(obj)) {
            return;
        }

        // Avoid infinite recursion for cyclic references
        visited.add(obj);

        // Detach entity to prevent Hibernate from persisting translations to database
        try {
            if (entityManager.contains(obj)) {
                entityManager.detach(obj);
            }
        } catch (Exception e) {
            // Ignore if not an entity
        }

        Class<?> clazz = obj.getClass();

        // If it's a collection, translate each item
        if (obj instanceof Collection) {
            Collection<?> col = (Collection<?>) obj;
            for (Object item : col) {
                if (item != null) {
                    translateObject(item, lang, visited);
                }
            }
            return;
        }

        // If it's a map, translate values
        if (obj instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) obj;
            for (Object val : map.values()) {
                if (val != null) {
                    translateObject(val, lang, visited);
                }
            }
            return;
        }

        // Skip basic Java types, numbers, dates, wrappers, and third party libs - only traverse our app classes
        String pkgName = clazz.getPackageName();
        if (pkgName == null || !pkgName.startsWith("com.haniu")) {
            return;
        }

        // Traverse all fields of the class and superclasses
        while (clazz != null && !clazz.getName().startsWith("java.lang")) {
            Field[] fields = clazz.getDeclaredFields();
            for (Field field : fields) {
                field.setAccessible(true);
                Object val = field.get(obj);
                if (val == null) {
                    continue;
                }

                if (val instanceof String && TRANSLATABLE_FIELDS.contains(field.getName())) {
                    String originalText = (String) val;
                    if (!originalText.trim().isEmpty()) {
                        String translatedText;
                        if (originalText.trim().startsWith("{") || originalText.trim().startsWith("[")) {
                            translatedText = translateJsonString(originalText, lang);
                        } else {
                            translatedText = translationService.translate(originalText, lang);
                        }
                        field.set(obj, translatedText);
                    }
                } else {
                    // Recursively translate nested objects
                    translateObject(val, lang, visited);
                }
            }
            clazz = clazz.getSuperclass();
        }
    }

    private String translateJsonString(String jsonStr, String lang) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode rootNode = mapper.readTree(jsonStr);
            
            // 1. Collect all translatable texts from JSON
            List<String> textsToTranslate = new ArrayList<>();
            collectTexts(rootNode, textsToTranslate, "");
            
            if (!textsToTranslate.isEmpty()) {
                // 2. Perform batch translation
                Map<String, String> translationMap = new HashMap<>();
                String delimiter = " ___ ";
                String combined = String.join(delimiter, textsToTranslate);
                String translated = translationService.translate(combined, lang);
                
                // Split back. Use regex to split with optional spaces around delimiter
                String[] translatedArray = translated.split("\\s*___\\s*");
                
                if (translatedArray.length == textsToTranslate.size()) {
                    for (int i = 0; i < textsToTranslate.size(); i++) {
                        translationMap.put(textsToTranslate.get(i), translatedArray[i].trim());
                    }
                } else {
                    // Fallback to translate individual texts if split sizes don't match
                    for (String text : textsToTranslate) {
                        if (!translationMap.containsKey(text)) {
                            translationMap.put(text, translationService.translate(text, lang));
                        }
                    }
                }
                
                // 3. Apply translations back to JSON Node
                applyTranslations(rootNode, translationMap, "");
            }
            
            return mapper.writeValueAsString(rootNode);
        } catch (Exception e) {
            return translationService.translate(jsonStr, lang);
        }
    }

    private void collectTexts(com.fasterxml.jackson.databind.JsonNode node, List<String> textsToTranslate, String currentKey) {
        if (node.isObject()) {
            com.fasterxml.jackson.databind.node.ObjectNode objectNode = (com.fasterxml.jackson.databind.node.ObjectNode) node;
            Iterator<Map.Entry<String, com.fasterxml.jackson.databind.JsonNode>> fields = objectNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, com.fasterxml.jackson.databind.JsonNode> entry = fields.next();
                String key = entry.getKey();
                com.fasterxml.jackson.databind.JsonNode valNode = entry.getValue();
                if (valNode.isTextual()) {
                    if (TRANSLATABLE_JSON_KEYS.contains(key)) {
                        String text = valNode.asText();
                        if (text != null && !text.trim().isEmpty()) {
                            textsToTranslate.add(text);
                        }
                    }
                } else {
                    collectTexts(valNode, textsToTranslate, key);
                }
            }
        } else if (node.isArray()) {
            com.fasterxml.jackson.databind.node.ArrayNode arrayNode = (com.fasterxml.jackson.databind.node.ArrayNode) node;
            for (int i = 0; i < arrayNode.size(); i++) {
                com.fasterxml.jackson.databind.JsonNode element = arrayNode.get(i);
                if (element.isTextual() && TRANSLATABLE_JSON_KEYS.contains(currentKey)) {
                    String text = element.asText();
                    if (text != null && !text.trim().isEmpty()) {
                        textsToTranslate.add(text);
                    }
                } else {
                    collectTexts(element, textsToTranslate, currentKey);
                }
            }
        }
    }

    private void applyTranslations(com.fasterxml.jackson.databind.JsonNode node, Map<String, String> translationMap, String currentKey) {
        if (node.isObject()) {
            com.fasterxml.jackson.databind.node.ObjectNode objectNode = (com.fasterxml.jackson.databind.node.ObjectNode) node;
            List<String> keys = new ArrayList<>();
            objectNode.fieldNames().forEachRemaining(keys::add);
            for (String key : keys) {
                com.fasterxml.jackson.databind.JsonNode valNode = objectNode.get(key);
                if (valNode == null) {
                    continue;
                }
                if (valNode.isTextual()) {
                    if (TRANSLATABLE_JSON_KEYS.contains(key)) {
                        String originalText = valNode.asText();
                        String translatedText = translationMap.get(originalText);
                        if (translatedText != null) {
                            objectNode.put(key, translatedText);
                        }
                    }
                } else {
                    applyTranslations(valNode, translationMap, key);
                }
            }
        } else if (node.isArray()) {
            com.fasterxml.jackson.databind.node.ArrayNode arrayNode = (com.fasterxml.jackson.databind.node.ArrayNode) node;
            for (int i = 0; i < arrayNode.size(); i++) {
                com.fasterxml.jackson.databind.JsonNode element = arrayNode.get(i);
                if (element.isTextual() && TRANSLATABLE_JSON_KEYS.contains(currentKey)) {
                    String originalText = element.asText();
                    String translatedText = translationMap.get(originalText);
                    if (translatedText != null) {
                        arrayNode.set(i, new com.fasterxml.jackson.databind.node.TextNode(translatedText));
                    }
                } else {
                    applyTranslations(element, translationMap, currentKey);
                }
            }
        }
    }
}
