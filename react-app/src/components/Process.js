import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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
      <div className="flex flex-col gap-2">
        <div className="">
          room picture
          {imagePath ? (
            <img src={imagePath} alt="Room" />
          ) : (
            <p>Loading image...</p>
          )}
        </div>
        <div className="">Pinterest board</div>
      </div>
      <button onClick={handleNext}>next page</button>
    </div>
  );
}

export default Process;
