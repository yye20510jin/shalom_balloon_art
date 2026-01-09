package com.shalom.shalom_balloon_art.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeCardRequestDTO {
    private List<String> imgUrl;
    private List<String> text;
}
