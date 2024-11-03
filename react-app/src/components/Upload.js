import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import addSVG from "../assets/add.svg";
import Formats from "../formats";
import Colors from "../color";
import Fonts from "../fonts";

function Upload() {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const navigate = useNavigate();

  const Wrapper = styled.section`
    width: 300px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    // padding: 4em;
    background: ${Colors.neutral50};
  `;

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
    <div>
      <div className="flex flex-col gap-24 items-center justify-center">
        <div
          style={{
            fontFamily: Fonts.Roboto,
            fontSize: Formats.displayLG,
          }}
        >
          Welcome to Pinterior
        </div>
        <div className="flex flex-col gap-4 items-center">
          <div style={{ fontFamily: Fonts.New_ronan }}>
            Upload your room image
          </div>
          <label className="previewSection">
            <Wrapper>
              <img src={addSVG} alt="Add Icon" />;
              <input type="file" hidden onChange={handleImageChange} />
            </Wrapper>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Upload;
