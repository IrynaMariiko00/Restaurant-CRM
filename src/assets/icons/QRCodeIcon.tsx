export const QRCodeIcon = () => {
  return (
    <svg
      className="w-32 h-32 text-[var(--icon-color)] opacity-60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h2m3 0h2m-5 3h2m3 0h2m-5 4h2m3 0h2" />
      <path d="M14 14v2m0 3v2m3-5v2m0 3v2m4-5v2m0 3v2" />
    </svg>
  );
};
