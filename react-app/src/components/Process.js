import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import searchSVG from "../assets/search.svg";
import leftBackSVG from "../assets/leftBack.svg";
import axios from "axios";

function Process() {
  const navigate = useNavigate();
  const [imagePath, setImagePath] = useState(null);

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
  }, []);

  function handleNext(e) {
    e.preventDefault();
    navigate("/results");
  }

  return (
    <div>
      <div className="flex flex-col gap-8">
        <img src="" alt="" />
        <div>Your room</div>
        {imagePath ? (
          <img src={imagePath} alt="Room" />
        ) : (
          <p>Loading image...</p>
        )}
        <div className="">Your Pinterest Board</div>
        <div className="flex flex-row gap-2">
          <img
            src={searchSVG}
            alt="search Icon"
            style={{ width: "20px", height: "20px" }}
          />
          <div>Style Keyword</div>
        </div>
        ;
      </div>
      <button onClick={handleNext}>next page</button>
    </div>
  );
}

export default Process;
