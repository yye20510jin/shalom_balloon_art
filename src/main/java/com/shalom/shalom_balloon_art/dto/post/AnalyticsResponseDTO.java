package com.shalom.shalom_balloon_art.dto.post;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class AnalyticsResponseDTO {
    private LocalDate from;
    private LocalDate to;
    private int top;
    private List<PostMetaDTO> posts;
    private List<DailySeriesDTO> series;
}
