package com.shalom.shalom_balloon_art.entity;

import com.shalom.shalom_balloon_art.entity.post.PostUserLike;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "users")
@Getter
@Builder
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
    @Builder.Default
    private Set<Role> userRoles = new HashSet<>();

    @OneToMany(mappedBy="user")
    private Set<PostUserLike> postUserLikes = new HashSet<>();

    public void addRole(Role role){
        this.userRoles.add(role);
    }

    public void changePw(String pw) {this.userPassword = pw;}

}
