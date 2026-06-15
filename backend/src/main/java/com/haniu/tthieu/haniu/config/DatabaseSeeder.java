package com.haniu.tthieu.haniu.config;

import com.haniu.tthieu.haniu.entity.enums.ProductStatus;
import com.haniu.tthieu.haniu.entity.product.*;
import com.haniu.tthieu.haniu.repository.*;
import com.haniu.tthieu.haniu.entity.system.SystemConfig;
import com.haniu.tthieu.haniu.entity.marketing.Post;
import com.haniu.tthieu.haniu.entity.marketing.Story;
import com.haniu.tthieu.haniu.entity.marketing.Testimonial;
import com.haniu.tthieu.haniu.entity.marketing.UgcItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.haniu.tthieu.haniu.entity.enums.Role;
import com.haniu.tthieu.haniu.entity.enums.UserStatus;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemConfigRepository systemConfigRepository;
    private final PostRepository postRepository;
    private final StoryRepository storyRepository;
    private final TestimonialRepository testimonialRepository;
    private final UgcItemRepository ugcItemRepository;
    private final jakarta.persistence.EntityManager entityManager;
    private final org.springframework.transaction.support.TransactionTemplate transactionTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
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
            log.info(">>> [DB Check] Current Occasions in DB: " + occasionRepository.findAll().stream().map(o -> o.getName()).toList());
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

        seedSystemConfigs();
        seedPosts();
        seedStories();
        seedTestimonials();
        seedUgcItems();
        seedUsers();

        if (categoryRepository.count() > 0) {
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

        // 2. Seed Collection
        Collection collection = Collection.builder()
                .name("Bộ sưu tập quà tặng gỗ khắc tên")
                .slug("bst-qua-tang-go-khac-ten")
                .description("Các sản phẩm quà tặng gỗ tự nhiên, hỗ trợ khắc tên và thông điệp cá nhân hóa.")
                .isActive(true)
                .build();
        collection = collectionRepository.save(collection);

        // 3. Seed Categories
        Category lySu = Category.builder()
                .name("Ly sứ")
                .slug("ly-su")
                .description("Các mẫu ly cốc sứ cao cấp, in hình và khắc chữ theo yêu cầu")
                .isActive(true)
                .isFeatured(true)
                .sortOrder(1)
                .build();
        lySu = categoryRepository.save(lySu);

        Category soDa = Category.builder()
                .name("Sổ da")
                .slug("so-da")
                .description("Sổ tay bìa da thật, thiết kế sang trọng, thích hợp làm quà tặng doanh nghiệp")
                .isActive(true)
                .isFeatured(true)
                .sortOrder(2)
                .build();
        soDa = categoryRepository.save(soDa);

        Category hoaSap = Category.builder()
                .name("Hoa sáp")
                .slug("hoa-sap")
                .description("Hộp quà hoa hồng sáp thơm vĩnh cửu tinh tế, lãng mạn")
                .isActive(true)
                .isFeatured(true)
                .sortOrder(3)
                .build();
        hoaSap = categoryRepository.save(hoaSap);

        Category comboQua = Category.builder()
                .name("Combo quà tặng")
                .slug("combo-qua-tang")
                .description("Các set quà phối sẵn sang trọng cho mọi dịp đặc biệt")
                .isActive(true)
                .isFeatured(true)
                .sortOrder(4)
                .build();
        comboQua = categoryRepository.save(comboQua);

        // Seed Attribute Definitions
        if (attributeDefinitionRepository.count() == 0) {
            log.info("Seeding dynamic Attribute Definitions...");
            
            // Global Attributes
            AttributeDefinition xuatXu = AttributeDefinition.builder()
                    .name("Xuất xứ")
                    .code("xuat_xu")
                    .type(com.haniu.tthieu.haniu.entity.enums.AttributeType.TEXT)
                    .isRequired(false)
                    .isFilterable(true)
                    .build();
            attributeDefinitionRepository.save(xuatXu);

            AttributeDefinition baoHanh = AttributeDefinition.builder()
                    .name("Thời gian bảo hành")
                    .code("bao_hanh")
                    .type(com.haniu.tthieu.haniu.entity.enums.AttributeType.SELECT)
                    .options("[\"Không bảo hành\", \"3 tháng\", \"6 tháng\", \"12 tháng\"]")
                    .isRequired(false)
                    .isFilterable(false)
                    .build();
            attributeDefinitionRepository.save(baoHanh);

            // Category Specific: Sổ da (soDa)
            AttributeDefinition chatLieuBia = AttributeDefinition.builder()
                    .category(soDa)
                    .name("Chất liệu bìa")
                    .code("chat_lieu_bia")
                    .type(com.haniu.tthieu.haniu.entity.enums.AttributeType.SELECT)
                    .options("[\"Da PU cao cấp\", \"Da bò thật 100%\", \"Da Simili\", \"Da Microfiber\"]")
                    .isRequired(true)
                    .isFilterable(true)
                    .build();
            attributeDefinitionRepository.save(chatLieuBia);

            AttributeDefinition soTrang = AttributeDefinition.builder()
                    .category(soDa)
                    .name("Số trang")
                    .code("so_trang")
                    .type(com.haniu.tthieu.haniu.entity.enums.AttributeType.NUMBER)
                    .isRequired(false)
                    .isFilterable(false)
                    .build();
            attributeDefinitionRepository.save(soTrang);

            // Category Specific: Ly sứ (lySu)
            AttributeDefinition dungTich = AttributeDefinition.builder()
                    .category(lySu)
                    .name("Dung tích ly")
                    .code("dung_tich")
                    .type(com.haniu.tthieu.haniu.entity.enums.AttributeType.SELECT)
                    .options("[\"250ml\", \"350ml\", \"450ml\", \"500ml\"]")
                    .isRequired(true)
                    .isFilterable(true)
                    .build();
            attributeDefinitionRepository.save(dungTich);

            AttributeDefinition coNap = AttributeDefinition.builder()
                    .category(lySu)
                    .name("Có nắp đậy")
                    .code("nap_day")
                    .type(com.haniu.tthieu.haniu.entity.enums.AttributeType.BOOLEAN)
                    .isRequired(false)
                    .isFilterable(true)
                    .build();
            attributeDefinitionRepository.save(coNap);
        }

        // 4. Seed Occasions
        Occasion sinhNhat = Occasion.builder()
                .name("Sinh nhật")
                .slug("sinh-nhat")
                .description("Quà tặng sinh nhật ý nghĩa cho bạn bè và người thân")
                .startDate("01-01")
                .endDate("12-31")
                .isActive(true)
                .build();
        sinhNhat = occasionRepository.save(sinhNhat);

        Occasion leTinhNhan = Occasion.builder()
                .name("Lễ tình nhân")
                .slug("le-tinh-nhan")
                .description("Quà tặng Valentine lãng mạn và ngọt ngào")
                .startDate("02-14")
                .endDate("02-14")
                .isActive(true)
                .build();
        leTinhNhan = occasionRepository.save(leTinhNhan);

        Occasion quocKhanh = Occasion.builder()
                .name("Quốc khánh 2-9")
                .slug("quoc-khanh-2-9")
                .description("Quà lưu niệm yêu nước nhân dịp Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam")
                .startDate("09-02")
                .endDate("09-02")
                .isActive(true)
                .build();
        quocKhanh = occasionRepository.save(quocKhanh);

        Occasion nhaGiao = Occasion.builder()
                .name("Ngày nhà giáo 20-11")
                .slug("ngay-nha-giao-20-11")
                .description("Quà tri ân thầy cô giáo nhân ngày 20-11")
                .startDate("11-20")
                .endDate("11-20")
                .isActive(true)
                .build();
        nhaGiao = occasionRepository.save(nhaGiao);

        // 5. Seed Recipients
        Recipient banTrai = Recipient.builder()
                .name("Bạn trai")
                .slug("ban-trai")
                .description("Quà tặng nam tính, độc đáo cho bạn trai")
                .isActive(true)
                .build();
        banTrai = recipientRepository.save(banTrai);

        Recipient banGai = Recipient.builder()
                .name("Bạn gái")
                .slug("ban-gai")
                .description("Quà tặng tinh tế, lãng mạn cho bạn gái")
                .isActive(true)
                .build();
        banGai = recipientRepository.save(banGai);

        Recipient thayCo = Recipient.builder()
                .name("Thầy cô")
                .slug("thay-co")
                .description("Quà tặng trang trọng tri ân thầy cô giáo")
                .isActive(true)
                .build();
        thayCo = recipientRepository.save(thayCo);

        Recipient boMe = Recipient.builder()
                .name("Bố mẹ")
                .slug("bo-me")
                .description("Quà tặng sức khỏe, hiếu kính dành cho đấng sinh thành")
                .isActive(true)
                .build();
        boMe = recipientRepository.save(boMe);

        Recipient doiTac = Recipient.builder()
                .name("Đối tác")
                .slug("doi-tac")
                .description("Quà tặng sang trọng cho doanh nghiệp và khách hàng đối tác")
                .isActive(true)
                .build();
        doiTac = recipientRepository.save(doiTac);

        // 6. Seed Products (Removed mock seeding to allow clean database)
        log.info("Database standard catalog seeding step: skipped mock products.");
    }

    private void updatePricesForExistingProducts() {
        systemConfigRepository.findByConfigKey("HOME_LAYOUT").ifPresent(config -> {
            String val = config.getConfigValue();
            if (val != null) {
                String newVal = val.replace("/#story", "/story").replace("/#collections", "/collections");
                if (!newVal.equals(val)) {
                    config.setConfigValue(newVal);
                    systemConfigRepository.save(config);
                    log.info("Updated HOME_LAYOUT config links to /story and /collections in database.");
                }
            }
        });
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@haniu.vn")) {
            log.info("Seeding admin user...");
            User admin = User.builder()
                    .email("admin@haniu.vn")
                    .password(passwordEncoder.encode("123456"))
                    .fullName("Haniu Admin")
                    .phone("0987654321")
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user successfully seeded!");
        }

        if (!userRepository.existsByEmail("test@haniu.vn")) {
            log.info("Seeding test user...");
            User testUser = User.builder()
                    .email("test@haniu.vn")
                    .password(passwordEncoder.encode("123456"))
                    .fullName("Nguyễn Văn Haniu")
                    .phone("0987654321")
                    .role(Role.USER)
                    .status(UserStatus.ACTIVE)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .build();
            userRepository.save(testUser);
            log.info("Test user successfully seeded!");
        }
    }



    private void seedSystemConfigs() {
        Optional<SystemConfig> existingOpt = systemConfigRepository.findByConfigKey("HOME_LAYOUT");
        if (existingOpt.isEmpty()) {
            log.info("Seeding default HOME_LAYOUT configuration...");
            String defaultConfig = """
            {
              "visibility": {
                "hero": true,
                "trustBar": true,
                "brandIntro": true,
                "categories": true,
                "featuredProducts": true,
                "collections": true,
                "benefits": true,
                "videoBanner": true,
                "socialProof": true,
                "howItWorks": true,
                "ugcFeed": true,
                "blog": true,
                "story": true,
                "cta": true,
                "faq": true
              },
              "header": {
                "logoText": "HANIU",
                "logoSubtitle": "",
                "menuLinks": [
                  { "name": "Trang chủ", "href": "/" },
                  { "name": "Sản phẩm", "href": "/products" },
                  { "name": "Bộ sưu tập", "href": "/collections" },
                  { "name": "Câu chuyện", "href": "/story" },
                  { "name": "Tin tức", "href": "/blog" },
                  { "name": "Yêu thích", "href": "/wishlist" }
                ],
                "isSticky": true
              },
              "announcementBar": {
                "text": "🚚 Miễn phí vận chuyển toàn quốc cho tất cả đơn hàng từ 499k",
                "linkText": "Mua ngay",
                "linkHref": "/#products",
                "isEnabled": true
              },
              "hero": {
                "layoutType": "slider",
                "slides": [
                  {
                    "id": "slide-1",
                    "backgroundImage": "/7329c11d-7fcf-45e3-a4d3-08c9f6764741.jfif",
                    "scriptTitle": "Quà theo",
                    "boldTitle": "Ý MUỐN",
                    "badgeText": "Quà ý nghĩa, trao gửi yêu thương",
                    "subtitle": "Mỗi món quà là một thông điệp yêu thương, được chuẩn bị bằng cả tấm lòng.",
                    "ctaText": "KHÁM PHÁ NGAY",
                    "ctaHref": "/#products",
                    "textLayout": "right",
                    "circleBadgeText": "HANDMADE • WITH LOVE • HANDMADE • WITH LOVE •",
                    "cardTitle": "From Love",
                    "cardSubtitle": ""
                  },
                  {
                    "id": "slide-2",
                    "backgroundImage": "/8c23c072-f852-4eb2-bf6b-c133fdb03a46.jfif",
                    "scriptTitle": "",
                    "boldTitle": "QUÀ THEO Ý MUỐN",
                    "badgeText": "",
                    "subtitle": "Chọn quà theo sở thích, theo dịp, theo cách riêng của bạn.",
                    "ctaText": "XEM NGAY",
                    "ctaHref": "/#products",
                    "textLayout": "left",
                    "circleBadgeText": "",
                    "cardTitle": "",
                    "cardSubtitle": ""
                  }
                ],
                "autoplay": true,
                "autoplaySpeed": 5000,
                "gridMainSlideId": "slide-1",
                "gridSubSlideId": "slide-2",
                "gridFeatures": [
                  {
                    "id": "feat-1",
                    "icon": "heart",
                    "title": "QUÀ Ý NGHĨA",
                    "desc": "Gửi gắm thông điệp yêu thương đến người nhận.",
                    "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80",
                    "tagText": ""
                  },
                  {
                    "id": "feat-2",
                    "icon": "sparkles",
                    "title": "HANDMADE",
                    "desc": "Sản phẩm được làm thủ công tỉ mỉ và chỉn chu.",
                    "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&auto=format&fit=crop&q=80",
                    "tagText": "From haniu with love"
                  },
                  {
                    "id": "feat-3",
                    "icon": "gift",
                    "title": "TẶNG GÌ CŨNG ĐÚNG",
                    "desc": "Đa dạng mẫu mã, phù hợp với mọi dịp đặc biệt.",
                    "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80",
                    "tagText": "For you"
                  }
                ]
              },
              "trustBar": {
                "items": [
                  { "icon": "★", "text": "50.000+ Khách hàng tin dùng", "title": "50.000+", "desc": "Khách hàng tin chọn" },
                  { "icon": "🚚", "text": "Giao hỏa tốc 2 giờ nội thành", "title": "Giao Hỏa Tốc", "desc": "Trong 2 giờ nội thành" },
                  { "icon": "🔄", "text": "Đổi trả dễ dàng trong 30 ngày", "title": "Đổi Trả Dễ Dàng", "desc": "Miễn phí trong 30 ngày" },
                  { "icon": "🛡️", "text": "Bảo mật thanh toán 100%", "title": "Bảo Mật 100%", "desc": "Thanh toán tuyệt đối an toàn" }
                ]
              },
              "brandIntro": {
                "title": "Kiến Tạo Những Kỷ Niệm Vô Giá",
                "subtitle": "VỀ HANIU",
                "description": "Được thành lập từ năm 2020, Haniu mang sứ mệnh biến những món quà bình thường thành những kỷ vật vô giá. Chúng tôi tin rằng mỗi món quà trao đi là một thông điệp yêu thương được gửi gắm trọn vẹn, được chế tác thủ công tinh xảo bởi những nghệ nhân lành nghề cùng công nghệ cá nhân hóa laser hiện đại.",
                "stats": [
                  { "value": "2020", "label": "Năm thành lập" },
                  { "value": "50.000+", "label": "Khách hàng tin chọn" },
                  { "value": "100%", "label": "Chế tác thủ công" },
                  { "value": "24/7", "label": "Tư vấn thiết kế" }
                ]
              },
              "categories": {
                "title": "Bộ Sưu Tập Quà Tặng Theo Dịp",
                "subtitle": "Lựa chọn món quà hoàn hảo nhất cho những cột mốc ý nghĩa trong cuộc sống",
                "items": [
                  { "name": "Quà Sinh Nhật", "slug": "sinh-nhat", "image": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop&q=80", "count": "24+ set quà" },
                  { "name": "Quà Tốt Nghiệp", "slug": "tot-nghiep", "image": "https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&auto=format&fit=crop&q=80", "count": "12+ set quà" },
                  { "name": "Quà Cặp Đôi", "slug": "cap-doi", "image": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80", "count": "18+ set quà" },
                  { "name": "Quà Doanh Nghiệp", "slug": "doanh-nghiep", "image": "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=80", "count": "30+ set quà" }
                ]
              },
              "benefits": {
                "title": "Trải Nghiệm Dịch Vụ Khác Biệt Tại Haniu",
                "items": [
                  { "icon": "✨", "title": "Cá Nhân Hóa Riêng", "desc": "Hỗ trợ khắc tên, thông điệp laser lên gỗ, da, gốm sứ theo yêu cầu riêng." },
                  { "icon": "🎨", "title": "Thiết Kế Độc Quyền", "desc": "Hộp quà, thiệp và cách sắp xếp đều do Haniu tự tay lên ý tưởng, không trùng lặp." },
                  { "icon": "🚀", "title": "Giao Hàng Hỏa Tốc", "desc": "Nhận hàng nhanh chóng trong 2 giờ tại khu vực nội thành, hỗ trợ giao toàn quốc." },
                  { "icon": "💎", "title": "Chất Liệu Premium", "desc": "Tất cả sản phẩm đều làm từ gỗ tự nhiên, da bò thật và gốm sứ men cao cấp." }
                ]
              },
              "videoBanner": {
                "title": "Nghệ Thuật Chế Tác Độc Bản",
                "subtitle": "Khám phá quy trình tỉ mỉ để tạo ra một tác phẩm quà tặng được khắc laser cá nhân hóa bởi Haniu.",
                "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "placeholderImage": "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80",
                "buttonText": "Xem Thêm Câu Chuyện",
                "buttonHref": "/#story"
              },
              "collections": {
                "title": "Bộ Sưu Tập Độc Quyền",
                "subtitle": "Dòng sản phẩm được thiết kế theo mùa và xu hướng nghệ thuật đương đại",
                "items": [
                  {
                    "title": "Summer Breeze Collection",
                    "subtitle": "Tông xanh bạc hà mát lạnh, ly sứ kèm thìa mạ vàng tinh tế",
                    "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80",
                    "href": "/?category=combo-qua-tang"
                  },
                  {
                    "title": "Valentine Sweet Love",
                    "subtitle": "Hộp gỗ thông khắc hình chân dung, nến thơm hoa hồng Pháp quyến rũ",
                    "image": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80",
                    "href": "/?occasion=valentine"
                  },
                  {
                    "title": "Graduation Hope Edition",
                    "subtitle": "Sổ tay da bò nguyên tấm khắc tên và năm tốt nghiệp kỷ niệm đáng nhớ",
                    "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80",
                    "href": "/?occasion=tot-nghiep"
                  }
                ]
              },
              "socialProof": {
                "title": "Cảm Nhận Từ Khách Hàng",
                "ratingScore": "4.9",
                "reviewsCount": "1.250+",
                "reviews": [
                  { "id": "r1", "name": "Nguyễn Thu Trang", "role": "Khách mua Quà Sinh Nhật", "content": "Mình rất bất ngờ về chất lượng khắc tên trên ly sứ. Rất sắc nét và tinh tế! Bạn gái mình nhận quà thích lắm, khóc luôn vì xúc động.", "rating": 5, "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" },
                  { "id": "r2", "name": "Trần Anh Tuấn", "role": "Giám đốc nhân sự TechCorp", "content": "Đặt 200 set quà doanh nghiệp khắc logo công ty cho đối tác dịp lễ, Haniu làm siêu nhanh, đóng gói sang trọng, đối tác ai cũng khen chu đáo.", "rating": 5, "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" },
                  { "id": "r3", "name": "Lê Minh Thảo", "role": "Khách mua Quà Kỷ Niệm", "content": "Sổ tay da thật sờ rất sướng tay, thơm mùi da tự nhiên. Dịch vụ khắc laser miễn phí rất chuyên nghiệp. Hộp quà đóng gói siêu đẹp và chắc chắn.", "rating": 5, "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" }
                ]
              },
              "howItWorks": {
                "title": "Quy Trình Tạo Nên Món Quà Độc Bản",
                "subtitle": "Từ ý tưởng đến món quà hoàn thiện, mỗi chi tiết đều được chăm chút để mang đến trải nghiệm trao tặng đầy ý nghĩa.",
                "steps": [
                  { "number": "01", "title": "Chọn Mẫu Quà", "desc": "Khám phá bộ sưu tập quà tặng được tuyển chọn kỹ lưỡng hoặc tự do kết hợp các sản phẩm yêu thích để tạo nên set quà mang dấu ấn riêng.", "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80" },
                  { "number": "02", "title": "Cá Nhân Hóa", "desc": "Thêm tên, ngày kỷ niệm hoặc thông điệp đặc biệt. Công nghệ khắc laser tinh xảo giúp mỗi món quà trở nên duy nhất.", "image": "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&auto=format&fit=crop&q=80" },
                  { "number": "03", "title": "Xác Nhận Thiết Kế", "desc": "Nhận bản mô phỏng trực quan từ đội ngũ thiết kế và duyệt trước khi sản phẩm được chế tác chính thức.", "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80" },
                  { "number": "04", "title": "Nhận Quà Hoàn Mỹ", "desc": "Món quà được hoàn thiện, đóng gói sang trọng cùng thiệp viết tay và giao đến tận nơi với sự chỉn chu trong từng chi tiết.", "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80" }
                ]
              },
              "ugcFeed": {
                "title": "Khoảnh Khắc Của Haniu",
                "hashtag": "#mygiftmoment",
                "items": [
                  { "id": "u1", "imageUrl": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80", "link": "https://instagram.com" },
                  { "id": "u2", "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80", "link": "https://instagram.com" },
                  { "id": "u3", "imageUrl": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80", "link": "https://instagram.com" },
                  { "id": "u4", "imageUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80", "link": "https://instagram.com" },
                  { "id": "u5", "imageUrl": "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=80", "link": "https://instagram.com" },
                  { "id": "u6", "imageUrl": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&auto=format&fit=crop&q=80", "link": "https://instagram.com" }
                ]
              },
              "blog": {
                "title": "Góc Chia Sẻ Kinh Nghiệm",
                "subtitle": "Những lời khuyên bổ ích giúp bạn lựa chọn và trao gửi những lời nhắn nhủ tuyệt vời nhất",
                "items": [
                  {
                    "id": "b1",
                    "title": "Top 10 món quà tốt nghiệp ý nghĩa lưu giữ kỷ niệm tuổi học trò",
                    "summary": "Ngày tốt nghiệp là bước ngoặt lớn của cuộc đời. Cùng Haniu điểm qua những set quà lưu niệm độc bản tinh tế thích hợp tặng bạn bè, thầy cô.",
                    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=80",
                    "date": "22 Tháng 5, 2026",
                    "href": "/#blog"
                  },
                  {
                    "id": "b2",
                    "title": "Nghệ thuật tặng quà cho đối tác doanh nghiệp nâng tầm thương hiệu",
                    "summary": "Quà tặng doanh nghiệp không chỉ là phép lịch sự, mà là đại diện cho uy tín. Cách chọn chất liệu hộp gỗ cao cấp và lời chúc tinh tế.",
                    "image": "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=80",
                    "date": "15 Tháng 5, 2026",
                    "href": "/#blog"
                  },
                  {
                    "id": "b3",
                    "title": "Cách ghi lời chúc khắc laser cá nhân hóa đầy cảm xúc cho người thương",
                    "summary": "Ý tưởng chọn câu trích dẫn, ngày kỷ niệm hay lời nhắn ngọt ngào để khắc lên sổ tay da và bình giữ nhiệt gỗ tre tặng người yêu.",
                    "image": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80",
                    "date": "10 Tháng 5, 2026",
                    "href": "/#blog"
                  },
                  {
                    "id": "b4",
                    "title": "5 set quà tặng kỷ niệm ngày cưới ngọt ngào và lãng mạn nhất",
                    "summary": "Gợi ý những set quà tặng kỷ niệm ngày cưới thiết kế tinh tế hỗ trợ khắc tên, ngày cưới kỷ niệm ý nghĩa của hai vợ chồng.",
                    "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80",
                    "date": "05 Tháng 5, 2026",
                    "href": "/#blog"
                  }
                ]
              },
              "story": {
                "title": "Nghệ Thuật Từ",
                "titleHighlight": "Những Bàn Tay",
                "titlePart2": "Thủ Công",
                "subtitle": "Hành trình chăm chút tỉ mỉ cho từng góc cạnh hộp quà",
                "content": "Tại xưởng chế tác của Haniu, mỗi chi tiết nhỏ đều được chúng tôi trân quý. Từ khâu tuyển chọn những tấm da bò nguyên tấm, mài giũa các góc cạnh của gỗ, cho đến kỹ thuật nung men gốm sứ hỏa biến độc bản. Chúng tôi không sản xuất công nghiệp hàng loạt. Mỗi món quà bạn cầm trên tay đều mang hơi ấm và tâm huyết của những người thợ thủ công Việt Nam.",
                "videoPlaceholderUrl": "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80",
                "videoTitle": "Xem video Behind the Scenes",
                "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
              },
              "cta": {
                "title": "Tạo Nên Món Quà Mang Dấu Ấn Riêng Của Bạn",
                "subtitle": "Chỉ mất 2 phút để cá nhân hóa một món quà đầy ý nghĩa dành tặng người thương.",
                "buttonText": "Bắt đầu thiết kế ngay",
                "buttonHref": "/#products"
              },
              "faq": {
                "title": "Những Câu Hỏi Thường Gặp",
                "items": [
                  { "question": "Thời gian khắc laser cá nhân hóa mất bao lâu?", "answer": "Haniu sử dụng máy khắc laser công nghệ cao thế hệ mới, quy trình khắc tên thông thường chỉ mất từ 15-30 phút. Do đó, đơn hàng hỏa tốc 2 giờ vẫn được đảm bảo giao đúng hẹn." },
                  { "question": "Tôi có thể xem trước thiết kế khắc laser trước khi thực hiện không?", "answer": "Có, sau khi bạn đặt hàng, bộ phận thiết kế của Haniu sẽ thiết kế layout chữ/hình ảnh và gửi ảnh phác thảo (mockup) qua Zalo/Email để bạn duyệt. Haniu chỉ tiến hành khắc khi bạn đã hoàn toàn đồng ý." },
                  { "question": "Haniu có chính sách đổi trả như thế nào đối với quà cá nhân hóa?", "answer": "Đối với sản phẩm có khắc tên/cá nhân hóa, Haniu cam kết 1 đổi 1 miễn phí nếu có lỗi từ phía sản xuất (sai chính tả so với bản duyệt, trầy xước, nứt vỡ do vận chuyển). Với các sản phẩm không cá nhân hóa, bạn được đổi trả trong vòng 7 ngày." },
                  { "question": "Hộp quà của Haniu đã bao gồm những gì?", "answer": "Tất cả các set combo quà tặng tại Haniu đều được đóng gói tiêu chuẩn bao gồm: Hộp cứng cao cấp lót rơm giấy, ruy băng lụa thắt nơ nghệ thuật, thiệp viết tay theo yêu cầu và túi giấy sang trọng đi kèm để bạn tiện đem tặng." }
                ]
              },
              "footer": {
                "description": "Haniu - Thương hiệu quà tặng thiết kế thủ công và cá nhân hóa hàng đầu Việt Nam. Nơi biến những món quà bình thường thành kỷ vật vô giá.",
                "address": "Số 12, Ngõ 192 Kim Mã, Ba Đình, Hà Nội",
                "phone": "0987.654.321",
                "email": "contact@haniu.vn",
                "facebookUrl": "https://facebook.com/haniu",
                "instagramUrl": "https://instagram.com/haniu",
                "tiktokUrl": "https://tiktok.com/@haniu"
              },
              "welcomeScreen": {
                "isEnabled": true,
                "welcomeText": "HANIU GIFT SHOP",
                "welcomeSubtitle": "Thiết kế độc bản - Trọn vẹn yêu thương",
                "durationMs": 2500
              },
              "trustBadges": {
                "showGenuine": true,
                "showReturns": true,
                "showShipping": true,
                "showPayment": true,
                "showSupport": true
              },
              "productDetails": {
                "showPromotions": true,
                "promotions": [
                  "Miễn phí ship cho đơn từ 499k",
                  "Giảm 10% khi mua 2 hộp quà",
                  "Tặng thiệp viết tay miễn phí",
                  "Freeship nội thành Hà Nội"
                ],
                "showWhyChooseUs": true,
                "whyChooseUs": [
                  { "icon": "🌹", "text": "Hoa sáp thơm giữ màu tới 3 năm" },
                  { "icon": "🎁", "text": "Tặng kèm hộp quà cao cấp" },
                  { "icon": "✨", "text": "Có thể cá nhân hóa khắc tên" },
                  { "icon": "🚚", "text": "Giao nhanh toàn quốc" },
                  { "icon": "💝", "text": "Phù hợp mọi dịp đặc biệt" }
                ],
                "showDeliveryPolicy": true,
                "deliveryPolicy": {
                  "lines": [
                    { "label": "Nội thành Hà Nội", "value": "2 - 4h (Hỏa tốc)" },
                    { "label": "Toàn quốc", "value": "2 - 5 ngày" }
                  ],
                  "bulletPoints": [
                    "Kiểm tra hàng trước khi thanh toán (Đồng kiểm)",
                    "Đóng gói kín đáo, bảo mật thông tin quà tặng"
                  ]
                },
                "showBrandCommitment": true,
                "brandCommitment": [
                  "Hình ảnh sản phẩm thật 100% tự chụp",
                  "Đóng gói cẩn thận, chống va đập, bảo vệ tối đa",
                  "Hoàn tiền hoặc đổi mới ngay lập tức nếu sản phẩm không giống mô tả"
                ]
              }
            }
            """;
            SystemConfig config = SystemConfig.builder()
                    .configKey("HOME_LAYOUT")
                    .configValue(defaultConfig)
                    .build();
            systemConfigRepository.save(config);
            log.info("Default HOME_LAYOUT configuration seeded!");
        } else {
            SystemConfig config = existingOpt.get();
            String value = config.getConfigValue();
            if (value != null) {
                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    com.fasterxml.jackson.databind.JsonNode rootNode = mapper.readTree(value);
                    boolean updated = false;

                    if (rootNode.has("howItWorks")) {
                        com.fasterxml.jackson.databind.node.ObjectNode howItWorksNode = (com.fasterxml.jackson.databind.node.ObjectNode) rootNode.get("howItWorks");

                        // Update subtitle if it is the old one
                        if (howItWorksNode.has("subtitle") && howItWorksNode.get("subtitle").asText().equals("Chỉ với 4 bước đơn giản để tạo ra hộp quà chứa đựng tâm ý của riêng bạn")) {
                            howItWorksNode.put("subtitle", "Từ ý tưởng đến món quà hoàn thiện, mỗi chi tiết đều được chăm chút để mang đến trải nghiệm trao tặng đầy ý nghĩa.");
                            updated = true;
                        }

                        // Update steps with images and descriptions
                        if (howItWorksNode.has("steps") && howItWorksNode.get("steps").isArray()) {
                            com.fasterxml.jackson.databind.node.ArrayNode stepsNode = (com.fasterxml.jackson.databind.node.ArrayNode) howItWorksNode.get("steps");
                            String[] defaultImages = {
                                "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
                                "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&auto=format&fit=crop&q=80",
                                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80",
                                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80"
                            };
                            String[] oldDescs = {
                                "Lựa chọn giữa hàng chục set combo quà tặng sẵn có hoặc sản phẩm lẻ của Haniu.",
                                "Nhập tên, ngày kỷ niệm hoặc lời nhắn gửi để chúng tôi thiết kế bản khắc laser.",
                                "Đội ngũ thiết kế gửi bản vẽ mô phỏng cho bạn duyệt trước khi tiến hành chế tác.",
                                "Quà được gói hộp sang trọng kèm nơ lụa và thiệp viết tay, giao hỏa tốc đến người nhận."
                            };
                            String[] newDescs = {
                                "Khám phá bộ sưu tập quà tặng được tuyển chọn kỹ lưỡng hoặc tự do kết hợp các sản phẩm yêu thích để tạo nên set quà mang dấu ấn riêng.",
                                "Thêm tên, ngày kỷ niệm hoặc thông điệp đặc biệt. Công nghệ khắc laser tinh xảo giúp mỗi món quà trở nên duy nhất.",
                                "Nhận bản mô phỏng trực quan từ đội ngũ thiết kế và duyệt trước khi sản phẩm được chế tác chính thức.",
                                "Món quà được hoàn thiện, đóng gói sang trọng cùng thiệp viết tay và giao đến tận nơi với sự chỉn chu trong từng chi tiết."
                            };

                            for (int i = 0; i < stepsNode.size(); i++) {
                                com.fasterxml.jackson.databind.node.ObjectNode stepNode = (com.fasterxml.jackson.databind.node.ObjectNode) stepsNode.get(i);
                                
                                // Set image if missing
                                if (!stepNode.has("image")) {
                                    if (i < defaultImages.length) {
                                        stepNode.put("image", defaultImages[i]);
                                        updated = true;
                                    }
                                }
                                
                                // Set descriptions if they match the old defaults
                                if (stepNode.has("desc") && i < oldDescs.length && i < newDescs.length) {
                                    if (stepNode.get("desc").asText().equals(oldDescs[i])) {
                                        stepNode.put("desc", newDescs[i]);
                                        updated = true;
                                    }
                                }
                            }
                        }
                    }

                    // Migrate the story configuration block
                    if (rootNode.has("story")) {
                        com.fasterxml.jackson.databind.node.ObjectNode storyNode = (com.fasterxml.jackson.databind.node.ObjectNode) rootNode.get("story");
                        if (!storyNode.has("titleHighlight")) {
                            storyNode.put("titleHighlight", "Những Bàn Tay");
                            updated = true;
                        }
                        if (!storyNode.has("titlePart2")) {
                            storyNode.put("titlePart2", "Thủ Công");
                            updated = true;
                        }
                        if (storyNode.has("title") && storyNode.get("title").asText().equals("Nghệ Thuật Từ Những Bàn Tay Thủ Công")) {
                            storyNode.put("title", "Nghệ Thuật Từ");
                            updated = true;
                        }
                        if (!storyNode.has("videoUrl") || storyNode.get("videoUrl").asText().isEmpty() || storyNode.get("videoUrl").asText().contains("mixkit.co")) {
                            storyNode.put("videoUrl", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4");
                            updated = true;
                        }
                        if (!storyNode.has("videoPlaceholderUrl") || storyNode.get("videoPlaceholderUrl").asText().isEmpty()) {
                            storyNode.put("videoPlaceholderUrl", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80");
                            updated = true;
                        }
                        if (!storyNode.has("videoTitle") || storyNode.get("videoTitle").asText().isEmpty()) {
                            storyNode.put("videoTitle", "Xem video Behind the Scenes");
                            updated = true;
                        }
                    } else {
                        com.fasterxml.jackson.databind.node.ObjectNode storyNode = mapper.createObjectNode();
                        storyNode.put("title", "Nghệ Thuật Từ");
                        storyNode.put("titleHighlight", "Những Bàn Tay");
                        storyNode.put("titlePart2", "Thủ Công");
                        storyNode.put("subtitle", "Hành trình chăm chút tỉ mỉ cho từng góc cạnh hộp quà");
                        storyNode.put("content", "Tại xưởng chế tác của Haniu, mỗi chi tiết nhỏ đều được chúng tôi trân quý. Từ khâu tuyển chọn những tấm da bò nguyên tấm, mài giũa các góc cạnh of gỗ, cho đến kỹ thuật nung men gốm sứ hỏa biến độc bản. Chúng tôi không sản xuất công nghiệp hàng loạt. Mỗi món quà bạn cầm trên tay đều mang hơi ấm và tâm huyết of những người thợ thủ công Việt Nam.");
                        storyNode.put("videoPlaceholderUrl", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80");
                        storyNode.put("videoTitle", "Xem video Behind the Scenes");
                        storyNode.put("videoUrl", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4");
                        ((com.fasterxml.jackson.databind.node.ObjectNode) rootNode).set("story", storyNode);
                        updated = true;
                    }

                    // Migrate the videoBanner configuration block to replace mixkit
                    if (rootNode.has("videoBanner")) {
                        com.fasterxml.jackson.databind.node.ObjectNode videoBannerNode = (com.fasterxml.jackson.databind.node.ObjectNode) rootNode.get("videoBanner");
                        if (videoBannerNode.has("videoUrl") && videoBannerNode.get("videoUrl").asText().contains("mixkit.co")) {
                            videoBannerNode.put("videoUrl", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4");
                            updated = true;
                        }
                    }

                    // Migrate header.menuLinks to contain only primary pages and clean up extra ones to avoid clutter
                    if (rootNode.has("header")) {
                        com.fasterxml.jackson.databind.node.ObjectNode headerNode = (com.fasterxml.jackson.databind.node.ObjectNode) rootNode.get("header");
                        if (headerNode.has("menuLinks") && headerNode.get("menuLinks").isArray()) {
                            com.fasterxml.jackson.databind.node.ArrayNode menuLinksNode = (com.fasterxml.jackson.databind.node.ArrayNode) headerNode.get("menuLinks");
                            
                            boolean hasBlog = false;
                            java.util.List<Integer> indicesToRemove = new java.util.ArrayList<>();
                            
                            for (int i = 0; i < menuLinksNode.size(); i++) {
                                com.fasterxml.jackson.databind.JsonNode node = menuLinksNode.get(i);
                                if (node.has("href")) {
                                    String href = node.get("href").asText();
                                    if (href.equals("/blog")) {
                                        hasBlog = true;
                                    } else if (href.equals("/faq") || href.equals("/contact") || href.equals("/about")) {
                                        indicesToRemove.add(i);
                                    }
                                }
                            }
                            
                            // Remove in reverse order to keep indices correct
                            if (!indicesToRemove.isEmpty()) {
                                for (int i = indicesToRemove.size() - 1; i >= 0; i--) {
                                    menuLinksNode.remove(indicesToRemove.get(i));
                                }
                                updated = true;
                            }
                            
                            if (!hasBlog) {
                                com.fasterxml.jackson.databind.node.ObjectNode link = mapper.createObjectNode();
                                link.put("name", "Tin tức");
                                link.put("href", "/blog");
                                menuLinksNode.add(link);
                                updated = true;
                            }
                        }
                    }

                    if (updated) {
                        config.setConfigValue(mapper.writeValueAsString(rootNode));
                        systemConfigRepository.save(config);
                        log.info("HOME_LAYOUT configuration successfully migrated and saved!");
                    }
                } catch (Exception e) {
                    log.error("Failed to migrate HOME_LAYOUT configuration: " + e.getMessage());
                }
            }
        }
    }

    private void seedPosts() {
        if (postRepository.count() == 0) {
            log.info("Seeding initial blog posts...");
            
            Post post1 = Post.builder()
                    .title("Top 10 món quà tốt nghiệp ý nghĩa lưu giữ kỷ niệm tuổi học trò")
                    .slug("top-10-mon-qua-tot-nghiep-y-nghia")
                    .summary("Ngày tốt nghiệp là bước ngoặt lớn của cuộc đời. Cùng Haniu điểm qua những set quà lưu niệm độc bản tinh tế thích hợp tặng bạn bè, thầy cô.")
                    .content("<p>Ngày tốt nghiệp đánh dấu một cột mốc quan trọng, khép lại những năm tháng học trò mơ mộng để mở ra cánh cổng tương lai tươi sáng. Nhằm lưu giữ những kỷ niệm đẹp đẽ ấy, Haniu xin gợi ý cho bạn 10 món quà tốt nghiệp vô cùng ý nghĩa và có thể cá nhân hóa khắc tên riêng.</p><p>Sổ tay gỗ tự nhiên khắc hình chân dung và lời nhắn gửi chúc mừng là một lựa chọn vô cùng trang trọng.</p>")
                    .imageUrl("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=80")
                    .active(true)
                    .publishedAt(LocalDateTime.now())
                    .build();
            postRepository.save(post1);

            Post post2 = Post.builder()
                    .title("Nghệ thuật tặng quà cho đối tác doanh nghiệp nâng tầm thương hiệu")
                    .slug("nghe-thuat-tang-qua-doi-tac-doanh-nghiep")
                    .summary("Quà tặng doanh nghiệp không chỉ là phép lịch sự, mà là đại diện cho uy tín. Cách chọn chất liệu hộp gỗ cao cấp và lời chúc tinh tế.")
                    .content("<p>Trong kinh doanh, mối quan hệ đối tác luôn là yếu tố sống còn. Một món quà tinh tế, chỉn chu được khắc logo thương hiệu không chỉ thể hiện tấm lòng tri ân sâu sắc, mà còn là công cụ Marketing tinh tế giúp ghi dấu ấn đậm nét trong tâm trí đối tác.</p>")
                    .imageUrl("https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=80")
                    .active(true)
                    .publishedAt(LocalDateTime.now())
                    .build();
            postRepository.save(post2);

            Post post3 = Post.builder()
                    .title("Cách ghi lời chúc khắc laser cá nhân hóa đầy cảm xúc cho người thương")
                    .slug("cach-ghi-loi-chuc-khac-laser-ca-nhan-hoa")
                    .summary("Ý tưởng chọn câu trích dẫn, ngày kỷ niệm hay lời nhắn ngọt ngào để khắc lên sổ tay da và bình giữ nhiệt gỗ tre tặng người yêu.")
                    .content("<p>Cá nhân hóa quà tặng bằng công nghệ khắc laser là xu hướng được ưa chuộng nhất hiện nay. Haniu sẽ giúp bạn tuyển tập những lời chúc, câu trích dẫn ngắn và cách ghi ngày kỷ niệm lãng mạn nhất để gửi gắm tình yêu ngọt ngào.</p>")
                    .imageUrl("https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80")
                    .active(true)
                    .publishedAt(LocalDateTime.now())
                    .build();
            postRepository.save(post3);

            log.info("Initial blog posts seeded successfully!");
        }
    }

    private void seedStories() {
        if (storyRepository.count() == 0) {
            log.info("Seeding initial brand story...");
            Story story = Story.builder()
                    .title("Nghệ Thuật Từ Những Bàn Tay Thủ Công")
                    .subtitle("CÂU CHUYỆN THƯƠNG HIỆU")
                    .content("Tại xưởng chế tác của Haniu, mỗi chi tiết nhỏ đều được chúng tôi trân quý. Từ khâu tuyển chọn những tấm da bò nguyên tấm, mài giũa các góc cạnh của gỗ, cho đến kỹ thuật nung men gốm sứ hỏa biến độc bản. Chúng tôi không sản xuất công nghiệp hàng loạt. Mỗi món quà bạn cầm trên tay đều mang hơi ấm và tâm huyết của những người thợ thủ công Việt Nam.")
                    .videoPlaceholderUrl("https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80")
                    .videoTitle("Xem video Behind the Scenes")
                    .build();
            storyRepository.save(story);
            log.info("Initial brand story seeded!");
        }
    }

    private void seedTestimonials() {
        if (testimonialRepository.count() == 0) {
            log.info("Seeding initial testimonials...");
            
            Testimonial t1 = Testimonial.builder()
                    .name("Nguyễn Thu Trang")
                    .role("Khách mua Quà Sinh Nhật")
                    .content("Mình rất bất ngờ về chất lượng khắc tên trên ly sứ. Rất sắc nét và tinh tế! Bạn gái mình nhận quà thích lắm, khóc luôn vì xúc động.")
                    .rating(5)
                    .avatar("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80")
                    .active(true)
                    .build();
            testimonialRepository.save(t1);

            Testimonial t2 = Testimonial.builder()
                    .name("Trần Anh Tuấn")
                    .role("Giám đốc nhân sự TechCorp")
                    .content("Đặt 200 set quà doanh nghiệp khắc logo công ty cho đối tác dịp lễ, Haniu làm siêu nhanh, đóng gói sang trọng, đối tác ai cũng khen chu đáo.")
                    .rating(5)
                    .avatar("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80")
                    .active(true)
                    .build();
            testimonialRepository.save(t2);

            Testimonial t3 = Testimonial.builder()
                    .name("Lê Minh Thảo")
                    .role("Khách mua Quà Kỷ Niệm")
                    .content("Sổ tay da thật sờ rất sướng tay, thơm mùi da tự nhiên. Dịch vụ khắc laser miễn phí rất chuyên nghiệp. Hộp quà đóng gói siêu đẹp và chắc chắn.")
                    .rating(5)
                    .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80")
                    .active(true)
                    .build();
            testimonialRepository.save(t3);

            log.info("Initial testimonials seeded successfully!");
        }
    }

    private void seedUgcItems() {
        if (ugcItemRepository.count() == 0) {
            log.info("Seeding initial UGC items...");
            
            UgcItem u1 = UgcItem.builder().imageUrl("https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80").link("https://instagram.com").active(true).build();
            ugcItemRepository.save(u1);
            
            UgcItem u2 = UgcItem.builder().imageUrl("https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80").link("https://instagram.com").active(true).build();
            ugcItemRepository.save(u2);
            
            UgcItem u3 = UgcItem.builder().imageUrl("https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80").link("https://instagram.com").active(true).build();
            ugcItemRepository.save(u3);
            
            UgcItem u4 = UgcItem.builder().imageUrl("https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80").link("https://instagram.com").active(true).build();
            ugcItemRepository.save(u4);
            
            UgcItem u5 = UgcItem.builder().imageUrl("https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=80").link("https://instagram.com").active(true).build();
            ugcItemRepository.save(u5);
            
            UgcItem u6 = UgcItem.builder().imageUrl("https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&auto=format&fit=crop&q=80").link("https://instagram.com").active(true).build();
            ugcItemRepository.save(u6);
            
            log.info("Initial UGC items seeded successfully!");
        }
    }
}




