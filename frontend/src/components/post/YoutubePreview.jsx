// src/components/PostEditor/YoutubePreview.jsx
import { useState, useEffect } from "react";

function YoutubePreview({ youtubeUrl, setYoutubeUrl }) {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    if (!youtubeUrl) {
      setVideoId(null);
      return;
    }

    try {
      let id = null;

      // youtu.be/xxxx 형식
      if (youtubeUrl.includes("youtu.be/")) {
        const parts = youtubeUrl.split("youtu.be/");
        id = parts[1]?.split(/[?&]/)[0] || null;
      } else {
        // www.youtube.com/watch?v=xxxx 형식
        const urlObj = new URL(youtubeUrl);
        id = urlObj.searchParams.get("v");
      }

      setVideoId(id);
    } catch (e) {
      setVideoId(null);
    }
  }, [youtubeUrl]);

  return (
    <div style={{ marginBottom: 16, border: "1px solid #ddd", padding: 12 }}>
      <h3>YouTube URL (선택)</h3>
      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        style={{ width: "100%", padding: 8, marginTop: 4 }}
        placeholder="https://www.youtube.com/watch?v=..."
      />

      {youtubeUrl && !videoId && (
        <p style={{ color: "orange", marginTop: 4 }}>
          유효한 YouTube URL인지 다시 확인해 주세요.
        </p>
      )}

      {videoId && (
        <div style={{ marginTop: 12 }}>
          <p>YouTube 미리보기</p>
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              title="YouTube Preview"
              src={`https://www.youtube.com/embed/${videoId}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default YoutubePreview;
