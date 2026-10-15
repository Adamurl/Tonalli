type DotCountProps = {
  count: number;
  small?: boolean;
};

/** Renders up to thirteen dots in columns of five, filling from right to left. */
export function DotCount({ count, small = false }: DotCountProps) {
  const dotCount = Number.isInteger(count) ? Math.max(0, Math.min(count, 13)) : 0;

  return (
    <div
      className={`dot-count${small ? " dot-count--small" : ""}`}
      role="img"
      aria-label={`${dotCount} dot${dotCount === 1 ? "" : "s"}`}
    >
      {Array.from({ length: dotCount }, (_, index) => (
        <span className="dot-count__dot" key={index} aria-hidden="true" />
      ))}
    </div>
  );
}
