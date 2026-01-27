package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.post.AnalyticsResponseDTO;
import com.shalom.shalom_balloon_art.dto.post.DailySeriesDTO;
import com.shalom.shalom_balloon_art.dto.post.PostMetaDTO;
import com.shalom.shalom_balloon_art.entity.post.PostDailyView;
import com.shalom.shalom_balloon_art.repository.post.PostDailyViewRepository;
import com.shalom.shalom_balloon_art.repository.post.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostAnalyticsService {

    private final PostDailyViewRepository dailyViewRepository;
    private final PostRepository postRepository;

    public AnalyticsResponseDTO getTopViewedDaily(LocalDate from, LocalDate to, int top){
        //Top N 게시글 ID
        List<Object[]> topRows =
                dailyViewRepository.findTopPostIds(from, to, PageRequest.of(0,top));

        List<Long> postIndex = topRows.stream().map(r ->(Long) r[0]).toList();

        //게시글 메타(ID를 이용해 게시글 제목 가져오기)
        Map<Long, String> titleMap = postRepository.findTitlesByIds(postIndex).stream().collect(Collectors.toMap(row -> (Long)row[0], row -> (String) row[1]));

        List<PostMetaDTO> posts = topRows.stream().map(
                r -> new PostMetaDTO(
                        (Long) r[0],
                        titleMap.get(r[0]),
                        ((Number) r[1]).intValue()
                )
        ).toList();

        //날짜별 집계
        List<PostDailyView> views =
                dailyViewRepository.findDailyViews(from, to, postIndex);
        Map<LocalDate, Map<Long, Integer>> grouped = new HashMap<>();

        views.forEach(v -> {
            grouped.computeIfAbsent(v.getId().getViewDate(), d -> new HashMap<>())
                    .put(v.getId().getPostIndex(), v.getViewCount());
        });

        //날짜 누락 0 채우기
        List<DailySeriesDTO> series = from.datesUntil(to.plusDays(1)).map(date ->{
            Map<Long, Integer> values = new HashMap<>();
            postIndex.forEach(id -> values.put(id, grouped.getOrDefault(date, Collections.emptyMap()).getOrDefault(id, 0)));
        return new DailySeriesDTO(date,values);
        }).toList();


    return new AnalyticsResponseDTO(from, to, top, posts, series);
    }
}
