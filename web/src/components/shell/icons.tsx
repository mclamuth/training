/** Small inline icons for the shell. Replace with the design system's set once chosen. */

export function AppLauncherIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      {[2, 8, 14].flatMap((y) =>
        [2, 8, 14].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="1" fill="currentColor" />),
      )}
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="10" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="15" width="16" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}
