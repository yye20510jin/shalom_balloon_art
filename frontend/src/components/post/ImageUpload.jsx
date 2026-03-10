// src/components/PostEditor/ImageUpload.jsx
import { useState } from "react";
import { storage } from "../../config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from "firebase/storage";

function ImageUpload({ imageUrls, setImageUrls }) {
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

  const handleRemoveImage = async (index) => {
    const targetUrl = imageUrls[index];
    const storage = getStorage();
    setImageUrls((prev) => prev.filter((_, i) => i !== index));

    
    try {
    const imageRef = ref(storage,targetUrl); 
    await deleteObject(imageRef);
    console.log("이미지 삭제 성공:", targetUrl);
  } catch (err) {
    console.error("이미지 삭제 실패:", err);
  }
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
        return url;
      })
    );

      setImageUrls(urls);
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
      {imageUrls.map((url, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            src={url}
            alt={`upload-${index}`}
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />

          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              border: "none",
              borderRadius: "50%",
              width: 26,
              height: 26,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "bold",
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ✕
          </button>
        </div>
  ))}
</div>

      
    </div>
  );
}

export default ImageUpload;
