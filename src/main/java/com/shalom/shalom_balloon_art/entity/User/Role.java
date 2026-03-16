package com.shalom.shalom_balloon_art.entity.User;

import jakarta.persistence.*;
import lombok.*;

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

}