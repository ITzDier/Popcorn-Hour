import React, { useState } from "react";

/**
 * Estrellas de calificación visualmente mejoradas para fondo oscuro.
 */
export default function RatingStars({ value = 0, setValue, readOnly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1,2,3,4,5,6,7,8,9,10].map(num => (
        <span
          key={num}
          style={{
            fontSize: "2.2em",
            color: (hovered ? hovered >= num : value >= num) ? "#FFD600" : "#3a3456",
            cursor: readOnly ? "default" : "pointer",
            marginRight: 2,
            filter: (hovered ? hovered >= num : value >= num) ? "drop-shadow(0 0 4px #FFD60088)" : "none",
            transition: "color 0.2s, filter 0.2s, transform 0.18s",
            transform: hovered === num ? "scale(1.18)" : "scale(1)"
          }}
          onClick={() => !readOnly && setValue(num)}
          onMouseOver={() => !readOnly && setHovered(num)}
          onMouseOut={() => !readOnly && setHovered(0)}
          aria-label={num}
          title={readOnly ? undefined : `Califica con ${num} estrella${num > 1 ? "s" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}