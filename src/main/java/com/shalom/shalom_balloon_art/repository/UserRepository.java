package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity,String>{

}
