export default function Logo({ height, size, width }) {
  if (!height || !width) {
    width = size;
    height = Math.round((size * 500) / 500);
  }
  return (
    <svg height={height} viewBox="0 0 500 500" width={width}>
      <g fill="none" fillRule="evenodd">
        <polygon
          fill="#FFB612"
          fillRule="nonzero"
          points="0 0 37.462 31.237 80.257 220.225 183.325 220.225 233.668 66.687 285.553 220.225 381.651 220.225 441 .102 334.553 0 361.817 22.733 332.093 154.188 329.241 154.188 278.665 .102 187.551 .102 140.864 154.188 138.012 154.188 102.22 .102"
          transform="translate(30 140)"
        />
      </g>
    </svg>
  );
}
