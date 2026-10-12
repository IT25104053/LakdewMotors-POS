package com.lakdewmotors.pos.repository;

import com.lakdewmotors.pos.model.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
}