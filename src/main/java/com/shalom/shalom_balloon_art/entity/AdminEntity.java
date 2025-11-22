package com.shalom.shalom_balloon_art.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table (name="admin")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminEntity {
    @Id
    @Column(length = 30)
    private String id;

    @Column(length = 255, nullable = false)
    private String password;

    @Column(length=30, nullable = false)
    private String name;
}
