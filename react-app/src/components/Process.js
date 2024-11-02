import React from "react";
import styled from "styled-components";

function Process() {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="">room picture</div>
        <Wrapper>
          <div className="">Pinterest board</div>
        </Wrapper>
      </div>
    </div>
  );
}

export default Process;
