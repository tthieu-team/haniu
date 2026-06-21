package com.haniu.tthieu.haniu.config.seeder;

import com.haniu.tthieu.haniu.entity.photobooth.PhotoboothAsset;
import com.haniu.tthieu.haniu.repository.PhotoboothAssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PhotoboothAssetSeeder {

    private final PhotoboothAssetRepository photoboothAssetRepository;

    public void seed() {
        if (photoboothAssetRepository.count() == 0) {
            log.info("Seeding initial Photobooth stickers...");
            
            // Stickers
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Cute Heart")
                    .url("https://cdn-icons-png.flaticon.com/512/833/833472.png")
                    .category("Love")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Sparkles")
                    .url("https://cdn-icons-png.flaticon.com/512/1077/1077035.png")
                    .category("Decorations")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Ribbon")
                    .url("https://cdn-icons-png.flaticon.com/512/3159/3159066.png")
                    .category("Ribbons")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Cute Bear")
                    .url("https://cdn-icons-png.flaticon.com/512/3233/3233503.png")
                    .category("Animals")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Smiling Cat")
                    .url("https://cdn-icons-png.flaticon.com/512/616/616430.png")
                    .category("Animals")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Rainbow")
                    .url("https://cdn-icons-png.flaticon.com/512/2614/2614580.png")
                    .category("Nature")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Sun")
                    .url("https://cdn-icons-png.flaticon.com/512/4814/4814268.png")
                    .category("Nature")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Cloud")
                    .url("https://cdn-icons-png.flaticon.com/512/414/414927.png")
                    .category("Nature")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Balloon")
                    .url("https://cdn-icons-png.flaticon.com/512/123/123385.png")
                    .category("Celebration")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Birthday Cake")
                    .url("https://cdn-icons-png.flaticon.com/512/2682/2682340.png")
                    .category("Celebration")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Party Popper")
                    .url("https://cdn-icons-png.flaticon.com/512/4694/4694314.png")
                    .category("Celebration")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Crown")
                    .url("https://cdn-icons-png.flaticon.com/512/2991/2991386.png")
                    .category("Dress-up")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Glasses")
                    .url("https://cdn-icons-png.flaticon.com/512/1253/1253813.png")
                    .category("Dress-up")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Mustache")
                    .url("https://cdn-icons-png.flaticon.com/512/2405/2405232.png")
                    .category("Dress-up")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Graduation Cap")
                    .url("https://cdn-icons-png.flaticon.com/512/1940/1940611.png")
                    .category("Dress-up")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Camera")
                    .url("https://cdn-icons-png.flaticon.com/512/685/685655.png")
                    .category("Photography")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Star")
                    .url("https://cdn-icons-png.flaticon.com/512/1828/1828884.png")
                    .category("Decorations")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Christmas Tree")
                    .url("https://cdn-icons-png.flaticon.com/512/614/614131.png")
                    .category("Christmas")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Santa Hat")
                    .url("https://cdn-icons-png.flaticon.com/512/744/744521.png")
                    .category("Christmas")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Flower")
                    .url("https://cdn-icons-png.flaticon.com/512/753/753303.png")
                    .category("Nature")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Gift Box")
                    .url("https://cdn-icons-png.flaticon.com/512/833/833446.png")
                    .category("Celebration")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Firework")
                    .url("https://cdn-icons-png.flaticon.com/512/3232/3232475.png")
                    .category("Celebration")
                    .build());
            photoboothAssetRepository.save(PhotoboothAsset.builder()
                    .type("stickers")
                    .name("Cherry")
                    .url("https://cdn-icons-png.flaticon.com/512/1888/1888258.png")
                    .category("Nature")
                    .build());

            log.info("Initial Photobooth stickers seeded successfully!");
        }
    }
}
