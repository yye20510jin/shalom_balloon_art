package com.shalom.shalom_balloon_art.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userIndex;

    @Column(length = 30, nullable = false, unique = true)
    private String userId;
    @Column(length = 255, nullable = false)
    private String userPassword;

    @Column(length = 30, nullable = false)
    private String username;

    @Column(length = 30, nullable = false)
    private String userPhoneNumber;

    @ManyToMany
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_index"),
            inverseJoinColumns = @JoinColumn(name = "role_index")
    )
    private Set<Role> userRoles = new HashSet<>();
}
