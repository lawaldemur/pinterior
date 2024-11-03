import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const navigate = useNavigate();

  // Triggered when a file is chosen
  function handleImageChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    // Automatically upload after setting the file
    handleImageUpload(selectedFile);
  }

  // Handles the image upload
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:5005/roomUpload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Image uploaded successfully:", response);

      // Navigate to /process after successful upload
      navigate("/process");
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="title">Welcome to Pinterior</h1>
      <p className="subtitle">Upload your room image</p>
      <form onSubmit={handleImageUpload} className="upload-form">
        <section className="previewSection">
          <label>
          <input
            type="file"
            onChange={handleImageChange}
            className="file-input"
          />
          <div className="upload-box">
            {preview ? (
              <img src={preview} alt="Preview" className="preview-image" />
            ) : (
              <span className="plus-icon">+</span>
            )}
          </div>
          </label>
        </section>
      </form>
    </div>
  );
}

export default Upload;
