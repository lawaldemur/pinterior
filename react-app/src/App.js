import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [reference, setReference] = useState(null);

  function handleImageChange(e) {
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  }

  function handleReferenceChange(e) {
    setReference(e.target.files[0]);
  }

  const handleImageUpload = async (event) => {
    event.preventDefault();
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
      console.log("Image uploaded successfully");
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  const handleReferenceUpload = async (event) => {
    event.preventDefault();
    if (!reference) {
      alert("Please select a reference file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("reference", reference);

    try {
      const response = await axios.post(
        "http://localhost:5005/referenceUpload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Reference uploaded successfully");
    } catch (error) {
      console.log("Error uploading reference:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleImageUpload}>
        <section className="previewSection">
          <div className="previewBlock">
            <img src={preview} alt="Preview" />
          </div>
          <input type="file" onChange={handleImageChange} />
          <button type="submit">Upload Image</button>
        </section>
      </form>
      
      <section className="references">
        <p>Upload references one by one:</p>
        <form onSubmit={handleReferenceUpload}>
          <input type="file" onChange={handleReferenceChange} />
          <button type="submit">Upload Reference</button>
        </form>
      </section>
    </div>
  );
}

export default App;
