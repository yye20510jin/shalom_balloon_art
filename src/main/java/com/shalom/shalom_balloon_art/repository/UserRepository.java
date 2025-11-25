package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByUserId(String userId);
}
