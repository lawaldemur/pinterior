import React, { useEffect } from "react";
import "./LoadingAnimations.css"; // Ensure you have this CSS file

function LoadingAnimation() {
  useEffect(() => {
    const sourceIdNames = [
      "Ellipse_1998_5",
      "Ellipse_1996_7",
      "Ellipse_1997_9",
      "Ellipse_1994_3",
      "Ellipse_1994_2",
    ];

    const candidateElement = document.getElementById("Ellipse_1994_2");

    const handleAnimationEnd = (event) => {
      if (event.animationName === "animation_Ellipse_1994_2_flow_2") {
        sourceIdNames.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            const animation = element.style.animation;
            element.style.animation = "none";
            setTimeout(() => {
              element.style.animation = animation;
            }, 5);
          }
        });
      }
    };

    if (candidateElement) {
      candidateElement.addEventListener("animationend", handleAnimationEnd);
    }

    return () => {
      if (candidateElement) {
        candidateElement.removeEventListener("animationend", handleAnimationEnd);
      }
    };
  }, []);

  return (
    <div className="svg-container" style={{ border: "2px solid #e6e6e6" }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="622" height="466" viewBox="0 0 622 466" fill="none">
        <g id="Frame_1261155978_0">
          <rect width="622" height="466" fill="white" x="0" y="0" transform="rotate(0 311 233)" />
          <circle id="Ellipse_1994_2" opacity="0" cx="146.5" cy="163.5" r="29.5" />
          <circle id="Ellipse_1994_3" cx="146.5" cy="163.5" r="29.5" />
          <circle id="Ellipse_1998_5" cx="117.5" cy="193.5" r="29.5" />
          <circle id="Ellipse_1996_7" cx="176.5" cy="133.5" r="29.5" />
          <circle id="Ellipse_1997_9" cx="176.5" cy="193.5" r="29.5" />
        </g>
        <defs>
          {/* Add radial gradients as needed */}
        </defs>
      </svg>
    </div>
  );
}

export default LoadingAnimation;
