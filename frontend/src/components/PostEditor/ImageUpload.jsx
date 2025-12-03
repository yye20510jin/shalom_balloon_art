// src/components/PostEditor/ImageUpload.jsx
import { useState } from "react";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function ImageUpload({ imageUrl, setImageUrl }) {
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImageFile(files);
    setUploadError("");
    setUploadMessage("");
  };

  const handleUpload = async () => {

    if (!imageFile) {
      setUploadError("업로드할 이미지를 선택해 주세요.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError("");

    const urls = await Promise.all(
      imageFile.map(async (file) => {
        const filePath = `posts/${Date.now()}_${file.name}`;
        const fileRef = ref(storage, filePath);

        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        console.log("✅ 다운로드 URL:", url);
        return url; // 이게 모여서 urls 배열이 됨
      })
    );

      setImageUrl(urls);
      setUploadMessage("이미지 업로드가 완료되었습니다.");

    } catch (err) { 
      console.error(err);
      setUploadError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: 16, border: "1px solid #ddd", padding: 12 }}>
      <h3>대표 이미지 업로드</h3>

      <input type="file" accept="image/*" onChange={handleFileChange} multiple/>

      <button
        type="button"
        onClick={handleUpload}
        disabled={!imageFile || isUploading}
        style={{ marginLeft: 8 }}
      >
        {isUploading ? "업로드 중..." : "이미지 업로드"}
      </button>

      {uploadError && <p style={{ color: "red", marginTop: 4 }}>{uploadError}</p>}
      {uploadMessage && (
        <p style={{ color: "green", marginTop: 4 }}>{uploadMessage}</p>
      )}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {imageUrl.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`upload-${index}`}
          style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
        />
      ))}
    </div>

      
    </div>
  );
}

export default ImageUpload;
