import { Node } from "@tiptap/core";

export const CustomYoutube = Node.create({
    name: "customYoutube",

    group: "block",
    atom: true,

    addAttributes() {
        return {
            videoId: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-youtube-fallback]',
                getAttrs: element => {
                    if (!(element instanceof HTMLElement)) return false;

                    const videoId = element.getAttribute("data-youtube-fallback");
                    if (!videoId) return false;

                    return { videoId };
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        if (!HTMLAttributes.videoId) {
            return ["span", {}];
        }

        return [
            "span",
            {
                "data-youtube-fallback": HTMLAttributes.videoId,
            },
        ];
    },

    addCommands() {
        return {
            setCustomYoutube:
                (videoId) =>
                    ({ chain }) => {
                        return chain()
                            .insertContent({
                                type: 'customYoutube',
                                attrs: { videoId },
                            })
                            .run();
                    },
        };
    },

    addNodeView() {
        return ({ node }) => {
            const dom = document.createElement("div");
            dom.className = "yt-wrap";
            
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube-nocookie.com/embed/${node.attrs.videoId}`;
            iframe.width = "560";
            iframe.height = "315";
            iframe.title = "YouTube video player";
            iframe.frameBorder = "0";
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;

            const a = document.createElement("a");
            a.href = `https://www.youtube.com/watch?v=${node.attrs.videoId}`;
            a.target = "_blank";
            a.rel = "noreferrer";
            a.textContent = "유튜브에서 보기";

            dom.appendChild(iframe);
            dom.appendChild(a);

            return { dom };
        };
    },
});