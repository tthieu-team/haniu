package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.marketing.Story;
import com.haniu.tthieu.haniu.repository.StoryRepository;
import com.haniu.tthieu.haniu.service.StoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;

    @Override
    @Transactional(readOnly = true)
    public Story getStory() {
        return storyRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    // Return a default story if none exists
                    return Story.builder()
                            .title("Nghệ Thuật Từ Những Bàn Tay Thủ Công")
                            .subtitle("CÂU CHUYỆN THƯƠNG HIỆU")
                            .content("Tại xưởng chế tác của Haniu, mỗi chi tiết nhỏ đều được chúng tôi trân quý. Từ khâu tuyển chọn những tấm da bò nguyên tấm, mài giũa các góc cạnh của gỗ, cho đến kỹ thuật nung men gốm sứ hỏa biến độc bản. Chúng tôi không sản xuất công nghiệp hàng loạt. Mỗi món quà bạn cầm trên tay đều mang hơi ấm và tâm huyết của những người thợ thủ công Việt Nam.")
                            .videoPlaceholderUrl("https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80")
                            .videoTitle("Xem video Behind the Scenes")
                            .build();
                });
    }

    @Override
    public Story updateStory(Story storyData) {
        Story existing = storyRepository.findAll().stream().findFirst()
                .orElse(new Story());

        existing.setTitle(storyData.getTitle());
        existing.setSubtitle(storyData.getSubtitle());
        existing.setContent(storyData.getContent());
        existing.setVideoPlaceholderUrl(storyData.getVideoPlaceholderUrl());
        existing.setVideoTitle(storyData.getVideoTitle());

        log.info("Updating brand story...");
        return storyRepository.save(existing);
    }
}
