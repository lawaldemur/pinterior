import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const navigate = useNavigate();

  function handleImageChange(e) {
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  }

  function handleSubmitLink(e) {
    e.preventDefault();
    navigate("/process");
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

  // const formData = new FormData();
  // formData.append("reference", reference);

  // try {
  //   const response = await axios.post(
  //     "http://localhost:5005/referenceUpload",
  //     formData,
  //     {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  //   console.log("Reference uploaded successfully");
  // } catch (error) {
  //   console.log("Error uploading reference:", error);
  // }

  return (
    <div>
      class
      <form onSubmit={handleImageUpload}>
        <section className="previewSection">
          <div className="previewBlock">
            <img src={preview} alt="Preview" />
          </div>
          <input type="file" onChange={handleImageChange} />
          <button type="submit" onClick={handleSubmitLink}>
            submit and link to Pinterest
          </button>
        </section>
      </form>
    </div>
  );
}

export default Upload;
