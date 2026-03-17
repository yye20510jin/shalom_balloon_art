package com.shalom.shalom_balloon_art.entity.User;

import com.shalom.shalom_balloon_art.entity.post.PostTag;
import com.shalom.shalom_balloon_art.entity.post.PostUserLike;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Objects;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="role_index", nullable = false)
    private Role role;

    @OneToMany(mappedBy="user")
    private Set<PostUserLike> postUserLikes = new HashSet<>();

    public void changePw(String pw) {this.userPassword = pw;}

    public void changePn(String newPhone) {this.userPhoneNumber = newPhone;}

    public void setRole(Role role){
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User that = (User) o;
        return Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

}
