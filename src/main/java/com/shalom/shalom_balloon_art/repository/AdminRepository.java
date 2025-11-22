package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<AdminEntity,String> {
}
