package com.shalom.shalom_balloon_art.auth.sanitizer;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Component;

@Component
public class HtmlSanitizer {

    private static final PolicyFactory POLICY = new HtmlPolicyBuilder()
            .allowElements("p","br","strong","em","u","s","blockquote",
                    "ul","ol","li","h1","h2","h3","hr","span","div")
            .allowElements("a")
            .allowAttributes("href").onElements("a")
            .requireRelNofollowOnLinks()
            .allowUrlProtocols("http","https")
            .allowElements("img")
            .allowAttributes("src","alt","title").onElements("img")
            .allowUrlProtocols("https")
            .allowAttributes("data-youtube-fallback").onElements("span")
            .allowAttributes("data-align").onElements("ul","ol","li")
            .toFactory();

    public String sanitizePostHtml(String dirty){
        if(dirty == null) return "";
        return POLICY.sanitize(dirty);
    }
}
