function CareerTrackLogo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="CareerTrack logo"
    >
      {/* Blue rounded square */}
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx="20"
        fill="#5146E5"
      />

      {/* White rising zigzag arrow */}
      <path
        d="M25 72 L43 53 L54 65 L72 31"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrow head */}
      <path
        d="M54 31 H72 V49"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CareerTrackLogo;