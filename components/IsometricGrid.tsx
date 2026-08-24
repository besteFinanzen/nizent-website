"use client";

export default function IsometricGrid() {
  return (
    <svg
      className="isometric-grid"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="iso-grid"
          width="60"
          height="104"
          patternUnits="userSpaceOnUse"
          patternTransform="skewY(30)"
        >
          <line
            x1="0" y1="0" x2="0" y2="104"
            stroke="#00e0ff"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <line
            x1="0" y1="52" x2="60" y2="52"
            stroke="#00e0ff"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#iso-grid)" />
    </svg>
  );
}
