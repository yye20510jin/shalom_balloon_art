package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    String findUserIdByUsernameAndUserPhoneNumber(@Param("userName")String userName, @Param("userPhoneNumber")String userPhoneNumber);

    @Query("""
            SELECT u.userIndex
            FROM User u
            WHERE u.userId = :userId AND u.userPhoneNumber = :userPhoneNumber
            """)
    Optional<Long> findUserIndexByUserIdAndUserPhoneNumber(@Param("userId") String userId, @Param("userPhoneNumber") String userPhoneNumber);

    @Query("""
            SELECT u.userId
            FROM User u
            WHERE u.userIndex = :userIndex
            """)
    String findUserIdByUserIndex(@Param("userIndex")Long userIndex);

    boolean existsByUserIdAndUserPhoneNumber(String userId, String userPhoneNumber);
}
