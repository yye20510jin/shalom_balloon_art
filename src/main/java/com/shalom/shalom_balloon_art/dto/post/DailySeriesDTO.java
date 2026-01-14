package com.shalom.shalom_balloon_art.dto.post;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@AllArgsConstructor
public class DailySeriesDTO {
    private LocalDate date;
    private Map<Long, Integer> values;
}
