package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByUserId(String userId);
    boolean existsByUserId(String userId);
    boolean existsByUsernameAndUserPhoneNumber(String username, String userPhoneNumber);

    @Query("""
            SELECT u.userId
            FROM User u
            WHERE u.username = :userName AND u.userPhoneNumber = :userPhoneNumber
            """
    )
    String findUserIdByUsernameAndUserPhoneNumber(String userName, String userPhoneNumber);

    boolean existsByUserIdAndUserPhoneNumber(String userId, String userPhoneNumber);
}
