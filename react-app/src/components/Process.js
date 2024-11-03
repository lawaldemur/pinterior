import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import searchSVG from "../assets/search.svg";
import leftBackSVG from "../assets/leftBack.svg";
import axios from "axios";


function Process() {
  const navigate = useNavigate();
  const [imagePath, setImagePath] = useState(null);
  const [boardsData, setBoardsData] = useState({});
  const [boardImages, setBoardImages] = useState([]);

  useEffect(() => {
    // Fetch image path from the endpoint
    axios
      .get("http://localhost:5005/get_room_image")
      .then((response) => {
        setImagePath(response.data.filename);
      })
      .catch((error) => {
        console.error("Error fetching the image path:", error);
      });
    
       // Fetch boards data
    axios
    .get("http://localhost:5005/board_images")
    .then((response) => {
      console.log("Boards data:", response.data);
      setBoardsData(response.data);
    })
    .catch((error) => {
      console.error("Error fetching board images:", error);
    });
  }, []);

  function handleNext(e) {
    e.preventDefault();
    navigate("/results");
  }


  function handleBack() {
    navigate(-1); // Go back to the previous page
  }

  const handleBoardClick = (boardName) => {
    setBoardImages(boardsData[boardName].files);
  };

  const applyBoardImage = (imageUrl) => {
    axios
      .post("http://localhost:5005/applyPinterestImage", { url: imageUrl })
      .then((response) => {
        console.log("Image URL sent successfully:", response.data);

        const img_path = response.data.file_path;
        setImagePath(img_path);
      })
      .catch((error) => {
        console.error("Error sending image URL:", error);
      });
  };

  const handleBackFromBoard = () => {
    setBoardImages([]);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleBack}
          style={{
            position: "relative",
            top: "10px",
            left: "10px",
            padding: "8px 12px",
            fontSize: "14px",
            backgroundColor: "#f0f0f0",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "40px",
          }}
        >
          &lt;
        </button>

        <div className="your_room">
          Your Room
          {imagePath ? (
            <img src={imagePath} alt="Room" />
          ) : (
            <p>Loading image...</p>
          )}
        </div>

        Your Pinterest Boards
        <div
          className="boards"
          style={{
            display: "flex",             // Enables flexbox layout
            flexDirection: "row",         // Aligns items in a row (horizontal layout)
            gap: "10px",                  // Adds spacing between each board
            padding: "20px",              // Adds padding around the entire container
            borderRadius: "10px",         // Rounds the corners of the container
            flexWrap: "wrap"              // Allows items to wrap to the next row if they exceed container width
          }}
        >
          {Object.keys(boardsData).map((boardName, index) => (
            <div className="board" key={index}>
              <span>{boardName}</span>
              <div
                onClick={() => handleBoardClick(boardName)}
                style={{
                  backgroundImage: `url(${boardsData[boardName].files[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  width: "200px",
                  height: "200px",
                  cursor: "pointer",
                }}
              ></div>
            </div>
          ))}
        </div>

      <div className="board_images" style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
        {boardImages.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Board image ${index}`}
            onClick={() => applyBoardImage(url)}
            style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "10px", cursor: "pointer" }}
          />
        ))}
      </div>
      </div>
    </div>
  );
}

export default Process;
