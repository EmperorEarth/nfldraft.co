export default function Logo({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <circle
        cx="12"
        cy="10.25"
        r="7.5"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <circle cx="12" cy="10.25" r="4" fill="red" />
      <path
        d="M12 16.25c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill="black"
      />
    </svg>
  );
}
