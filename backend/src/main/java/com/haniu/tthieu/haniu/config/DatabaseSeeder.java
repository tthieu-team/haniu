package com.haniu.tthieu.haniu.config;

import com.haniu.tthieu.haniu.entity.enums.ProductStatus;
import com.haniu.tthieu.haniu.entity.product.*;
import com.haniu.tthieu.haniu.repository.*;
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

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedUsers();

        if (categoryRepository.count() > 0) {
            log.info("Database already seeded. Updating existing product prices if needed.");
            updatePricesForExistingProducts();
            seedAccessories();
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
        seedAccessories();
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

    private void seedAccessories() {
        if (productRepository.findBySlug("thiep-chuc-mung-thiet-ke-rieng").isPresent()) {
            return;
        }

        log.info("Seeding accessory products for cross-sell...");
        Category phuKien = categoryRepository.findBySlug("phu-kien-qua-tang").orElseGet(() -> {
            Category cat = Category.builder()
                    .name("Phụ kiện quà tặng")
                    .slug("phu-kien-qua-tang")
                    .description("Thiệp, túi, hộp quà và các dịch vụ đi kèm")
                    .isActive(true)
                    .isFeatured(true)
                    .sortOrder(5)
                    .build();
            return categoryRepository.save(cat);
        });

        Brand brand = brandRepository.findBySlug("haniu-gift-shop").orElse(null);

        Product thiep = Product.builder()
                .category(phuKien)
                .brand(brand)
                .name("Thiệp chúc mừng thiết kế riêng Haniu")
                .slug("thiep-chuc-mung-thiet-ke-rieng")
                .sku("ACC-THIEP-01")
                .shortDescription("Thiệp viết tay ý nghĩa kèm phong bì sang trọng")
                .description("Thiệp được in trên giấy mỹ thuật cao cấp dập chìm họa tiết vintage sắc nét, đi kèm bao bì nhung sang trọng.")
                .thumbnailUrl("https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=600")
                .price(new BigDecimal("15000.00"))
                .costPrice(new BigDecimal("3000.00"))
                .stock(9999)
                .material("Giấy mỹ thuật")
                .color("Kem/Kraft")
                .status(ProductStatus.PUBLISHED)
                .isFeatured(false)
                .isNew(false)
                .isCustomizable(false)
                .layoutTemplate("DEFAULT")
                .publishedAt(LocalDateTime.now())
                .build();
        productRepository.save(thiep);

        Product tui = Product.builder()
                .category(phuKien)
                .brand(brand)
                .name("Túi quà Haniu cao cấp")
                .slug("tui-qua-haniu-cao-cap")
                .sku("ACC-TUI-02")
                .shortDescription("Túi giấy kraft quai vải lịch sự, sang trọng")
                .description("Túi quà được thiết kế với chất liệu carton gấp nếp dầy dặn, quai xách ruy băng lụa mềm mại tạo nên vẻ ngoài cực kỳ sang trọng.")
                .thumbnailUrl("https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600")
                .price(new BigDecimal("20000.00"))
                .costPrice(new BigDecimal("5000.00"))
                .stock(9999)
                .material("Giấy bìa Kraft cứng")
                .color("Đỏ đô / Nâu Kraft")
                .status(ProductStatus.PUBLISHED)
                .isFeatured(false)
                .isNew(false)
                .isCustomizable(false)
                .layoutTemplate("DEFAULT")
                .publishedAt(LocalDateTime.now())
                .build();
        productRepository.save(tui);

        Product laser = Product.builder()
                .category(phuKien)
                .brand(brand)
                .name("Dịch vụ khắc laser Premium")
                .slug("dich-vu-khac-laser-premium")
                .sku("ACC-LASER-03")
                .shortDescription("Khắc tên, logo doanh nghiệp sắc nét lên sản phẩm")
                .description("Sử dụng công nghệ khắc laser fiber/CO2 tiên tiến của Đức, đảm bảo chi tiết sắc nét và bền bỉ mãi mãi với thời gian.")
                .thumbnailUrl("https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600")
                .price(new BigDecimal("50000.00"))
                .costPrice(new BigDecimal("0.00"))
                .stock(9999)
                .material("Dịch vụ gia công")
                .color("Tự chọn")
                .status(ProductStatus.PUBLISHED)
                .isFeatured(false)
                .isNew(false)
                .isCustomizable(false)
                .layoutTemplate("DEFAULT")
                .publishedAt(LocalDateTime.now())
                .build();
        productRepository.save(laser);

        Product hop = Product.builder()
                .category(phuKien)
                .brand(brand)
                .name("Hộp quà gỗ thông tự nhiên Haniu")
                .slug("hop-qua-go-thong-tu-nhien")
                .sku("ACC-HOPGO-04")
                .shortDescription("Hộp gỗ khóa đồng sang trọng nâng tầm bộ quà")
                .description("Hộp quà được chế tác thủ công từ gỗ thông nhập khẩu Chile, vân gỗ tự nhiên sơn phủ bóng mờ chống ẩm mốc kèm khóa đồng cổ điển.")
                .thumbnailUrl("https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600")
                .price(new BigDecimal("100000.00"))
                .costPrice(new BigDecimal("40000.00"))
                .stock(9999)
                .material("Gỗ thông Chile")
                .color("Vàng gỗ tự nhiên")
                .status(ProductStatus.PUBLISHED)
                .isFeatured(false)
                .isNew(false)
                .isCustomizable(false)
                .layoutTemplate("DEFAULT")
                .publishedAt(LocalDateTime.now())
                .build();
        productRepository.save(hop);

        log.info("Accessory products seeded successfully!");
    }
}
