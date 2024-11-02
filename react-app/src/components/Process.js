import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function Process() {
  const navigate = useNavigate();
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;
  function handleNext(e) {
    e.preventDefault();
    navigate("/results");
  }
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="">room picture</div>
        <Wrapper>
          <div className="">Pinterest board</div>
        </Wrapper>
      </div>
      <button onClick={handleNext}>next page</button>
    </div>
  );
}

export default Process;
