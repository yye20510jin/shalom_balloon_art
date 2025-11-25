package com.shalom.shalom_balloon_art.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name="roles")
@Getter
public class Role{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long roleIndex;

    @Column(nullable = false, unique = true)
    private String roleName;

}