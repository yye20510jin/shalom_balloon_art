package com.shalom.shalom_balloon_art.repository.post;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shalom.shalom_balloon_art.dto.post.PostSearchCond;
import com.shalom.shalom_balloon_art.entity.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static com.shalom.shalom_balloon_art.entity.post.QPost.post;

public class PostRepositoryImpl implements PostRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    public PostRepositoryImpl(JPAQueryFactory queryFactory){
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Post> search(PostSearchCond cond, Pageable pageable){
        BooleanBuilder where = new BooleanBuilder();

        //title optional
        if(cond.searchTitle() != null && !cond.searchTitle().isBlank()){
            where.and(post.title.containsIgnoreCase(cond.searchTitle().trim()));
        }

        //tagIds optional
        List<Long> tagIndex = cond.searchTagIndex();
        if(tagIndex != null && !tagIndex.isEmpty()){
            where.and(post.postTag.any().tagIndex.in(tagIndex));
        }

        var contentQuery =
                queryFactory
                        .selectFrom(post)
                        .where(where)
                        .distinct()
                        .offset(pageable.getOffset())
                        .limit(pageable.getPageSize());

        List<Post> content = contentQuery.fetch();

        var countQuery =
                queryFactory
                        .select(post.countDistinct())
                        .from(post)
                        .where(where);

        //page 객체를 만들려면 content, pageable, total count가 필요하다.
        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    };
}
