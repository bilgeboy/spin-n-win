import React from "react";

export default function Wheel({ angle, segments }) {
  const size = 256;
  const radius = size / 2;
  const numSegments = segments.length;
  const segmentAngle = 360 / numSegments;

  const createPath = (index) => {
    const startAngle = segmentAngle * index;
    const endAngle = startAngle + segmentAngle;

    const x1 = radius + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = radius + radius * Math.sin((Math.PI * startAngle) / 180);
    const x2 = radius + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = radius + radius * Math.sin((Math.PI * endAngle) / 180);

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative w-64 h-64 mb-6">
      <svg
        width={size}
        height={size}
        className="transition-transform duration-[3000ms] ease-out"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        {segments.map((segment, index) => (
          <g key={index}>
            <path d={createPath(index)} fill={segment.color} />
          </g>
        ))}

        {/* שול */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - 5}
          fill="none"
          stroke="#b5651d"
          strokeWidth="10"
        />

        {/* טקסטים */}
        {segments.map((segment, index) => (
          <text
            key={`text-${index}`}
            x={radius}
            y={radius - 65}
            fill="white"
            fontSize="25"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(${
              segmentAngle * index + segmentAngle / 2
            }, ${radius}, ${radius})`}
          >
            {segment.label}
          </text>
        ))}
      </svg>

      {/* החץ */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-black"></div>
    </div>
  );
}
