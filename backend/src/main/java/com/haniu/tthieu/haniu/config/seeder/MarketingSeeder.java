package com.haniu.tthieu.haniu.config.seeder;

import com.haniu.tthieu.haniu.entity.marketing.Story;
import com.haniu.tthieu.haniu.entity.marketing.Testimonial;
import com.haniu.tthieu.haniu.entity.marketing.UgcItem;
import com.haniu.tthieu.haniu.repository.StoryRepository;
import com.haniu.tthieu.haniu.repository.TestimonialRepository;
import com.haniu.tthieu.haniu.repository.UgcItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class MarketingSeeder {

    private final StoryRepository storyRepository;
    private final TestimonialRepository testimonialRepository;
    private final UgcItemRepository ugcItemRepository;

    public void seed() {
        seedStories();
        seedTestimonials();
        seedUgcItems();
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
