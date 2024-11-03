import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import searchSVG from "../assets/search.svg";
import leftBackSVG from "../assets/leftBack.svg";
import axios from "axios";
import Sparkle from 'react-sparkle'


function Process() {
  const navigate = useNavigate();
  const [imagePath, setImagePath] = useState(null);
  const [boardsData, setBoardsData] = useState({});
  const [boardImages, setBoardImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [isImageGridVisible, setIsImageGridVisible] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5005/get_room_image")
      .then((response) => setImagePath(response.data.filename))
      .catch((error) => console.error("Error fetching the image path:", error));

    axios
      .get("http://localhost:5005/board_images")
      .then((response) => setBoardsData(response.data))
      .catch((error) => console.error("Error fetching board images:", error));
  }, []);

  function handleNext(e) {
    e.preventDefault();
    navigate("/results");
  }


  function handleBack() {
    navigate(-1);
  }

  const handleBoardClick = (boardName) => {
    setBoardImages(boardsData[boardName].files);
    setIsImageGridVisible(true);
  };

  const handleToggleImageGridClick = () => {
    setBoardImages([]);
    setIsImageGridVisible(false);
  }

  const applyBoardImage = (imageUrl) => {
    setExplanation("");
    setIsImageGridVisible(false);

    setLoading(true);
    axios
      .post("http://localhost:5005/applyPinterestImage", { url: imageUrl, mode: (mode ? "super" : "standard") })
      .then((response) => {
        setImagePath(response.data.file_path)
        setLoading(false);
        updateExplanation();
      })
      .catch((error) => console.error("Error sending image URL:", error));

    handleToggleImageGridClick();
  };

  const updateExplanation = () => {
    axios
      .get("http://localhost:5005/explainChanges")
      .then((response) => setExplanation(response.data.explanation))
      .catch((error) => console.error("Error fetching explanation:", error));
  };

  const handleToggle = () => {
    setMode((prevMode) => !prevMode);
  };

  const handleRefresh = () => {
    setLoading(true);
    axios
      .post("http://localhost:5005/regenerateImage", { mode: (mode ? "super" : "standard") })
      .then((response) => {
        setImagePath(response.data.file_path);
        setLoading(false);
      })
      .catch((error) => console.error("Error refreshing the image:", error));
  }

  return (
    <div className="process-container">

      <div className="header-button-container">
        <button onClick={handleBack} className="back-button">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="35" height="35" rx="11.5" fill="#F4F6F6"/>
        <rect x="0.5" y="0.5" width="35" height="35" rx="11.5" stroke="#D9D9D9"/>
        <path d="M20 14L16 18L20 22" stroke="#030B1A" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        </button>
        <div className={`toggle-container ${mode ? "on" : "off"}`} onClick={handleToggle}>
          <div className="toggle-switch"></div>
        </div>
        <button onClick={handleRefresh} className="refresh-button" aria-label="Refresh">
          <svg width="49" height="50" viewBox="0 0 49 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="7.5" y="7" width="35" height="35" rx="11.5" fill="#F4F6F6"/>
          <rect x="7.5" y="7" width="35" height="35" rx="11.5" stroke="#D9D9D9"/>
          <path d="M15.8861 17.5863L16.9247 17.5705L16.967 20.3565L17.8535 19.5135C18.6897 18.663 19.6499 17.9534 20.7343 17.3848C21.8187 16.816 23.0141 16.5217 24.3206 16.5019C26.19 16.4735 27.8686 16.971 29.3565 17.9943C30.8447 19.0176 31.9191 20.3392 32.5798 21.9592L31.4938 21.9757C30.8757 20.6365 29.9289 19.5526 28.6534 18.7237C27.3781 17.8947 25.939 17.4923 24.336 17.5167C23.2143 17.5337 22.1757 17.7719 21.2202 18.2314C20.2649 18.6908 19.446 19.3071 18.7637 20.0802L17.7798 21.0711L20.5734 21.0287L20.5888 22.0435L15.9548 22.1139L15.8861 17.5863ZM16.4195 28.041L17.5055 28.0245C18.1236 29.3637 19.0704 30.4477 20.3459 31.2765C21.6212 32.1056 23.0603 32.5079 24.6632 32.4836C25.785 32.4665 26.8236 32.2283 27.7791 31.7689C28.7344 31.3094 29.5532 30.6932 30.2356 29.9201L31.2195 28.9291L28.4259 28.9715L28.4105 27.9567L33.0444 27.8863L33.1132 32.414L32.0745 32.4297L32.0322 29.6438L31.1457 30.4867C30.3603 31.3853 29.4128 32.107 28.3032 32.6516C27.1934 33.1963 25.9852 33.4785 24.6786 33.4984C22.8093 33.5268 21.1307 33.0293 19.6427 32.006C18.1546 30.9826 17.0802 29.661 16.4195 28.041Z" fill="black"/>
          </svg>
        </button>
      </div>

      <div className="section">
        <h2 className="process_title">Your Room</h2>
        {imagePath ? (
          <img src={imagePath} alt="Room" className="room-image" />
        ) : (
          <p>Loading image...</p>
        )}
        <p className="changesExplanation">{ explanation }</p>
      </div>
      <div className="section">
        <h3 className="subtitle">Your Pinterest Boards</h3>
        <div className="board-container">
          {Object.keys(boardsData).map((boardName, index) => (
            <div className="board" key={index} onClick={() => handleBoardClick(boardName)}>
              <div
                className="board-image"
                style={{
                  backgroundImage: `url(${boardsData[boardName].files[0]})`,
                }}
              />
              <span className="board-name">{boardName}</span>
              <span className="board-count">{boardsData[boardName].files.length} pins</span>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className={`loading ${loading ? "visible" : ""}`}>
          <div className="sparklingAnimation" style={{ position: 'absolute' }}>
            <Sparkle  count={200} />
          </div>
          <div className="loadingDescription">
            pintering<br></br>your room...
          </div>
          <img src="http://localhost:5005/images/wand.gif" alt="Loading" />
        </div>
      )}

    {(
      <div className={`imageGridSection ${isImageGridVisible ? 'visible' : ''}`}>
        <div className="imageGridSection-toggle" onClick={handleToggleImageGridClick}>
          ______
        </div>
        <div className="image-grid">
          {boardImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Board image ${index}`}
              onClick={() => applyBoardImage(url)}
              className="grid-image"
            />
          ))}
        </div>
      </div>
    )}

    </div>
  );
}

export default Process;
