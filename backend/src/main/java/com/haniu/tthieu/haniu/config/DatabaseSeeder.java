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

    @Override
    @Transactional
    public void run(String... args) throws Exception {
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

        // 6. Seed Products
        // Product 1: Ly sứ khắc tên
        Set<Occasion> p1Occasions = new HashSet<>(List.of(sinhNhat, nhaGiao));
        Set<Recipient> p1Recipients = new HashSet<>(List.of(banTrai, banGai, thayCo));
        Product p1 = Product.builder()
                .category(lySu)
                .brand(brand)
                .collection(collection)
                .occasions(p1Occasions)
                .recipients(p1Recipients)
                .name("Ly sứ khắc tên cao cấp Haniu")
                .slug("ly-su-khac-ten-cao-cap-haniu")
                .sku("LYSU-KHACTEN-01")
                .shortDescription("Ly sứ men trắng cao cấp hỗ trợ khắc tên và in hình theo yêu cầu riêng biệt.")
                .description("Sản phẩm được làm từ đất sét trắng chọn lọc, nung ở nhiệt độ 1300 độ C loại bỏ hoàn toàn tạp chất có hại. Công nghệ khắc laser sắc nét giúp bạn lưu giữ thông điệp và hình ảnh cá nhân hóa độc đáo trên thân cốc.")
                .thumbnailUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600")
                .price(new BigDecimal("500000.00"))
                .salePrice(new BigDecimal("100000.00"))
                .costPrice(new BigDecimal("50000.00"))
                .stock(100)
                .material("Gốm sứ tráng men")
                .color("Trắng tuyết")
                .status(ProductStatus.PUBLISHED)
                .isFeatured(true)
                .isNew(true)
                .isCustomizable(true)
                .layoutTemplate("DEFAULT")
                .specifications("{\"Dung tích\": \"350ml\", \"Chiều cao\": \"9.5cm\", \"Đường kính miệng\": \"8cm\"}")
                .includedItems("{\"Cốc sứ Haniu tráng men\": \"1 chiếc\", \"Thìa inox mạ vàng\": \"1 chiếc\", \"Đế lót gỗ\": \"1 chiếc\", \"Hộp giấy quà tặng\": \"1 chiếc\"}")
                .publishedAt(LocalDateTime.now())
                .build();
        p1 = productRepository.save(p1);

        ProductVariant p1v1 = ProductVariant.builder()
                .product(p1)
                .name("Ly sứ khắc tên - 350ml")
                .sku("LYSU-KHACTEN-01-350")
                .price(new BigDecimal("500000.00"))
                .salePrice(new BigDecimal("100000.00"))
                .stock(50)
                .isActive(true)
                .build();
        productVariantRepository.save(p1v1);

        // Product 2: Sổ tay bìa da
        Set<Occasion> p2Occasions = new HashSet<>(List.of(sinhNhat));
        Set<Recipient> p2Recipients = new HashSet<>(List.of(doiTac, thayCo, boMe));
        Product p2 = Product.builder()
                .category(soDa)
                .brand(brand)
                .occasions(p2Occasions)
                .recipients(p2Recipients)
                .name("Sổ tay bìa da khắc logo")
                .slug("so-tay-bia-da-khac-logo")
                .sku("SODA-KHACLOGO-02")
                .shortDescription("Sổ tay A5 bìa da PU cao cấp tích hợp khe cài bút và ngăn đựng card visit tiện lợi.")
                .description("Cuốn sổ được chế tác tinh xảo với chất liệu da PU cao cấp mềm mịn, chống thấm nước tốt. Ruột sổ dùng giấy chống lóa định lượng 80gsm viết cực êm, không lem mực.")
                .thumbnailUrl("https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600")
                .price(new BigDecimal("250000.00"))
                .costPrice(new BigDecimal("90000.00"))
                .stock(200)
                .material("Da PU, Giấy Woodfree")
                .color("Nâu vân gỗ")
                .status(ProductStatus.PUBLISHED)
                .isFeatured(true)
                .isNew(true)
                .isCustomizable(true)
                .layoutTemplate("DEFAULT")
                .specifications("{\"Kích thước\": \"A5 (14.8 x 21 cm)\", \"Số trang\": \"200 trang\", \"Định lượng\": \"80gsm\"}")
                .includedItems("{\"Sổ tay bìa da PU\": \"1 cuốn\", \"Bút ký kim loại khắc tên\": \"1 chiếc\", \"Hộp xi carton lót lụa\": \"1 chiếc\"}")
                .publishedAt(LocalDateTime.now())
                .build();
        p2 = productRepository.save(p2);

        ProductVariant p2v1 = ProductVariant.builder()
                .product(p2)
                .name("Sổ tay bìa da - Nâu vân gỗ")
                .sku("SODA-KHACLOGO-02-BROWN")
                .price(new BigDecimal("250000.00"))
                .stock(100)
                .isActive(true)
                .build();
        productVariantRepository.save(p2v1);

        // Product 3: Hộp quà hoa sáp và gấu bông
        Set<Occasion> p3Occasions = new HashSet<>(List.of(leTinhNhan, sinhNhat));
        Set<Recipient> p3Recipients = new HashSet<>(List.of(banGai));
        Product p3 = Product.builder()
                .category(hoaSap)
                .brand(brand)
                .occasions(p3Occasions)
                .recipients(p3Recipients)
                .name("Hộp quà hoa hồng sáp thơm và gấu bông")
                .slug("hop-qua-hoa-hong-sap-thom-va-gau-bong")
                .sku("HOASAP-GAUBONG-03")
                .shortDescription("Hộp quà tặng trái tim chứa hoa sáp đỏ và chú gấu bông nhỏ ngọt ngào.")
                .description("Những bông hoa hồng được làm tỉ mỉ từ sáp thơm tự nhiên, mang hương thơm dịu nhẹ thoang thoảng và độ bền màu vĩnh cửu. Đây là món quà tuyệt vời nhất dành tặng nửa kia trong các dịp kỷ niệm.")
                .thumbnailUrl("https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600")
                .price(new BigDecimal("350000.00"))
                .salePrice(new BigDecimal("299000.00"))
                .costPrice(new BigDecimal("120000.00"))
                .stock(80)
                .material("Sáp tự nhiên, Hộp bìa cứng")
                .color("Đỏ nhung")
                .status(ProductStatus.PUBLISHED)
                .isFeatured(true)
                .isNew(false)
                .isCustomizable(false)
                .layoutTemplate("DEFAULT")
                .specifications("{\"Kích thước hộp\": \"25x25x12cm\", \"Số lượng hoa\": \"19 bông\", \"Độ bền hương\": \"Up to 3 years\"}")
                .includedItems("{\"Hộp đựng bìa cứng trái tim\": \"1 chiếc\", \"Hoa hồng sáp thơm\": \"19 bông\", \"Gấu bông nhỏ\": \"1 chiếc\", \"Đèn Led đom đóm\": \"1 bộ\"}")
                .publishedAt(LocalDateTime.now())
                .build();
        p3 = productRepository.save(p3);

        ProductVariant p3v1 = ProductVariant.builder()
                .product(p3)
                .name("Hộp quà hoa sáp đỏ - Gấu nâu")
                .sku("HOASAP-GAUBONG-03-RED")
                .price(new BigDecimal("350000.00"))
                .salePrice(new BigDecimal("299000.00"))
                .stock(40)
                .isActive(true)
                .build();
        productVariantRepository.save(p3v1);

        // Product 4: Set quà tặng Quốc Khánh 2-9
        Set<Occasion> p4Occasions = new HashSet<>(List.of(quocKhanh));
        Set<Recipient> p4Recipients = new HashSet<>(List.of(doiTac, boMe));
        Product p4 = Product.builder()
                .category(comboQua)
                .brand(brand)
                .collection(collection)
                .occasions(p4Occasions)
                .recipients(p4Recipients)
                .name("Set quà tặng Quốc Khánh 2-9 độc bản")
                .slug("set-qua-tang-quoc-khanh-2-9-doc-ban")
                .sku("COMBO-QUOCKHANH-04")
                .shortDescription("Combo quà tặng gỗ đặc biệt in hình bản đồ Việt Nam và cờ đỏ sao vàng.")
                .description("Hộp quà tặng gỗ thông cao cấp chứa một chiếc bình giữ nhiệt vỏ tre khắc bản đồ hình chữ S, một chiếc bút gỗ khắc tên và một cuốn sổ bìa gỗ độc đáo. Thể hiện niềm tự hào dân tộc và lòng yêu nước sâu sắc.")
                .thumbnailUrl("https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600")
                .price(new BigDecimal("500000.00"))
                .salePrice(new BigDecimal("100000.00"))
                .costPrice(new BigDecimal("180000.00"))
                .stock(50)
                .material("Gỗ thông tự nhiên, Tre, Inox 304")
                .color("Vàng tre tự nhiên")
                .status(ProductStatus.PUBLISHED)
                .isFeatured(true)
                .isNew(true)
                .isCustomizable(true)
                .layoutTemplate("DEFAULT")
                .specifications("{\"Hộp gỗ\": \"30x22x10cm\", \"Bình tre\": \"500ml\", \"Sổ gỗ\": \"A5\"}")
                .includedItems("{\"Hộp gỗ thông khắc laser\": \"1 chiếc\", \"Bình giữ nhiệt vỏ tre\": \"1 chiếc\", \"Sổ tay gỗ cao cấp\": \"1 cuốn\", \"Bút gỗ tre ký tên\": \"1 chiếc\"}")
                .publishedAt(LocalDateTime.now())
                .build();
        p4 = productRepository.save(p4);

        ProductVariant p4v1 = ProductVariant.builder()
                .product(p4)
                .name("Set quà tặng Quốc Khánh 2-9 - Tiêu Chuẩn")
                .sku("COMBO-QUOCKHANH-04-STD")
                .price(new BigDecimal("500000.00"))
                .salePrice(new BigDecimal("100000.00"))
                .stock(30)
                .isActive(true)
                .build();
        productVariantRepository.save(p4v1);

        log.info("Database successfully seeded with standard Haniu Gift Shop catalog!");
    }

    private void updatePricesForExistingProducts() {
        productRepository.findBySlug("ly-su-khac-ten-cao-cap-haniu").ifPresent(p1 -> {
            p1.setPrice(new BigDecimal("500000.00"));
            p1.setSalePrice(new BigDecimal("100000.00"));
            p1.setIncludedItems("{\"Cốc sứ Haniu tráng men\": \"1 chiếc\", \"Thìa inox mạ vàng\": \"1 chiếc\", \"Đế lót gỗ\": \"1 chiếc\", \"Hộp giấy quà tặng\": \"1 chiếc\"}");
            productRepository.save(p1);
            productVariantRepository.findByProductId(p1.getId()).forEach(v -> {
                v.setPrice(new BigDecimal("500000.00"));
                v.setSalePrice(new BigDecimal("100000.00"));
                productVariantRepository.save(v);
            });
        });

        productRepository.findBySlug("so-tay-bia-da-khac-logo").ifPresent(p2 -> {
            p2.setIncludedItems("{\"Sổ tay bìa da PU\": \"1 cuốn\", \"Bút ký kim loại khắc tên\": \"1 chiếc\", \"Hộp xi carton lót lụa\": \"1 chiếc\"}");
            productRepository.save(p2);
        });

        productRepository.findBySlug("hop-qua-hoa-hong-sap-thom-va-gau-bong").ifPresent(p3 -> {
            p3.setIncludedItems("{\"Hộp đựng bìa cứng trái tim\": \"1 chiếc\", \"Hoa hồng sáp thơm\": \"19 bông\", \"Gấu bông nhỏ\": \"1 chiếc\", \"Đèn Led đom đóm\": \"1 bộ\"}");
            productRepository.save(p3);
        });

        productRepository.findBySlug("set-qua-tang-quoc-khanh-2-9-doc-ban").ifPresent(p4 -> {
            p4.setPrice(new BigDecimal("500000.00"));
            p4.setSalePrice(new BigDecimal("100000.00"));
            p4.setIncludedItems("{\"Hộp gỗ thông khắc laser\": \"1 chiếc\", \"Bình giữ nhiệt vỏ tre\": \"1 chiếc\", \"Sổ tay gỗ cao cấp\": \"1 cuốn\", \"Bút gỗ tre ký tên\": \"1 chiếc\"}");
            productRepository.save(p4);
            productVariantRepository.findByProductId(p4.getId()).forEach(v -> {
                v.setPrice(new BigDecimal("500000.00"));
                v.setSalePrice(new BigDecimal("100000.00"));
                productVariantRepository.save(v);
            });
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
        if (systemConfigRepository.findByConfigKey("HOME_LAYOUT").isEmpty()) {
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
                  { "name": "Bộ sưu tập", "href": "/#collections" },
                  { "name": "Câu chuyện", "href": "/#story" },
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
                "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-wrapping-a-gift-box-with-ribbon-39922-large.mp4",
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
                "subtitle": "Chỉ với 4 bước đơn giản để tạo ra hộp quà chứa đựng tâm ý của riêng bạn",
                "steps": [
                  { "number": "01", "title": "Chọn Mẫu Quà", "desc": "Lựa chọn giữa hàng chục set combo quà tặng sẵn có hoặc sản phẩm lẻ của Haniu." },
                  { "number": "02", "title": "Cá Nhân Hóa", "desc": "Nhập tên, ngày kỷ niệm hoặc lời nhắn gửi để chúng tôi thiết kế bản khắc laser." },
                  { "number": "03", "title": "Xác Nhận Preview", "desc": "Đội ngũ thiết kế gửi bản vẽ mô phỏng cho bạn duyệt trước khi tiến hành chế tác." },
                  { "number": "04", "title": "Nhận Quà Hoàn Mỹ", "desc": "Quà được gói hộp sang trọng kèm nơ lụa và thiệp viết tay, giao hỏa tốc đến người nhận." }
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
                "title": "Nghệ Thuật Từ Những Bàn Tay Thủ Công",
                "subtitle": "Hành trình chăm chút tỉ mỉ cho từng góc cạnh hộp quà",
                "content": "Tại xưởng chế tác của Haniu, mỗi chi tiết nhỏ đều được chúng tôi trân quý. Từ khâu tuyển chọn những tấm da bò nguyên tấm, mài giũa các góc cạnh của gỗ, cho đến kỹ thuật nung men gốm sứ hỏa biến độc bản. Chúng tôi không sản xuất công nghiệp hàng loạt. Mỗi món quà bạn cầm trên tay đều mang hơi ấm và tâm huyết của những người thợ thủ công Việt Nam.",
                "videoPlaceholderUrl": "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80",
                "videoTitle": "Xem video Behind the Scenes"
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
              }
            }
            """;
            SystemConfig config = SystemConfig.builder()
                    .configKey("HOME_LAYOUT")
                    .configValue(defaultConfig)
                    .build();
            systemConfigRepository.save(config);
            log.info("Default HOME_LAYOUT configuration seeded!");
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




