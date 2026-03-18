-- ================================
-- roles
-- ================================
CREATE TABLE roles(
    role_index BIGSERIAL,
    role_name VARCHAR(50) NOT NULL,

    PRIMARY KEY (role_index),
    CONSTRAINT uk_roles_role_name UNIQUE (role_name)
);

-- ================================
-- users
-- ================================
CREATE TABLE users(
    user_index BIGSERIAL,
    user_id VARCHAR(30) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    username VARCHAR(30) NOT NULL,
    user_phone_number VARCHAR(30) NOT NULL,
    role_index BIGINT NOT NULL,

    PRIMARY KEY (user_index),
    CONSTRAINT fk_users_role_index
        FOREIGN KEY (role_index) REFERENCES roles(role_index),
    CONSTRAINT uk_users_user_id UNIQUE (user_id)
);

-- ================================
-- signup_request
-- ================================
CREATE TABLE signup_request(
    user_index BIGSERIAL,
    user_id VARCHAR(30) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    username VARCHAR(30) NOT NULL,
    user_phone_number VARCHAR(30) NOT NULL,
    auth_status INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6),

    PRIMARY KEY (user_index),
    CONSTRAINT uk_signup_request_user_id UNIQUE (user_id)
);

-- ================================
-- pw_reset_token
-- ================================
CREATE TABLE pw_reset_token(
    pw_reset_index BIGSERIAL,
    user_index BIGINT,
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    used_at TIMESTAMP(6),
    created_at TIMESTAMP(6) NOT NULL,

    PRIMARY KEY (pw_reset_index)
);

CREATE INDEX idx_pw_reset_token_hash
    ON pw_reset_token (token_hash);
CREATE INDEX idx_pw_reset_user_hash
    ON pw_reset_token (user_index);

-- ================================
-- posts
-- ================================
CREATE TABLE posts(
    post_index BIGSERIAL,
    title VARCHAR(200) NOT NULL,
    content_html TEXT,
    thumbnail_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,
    views BIGINT NOT NULL DEFAULT 0,
    supplies VARCHAR(255),

    PRIMARY KEY (post_index)
);

-- ================================
-- tags
-- ================================
CREATE TABLE tags(
    tag_index BIGSERIAL,
    tag_name VARCHAR(255) NOT NULL,

    PRIMARY KEY (tag_index),
    CONSTRAINT uk_tags_tag_name UNIQUE (tag_name)
);

-- ================================
-- post_tag
-- ================================
CREATE TABLE post_tag(
    post_index BIGINT NOT NULL,
    tag_index BIGINT NOT NULL,

    PRIMARY KEY (post_index, tag_index),

    CONSTRAINT fk_post_tag_post
        FOREIGN KEY (post_index) REFERENCES posts(post_index)
        ON DELETE CASCADE,
    CONSTRAINT fk_post_tag_tag
        FOREIGN KEY (tag_index) REFERENCES tags(tag_index)
        ON DELETE CASCADE
);

-- ================================
-- post_user_like
-- ================================
CREATE TABLE post_user_like(
    post_index BIGINT NOT NULL,
    user_index BIGINT NOT NULL,

    PRIMARY KEY (post_index, user_index),

    CONSTRAINT fk_post_user_like_post
        FOREIGN KEY (post_index) REFERENCES posts(post_index)
        ON DELETE CASCADE,
    CONSTRAINT fk_post_user_like_user
        FOREIGN KEY (user_index) REFERENCES users(user_index)
        ON DELETE CASCADE
);

-- ================================
-- post_view_user
-- ================================
CREATE TABLE post_view_user(
    post_index BIGINT NOT NULL,
    user_index BIGINT NOT NULL,
    last_viewed_at TIMESTAMP(6) NOT NULL,

    PRIMARY KEY (post_index, user_index),

    CONSTRAINT fk_post_view_user_post
        FOREIGN KEY (post_index) REFERENCES posts(post_index)
        ON DELETE CASCADE,
    CONSTRAINT fk_post_view_user_user
        FOREIGN KEY (user_index) REFERENCES users(user_index)
        ON DELETE CASCADE
);

-- ================================
-- post_daily_view
-- ================================
CREATE TABLE post_daily_view(
    post_index BIGINT NOT NULL,
    view_date DATE NOT NULL,
    view_count INT NOT NULL DEFAULT 0,

    PRIMARY KEY (post_index, view_date),

    CONSTRAINT fk_post_daily_view_post
        FOREIGN KEY (post_index) REFERENCES posts(post_index)
        ON DELETE CASCADE
);

-- ================================
-- home_card
-- ================================
CREATE TABLE home_card(
    hc_index INTEGER NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    text TEXT NULL,
    PRIMARY KEY (hc_index)
);