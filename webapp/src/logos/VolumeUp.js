export default function VolumeUpIcon({ color = "white", height, size, width }) {
  if (!height || !width) {
    height = size;
    width = size;
  }
  return (
    <svg width={width} height={height} viewBox="0 0 18 18">
      <path
        d="M12.79 9c0-1.3-.72-2.42-1.79-3v6c1.06-.58 1.79-1.7 1.79-3zM2 7v4h3l4 4V3L5 7H2zm9-5v1.5c2.32.74 4 2.93 4 5.5s-1.68 4.76-4 5.5V16c3.15-.78 5.5-3.6 5.5-7S14.15 2.78 11 2z"
        fill={color}
      />
    </svg>
  );
}
