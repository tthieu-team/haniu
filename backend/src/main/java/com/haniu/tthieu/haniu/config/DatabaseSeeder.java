package com.haniu.tthieu.haniu.config;

import com.haniu.tthieu.haniu.entity.product.*;
import com.haniu.tthieu.haniu.repository.*;
import com.haniu.tthieu.haniu.config.seeder.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final OccasionRepository occasionRepository;
    private final RecipientRepository recipientRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final BrandRepository brandRepository;
    private final CollectionRepository collectionRepository;
    private final AttributeDefinitionRepository attributeDefinitionRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final jakarta.persistence.EntityManager entityManager;
    private final org.springframework.transaction.support.TransactionTemplate transactionTemplate;

    // Sub-seeders delegates
    private final UserSeeder userSeeder;
    private final SystemConfigSeeder systemConfigSeeder;
    private final MarketingSeeder marketingSeeder;
    private final PhotoboothAssetSeeder photoboothAssetSeeder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        try {
            entityManager.createNativeQuery("ALTER TABLE photobooth_templates ALTER COLUMN background TYPE TEXT").executeUpdate();
            entityManager.createNativeQuery("ALTER TABLE photobooth_templates ALTER COLUMN description TYPE TEXT").executeUpdate();
            entityManager.createNativeQuery("ALTER TABLE photobooth_templates ALTER COLUMN thumbnail TYPE TEXT").executeUpdate();
            log.info("Successfully altered photobooth_templates columns to TEXT.");
        } catch (Exception e) {
            log.warn("Could not alter photobooth_templates columns (might not exist yet or already altered): " + e.getMessage());
        }

        // Clean up mock products and mock orders from database
        try {
            List<String> mockSlugs = List.of(
                "ly-su-khac-ten-cao-cap-haniu", 
                "so-tay-bia-da-khac-logo", 
                "hop-qua-hoa-hong-sap-thom-va-gau-bong", 
                "set-qua-tang-quoc-khanh-2-9-doc-ban"
            );
            for (String slug : mockSlugs) {
                productRepository.findBySlug(slug).ifPresent(product -> {
                    log.info("Deleting mock product: {}", product.getName());
                    UUID prodId = product.getId();
                    
                    // 1. Delete order items referencing variants of this product
                    entityManager.createNativeQuery("DELETE FROM order_items WHERE product_variant_id IN (SELECT id FROM product_variants WHERE product_id = :prodId)")
                        .setParameter("prodId", prodId)
                        .executeUpdate();
                        
                    // 2. Delete cart items referencing variants of this product
                    entityManager.createNativeQuery("DELETE FROM cart_items WHERE product_variant_id IN (SELECT id FROM product_variants WHERE product_id = :prodId)")
                        .setParameter("prodId", prodId)
                        .executeUpdate();
                        
                    // 3. Delete media
                    entityManager.createNativeQuery("DELETE FROM product_medias WHERE product_id = :prodId")
                        .setParameter("prodId", prodId)
                        .executeUpdate();

                    // 4. Delete attributes
                    entityManager.createNativeQuery("DELETE FROM product_attributes WHERE product_id = :prodId")
                        .setParameter("prodId", prodId)
                        .executeUpdate();
                        
                    // 5. Delete variants
                    entityManager.createNativeQuery("DELETE FROM product_variants WHERE product_id = :prodId")
                        .setParameter("prodId", prodId)
                        .executeUpdate();

                    // 6. Delete reviews
                    entityManager.createNativeQuery("DELETE FROM reviews WHERE product_id = :prodId")
                        .setParameter("prodId", prodId)
                        .executeUpdate();

                    // 7. Delete product from occasions jointable
                    entityManager.createNativeQuery("DELETE FROM product_occasions WHERE product_id = :prodId")
                        .setParameter("prodId", prodId)
                        .executeUpdate();

                    // 8. Delete product from recipients jointable
                    entityManager.createNativeQuery("DELETE FROM product_recipients WHERE product_id = :prodId")
                        .setParameter("prodId", prodId)
                        .executeUpdate();

                    // 9. Delete the product itself (hard delete)
                    productRepository.delete(product);
                });
            }

            // 10. Clean up empty orders (orders that have 0 items left because they were mock orders)
            entityManager.createNativeQuery("DELETE FROM orders WHERE id NOT IN (SELECT DISTINCT order_id FROM order_items)").executeUpdate();
            log.info("Successfully cleaned up all mock products and their mock orders/cart references.");
        } catch (Exception e) {
            log.error("Failed to clean up mock products/orders: " + e.getMessage(), e);
        }

        try {
            entityManager.createNativeQuery("TRUNCATE TABLE translation_caches CASCADE").executeUpdate();
            log.info(">>> [DB Check] Truncated translation_caches to clear translation cache.");
        } catch (Exception e) {
            log.error("Failed to truncate translation_caches: " + e.getMessage());
        }

        try {
            log.info(">>> [DB Check] Current Occasions in DB: " + occasionRepository.findAll().stream().map(Occasion::getName).toList());
        } catch (Exception e) {
            log.error("Failed to print occasions: " + e.getMessage());
        }

        boolean hasJapanese = false;
        try {
            hasJapanese = occasionRepository.findAll().stream()
                    .anyMatch(o -> o.getName() != null && (o.getName().contains("建国記念日") || o.getName().contains("バレンタインデー") || o.getName().contains("?")));
        } catch (Exception e) {
            // Ignore if tables do not exist yet
        }

        if (hasJapanese) { // Clean Japanese translation leak if detected
            log.warn("Resetting DB tables to clean up Japanese translations...");
            try {
                transactionTemplate.executeWithoutResult(status -> {
                    entityManager.createNativeQuery("TRUNCATE TABLE reviews, order_items, orders, cart_items, carts, product_variants, products, categories, occasions, recipients, testimonials, posts, stories, ugc_items, product_medias, product_attributes, brands, collections, attribute_definitions, system_configurations, translation_caches CASCADE").executeUpdate();
                });
                log.info("Database truncated successfully. Re-seeding database...");
            } catch (Exception e) {
                log.error("Failed to truncate database: " + e.getMessage(), e);
            }
        }

        try {
            transactionTemplate.executeWithoutResult(status -> {
                systemConfigRepository.findByConfigKey("HOME_LAYOUT").ifPresent(config -> {
                    if (config.getConfigValue() != null && config.getConfigValue().contains("/faq")) {
                        systemConfigRepository.delete(config);
                        systemConfigRepository.flush();
                        log.info("Deleted old HOME_LAYOUT with extra menu links to force clean re-seed.");
                    }
                });
            });
        } catch (Exception e) {
            log.error("Failed to check or delete old HOME_LAYOUT: " + e.getMessage());
        }

        // Delegate Seeding tasks
        systemConfigSeeder.seed();
        marketingSeeder.seed();
        userSeeder.seed();
        photoboothAssetSeeder.seed();

        if (brandRepository.count() > 0) {
            log.info("Database already seeded. Updating existing product prices if needed.");
            updatePricesForExistingProducts();
            return;
        }

        log.info("Seeding initial database data...");

        // 1. Seed Brand
        Brand brand = Brand.builder()
                .name("Haniu Gift Shop")
                .slug("haniu-gift-shop")
                .description("Thương hiệu quà tặng cao cấp Haniu")
                .isActive(true)
                .build();
        brand = brandRepository.save(brand);

        log.info("Database standard catalog seeding step: skipped mock categories, collections, occasions and recipients.");
    }

    private void updatePricesForExistingProducts() {
        systemConfigRepository.findByConfigKey("HOME_LAYOUT").ifPresent(config -> {
            String val = config.getConfigValue();
            if (val != null) {
                String newVal = val.replace("/#story", "/story").replace("/#collections", "/collections");
                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    com.fasterxml.jackson.databind.JsonNode rootNode = mapper.readTree(newVal);
                    if (rootNode instanceof com.fasterxml.jackson.databind.node.ObjectNode) {
                        com.fasterxml.jackson.databind.node.ObjectNode root = (com.fasterxml.jackson.databind.node.ObjectNode) rootNode;
                        if (root.has("brandIntro")) {
                            com.fasterxml.jackson.databind.node.ObjectNode brandIntro = (com.fasterxml.jackson.databind.node.ObjectNode) root.get("brandIntro");
                            
                            // Check if it needs updating (e.g. still has old title or old stats format)
                            boolean needsUpdate = false;
                            if (!brandIntro.has("title") || !brandIntro.get("title").asText().equals("Nơi Những Món Quà Kể Câu Chuyện")) {
                                brandIntro.put("title", "Nơi Những Món Quà Kể Câu Chuyện");
                                needsUpdate = true;
                            }
                            if (!brandIntro.has("subtitle") || !brandIntro.get("subtitle").asText().equals("VỀ HANIU")) {
                                brandIntro.put("subtitle", "VỀ HANIU");
                                needsUpdate = true;
                            }
                            if (!brandIntro.has("description") || !brandIntro.get("description").asText().contains("Tại Haniu, mỗi món quà")) {
                                brandIntro.put("description", "Tại Haniu, mỗi món quà không chỉ là một vật phẩm, mà còn là cách lưu giữ những cảm xúc đẹp nhất. Chúng tôi tuyển chọn và tạo nên những sản phẩm quà tặng mang phong cách trẻ trung, tinh tế và giàu cảm xúc như gấu bông, photobooth, hoa handmade và các set quà cá nhân hóa.\n\nMỗi chi tiết đều được chăm chút với sự tỉ mỉ và tình yêu dành cho nghệ thuật quà tặng, giúp bạn dễ dàng gửi trao lời yêu thương, lời cảm ơn hay lời chúc mừng theo cách đặc biệt nhất.\n\nHaniu mong muốn trở thành người bạn đồng hành trong mọi cột mốc đáng nhớ của bạn và những người thân yêu.");
                                needsUpdate = true;
                            }
                            
                            // Check if stats are the old ones
                            boolean statsUpdated = false;
                            if (brandIntro.has("stats") && brandIntro.get("stats").isArray()) {
                                com.fasterxml.jackson.databind.node.ArrayNode stats = (com.fasterxml.jackson.databind.node.ArrayNode) brandIntro.get("stats");
                                if (stats.size() > 0 && stats.get(0).has("value") && stats.get(0).get("value").asText().equals("2020")) {
                                    statsUpdated = true;
                                }
                            } else {
                                statsUpdated = true;
                            }

                            if (statsUpdated) {
                                com.fasterxml.jackson.databind.node.ArrayNode statsNode = mapper.createArrayNode();
                                statsNode.add(mapper.createObjectNode().put("value", "🧸 500+").put("label", "Khách hàng tin chọn"));
                                statsNode.add(mapper.createObjectNode().put("value", "📸 2.000+").put("label", "Khoảnh khắc được lưu giữ"));
                                statsNode.add(mapper.createObjectNode().put("value", "🎁 100+").put("label", "Mẫu quà tặng độc đáo"));
                                statsNode.add(mapper.createObjectNode().put("value", "❤️ Hàng ngàn").put("label", "Lời yêu thương được trao gửi"));
                                brandIntro.set("stats", statsNode);
                                needsUpdate = true;
                            }

                            if (needsUpdate) {
                                newVal = mapper.writeValueAsString(root);
                            }
                        }
                    }
                } catch (Exception e) {
                    log.error("Failed to migrate HOME_LAYOUT brandIntro in database: " + e.getMessage());
                }

                if (!newVal.equals(val)) {
                    config.setConfigValue(newVal);
                    systemConfigRepository.save(config);
                    log.info("Updated HOME_LAYOUT config links and brandIntro text in database.");
                }
            }
        });
    }
}
