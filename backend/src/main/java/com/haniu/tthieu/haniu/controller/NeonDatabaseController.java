package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.system.NeonDatabase;
import com.haniu.tthieu.haniu.repository.NeonDatabaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/db-rotation")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class NeonDatabaseController {

    private final NeonDatabaseRepository repository;

    @GetMapping
    public ResponseEntity<List<NeonDatabase>> getAll() {
        return ResponseEntity.ok(repository.findAllByOrderBySortOrderAsc());
    }

    @PostMapping
    public ResponseEntity<NeonDatabase> create(@RequestBody NeonDatabase neonDatabase) {
        if (neonDatabase.isActive()) {
            deactivateAll();
        }
        return ResponseEntity.ok(repository.save(neonDatabase));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NeonDatabase> update(@PathVariable UUID id, @RequestBody NeonDatabase request) {
        NeonDatabase db = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Database connection not found"));
        db.setName(request.getName());
        db.setConnectionUrl(request.getConnectionUrl());
        db.setSortOrder(request.getSortOrder());
        
        if (request.isActive() && !db.isActive()) {
            deactivateAll();
            db.setActive(true);
            db.setLastSwitchedAt(LocalDateTime.now());
        } else if (!request.isActive()) {
            db.setActive(false);
        }
        
        return ResponseEntity.ok(repository.save(db));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable UUID id) {
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa cấu hình database thành công"));
    }

    @PostMapping("/rotate")
    public ResponseEntity<Map<String, Object>> rotate() {
        List<NeonDatabase> list = repository.findAllByOrderBySortOrderAsc();
        if (list.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Danh sách database trống"));
        }

        NeonDatabase currentActive = list.stream()
                .filter(NeonDatabase::isActive)
                .findFirst()
                .orElse(null);

        int nextIndex = 0;
        if (currentActive != null) {
            int currentIndex = list.indexOf(currentActive);
            nextIndex = (currentIndex + 1) % list.size();
        }

        deactivateAll();
        NeonDatabase nextActive = list.get(nextIndex);
        nextActive.setActive(true);
        nextActive.setLastSwitchedAt(LocalDateTime.now());
        repository.save(nextActive);

        return ResponseEntity.ok(Map.of(
            "message", "Xoay vòng database thành công",
            "oldActive", currentActive != null ? currentActive.getName() : "Không có",
            "newActive", nextActive.getName(),
            "connectionUrl", nextActive.getConnectionUrl()
        ));
    }

    private void deactivateAll() {
        List<NeonDatabase> list = repository.findAll();
        for (NeonDatabase db : list) {
            if (db.isActive()) {
                db.setActive(false);
                repository.save(db);
            }
        }
    }
}
