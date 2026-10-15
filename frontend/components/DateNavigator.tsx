export function DateNavigator({
  date,
  onChange,
  onShift,
}: {
  date: string;
  onChange: (date: string) => void;
  onShift: (days: number) => void;
}) {
  return (
    <nav className="date-navigator" aria-label="Calendar date preview controls">
      <button type="button" onClick={() => onShift(-1)} aria-label="Previous day">
        ‹
      </button>
      <input
        aria-label="Calendar date"
        type="date"
        value={date}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="button" onClick={() => onShift(1)} aria-label="Next day">
        ›
      </button>
    </nav>
  );
}
