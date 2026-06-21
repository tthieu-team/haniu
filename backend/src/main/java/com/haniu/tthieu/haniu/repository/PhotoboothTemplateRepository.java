package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.photobooth.PhotoboothTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PhotoboothTemplateRepository extends JpaRepository<PhotoboothTemplate, UUID> {
}
