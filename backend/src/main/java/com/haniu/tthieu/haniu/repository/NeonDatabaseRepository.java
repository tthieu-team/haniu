package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.system.NeonDatabase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NeonDatabaseRepository extends JpaRepository<NeonDatabase, UUID> {
    List<NeonDatabase> findAllByOrderBySortOrderAsc();
    Optional<NeonDatabase> findByIsActiveTrue();
}
