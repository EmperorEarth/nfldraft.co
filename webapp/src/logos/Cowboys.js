export default function Logo({ height, size, width }) {
  if (!height || !width) {
    width = size;
    height = Math.round((size * 411) / 432);
  }
  return (
    <svg height={height} viewBox="0 0 432 411" width={width}>
      <path
        d="M216,1.28223L348.674,409.61L1.32959,157.25H430.67L83.3264,409.61Z"
        fill="#002244"
      />
      <path
        d="M216,38.9871L326.511,379.106L37.1892,168.901H394.811L105.489,379.106Z"
        fill="#FFFFFF"
      />
      <path
        d="M216,68.2722L309.298,355.414L65.0408,177.95H366.959L122.702,355.414Z"
        fill="#002244"
      />
    </svg>
  );
}
