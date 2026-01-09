package com.shalom.shalom_balloon_art.dto;

import com.shalom.shalom_balloon_art.entity.HomeCard;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeCardResponseDTO {
    private String imgUrl;
    private String text;

    public static HomeCardResponseDTO from(HomeCard h){
        return HomeCardResponseDTO.builder().imgUrl(h.getImgUrl()).text(h.getText()).build();
    }
}
