package com.lakdewmotors.pos.repository;

import com.lakdewmotors.pos.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}