import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function Process() {
  const navigate = useNavigate();

  function handleNext(e) {
    e.preventDefault();
    navigate("/results");
  }
  
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="">room picture</div>
          <div className="">Pinterest board</div>
      </div>
      <button onClick={handleNext}>next page</button>
    </div>
  );
}

export default Process;
