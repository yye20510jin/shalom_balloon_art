package com.shalom.shalom_balloon_art.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserEntity {
    @Id
    @Column(length = 30)
    private String id;

    @Column(length = 255, nullable = false)
    private String password;

    @Column(length=30,nullable=false)
    private String name;

    @Column(length = 20 , nullable = false)
    private String phone_number;

}

