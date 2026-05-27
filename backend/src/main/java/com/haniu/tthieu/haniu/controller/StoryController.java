package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.marketing.Story;
import com.haniu.tthieu.haniu.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StoryController {

    private final StoryService storyService;

    @GetMapping
    public ResponseEntity<Story> getStory() {
        return ResponseEntity.ok(storyService.getStory());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Story> updateStory(@RequestBody Story story) {
        return ResponseEntity.ok(storyService.updateStory(story));
    }
}
