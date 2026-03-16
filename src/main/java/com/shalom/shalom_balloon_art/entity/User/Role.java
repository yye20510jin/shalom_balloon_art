package com.shalom.shalom_balloon_art.entity.User;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="roles")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder
public class Role{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long roleIndex;

    @Column(nullable = false, unique = true)
    private String roleName;

    @OneToMany(mappedBy="role")
    @Builder.Default
    private Set<User> users = new HashSet<>();

}