export default function Logo({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="logo-mark"
    >
      <defs>
        <linearGradient id="sca-face-a" x1="4" y1="8" x2="24" y2="28">
          <stop offset="0%" stopColor="#8fd8ff" />
          <stop offset="100%" stopColor="#4a8fe0" />
        </linearGradient>
        <linearGradient id="sca-face-b" x1="24" y1="12" x2="44" y2="40">
          <stop offset="0%" stopColor="#5b9df9" />
          <stop offset="100%" stopColor="#2f5fa8" />
        </linearGradient>
        <linearGradient id="sca-top" x1="8" y1="4" x2="40" y2="16">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#bcd9f5" />
        </linearGradient>
      </defs>
      {/* isometric cube */}
      <path d="M24 3 44 13.5 24 24 4 13.5 24 3Z" fill="url(#sca-top)" />
      <path d="M4 13.5 24 24v21L4 34.5v-21Z" fill="url(#sca-face-a)" />
      <path d="M44 13.5 24 24v21l20-10.5v-21Z" fill="url(#sca-face-b)" />
      {/* code bracket cut into the front faces */}
      <path
        d="M14.5 25.8v4.4l-3.1 1.6 3.1 1.6v4.4L8 34.3v-5.2l6.5-3.3Z"
        fill="#0b0b0c"
        opacity="0.55"
      />
      <path
        d="M33.5 25.8 40 29.1v5.2l-6.5 3.5v-4.4l3.1-1.6-3.1-1.6v-4.4Z"
        fill="#0b0b0c"
        opacity="0.4"
      />
      <path d="M27 25.4 21.6 41l-2.8-1.4L24.2 24l2.8 1.4Z" fill="#0b0b0c" opacity="0.45" />
    </svg>
  );
}
