package com.shalom.shalom_balloon_art.dto.post;

import java.util.List;

public record PostSearchCond(String searchTitle, List<Long> searchTagIndex) {
    //getter, 생성자, equals/hashCode, toString 자동 생성
}
