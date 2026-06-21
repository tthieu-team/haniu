package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.photobooth.PhotoboothEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PhotoboothEventRepository extends JpaRepository<PhotoboothEvent, UUID> {
}
