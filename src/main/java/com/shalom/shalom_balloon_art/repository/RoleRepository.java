package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.User.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByRoleName(String roleName);
}
