package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.photobooth.PhotoboothTemplate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PhotoboothTemplateRepository extends JpaRepository<PhotoboothTemplate, UUID> {

    @Query("SELECT t FROM PhotoboothTemplate t ORDER BY t.createdAt DESC, t.id DESC")
    List<PhotoboothTemplate> findInitial(Pageable pageable);

    @Query("SELECT t FROM PhotoboothTemplate t WHERE (t.createdAt < :createdAt) OR (t.createdAt = :createdAt AND t.id < :id) ORDER BY t.createdAt DESC, t.id DESC")
    List<PhotoboothTemplate> findNextCursor(@Param("createdAt") LocalDateTime createdAt, @Param("id") UUID id, Pageable pageable);

    @Query("SELECT t FROM PhotoboothTemplate t WHERE t.status = :status ORDER BY t.createdAt DESC, t.id DESC")
    List<PhotoboothTemplate> findInitialByStatus(@Param("status") String status, Pageable pageable);

    @Query("SELECT t FROM PhotoboothTemplate t WHERE t.status = :status AND ((t.createdAt < :createdAt) OR (t.createdAt = :createdAt AND t.id < :id)) ORDER BY t.createdAt DESC, t.id DESC")
    List<PhotoboothTemplate> findNextCursorByStatus(@Param("status") String status, @Param("createdAt") LocalDateTime createdAt, @Param("id") UUID id, Pageable pageable);
}
