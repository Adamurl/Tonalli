import { NAHUATL_NUMBERS, type TonalpohualliDate } from "../lib/calendar";

export function DaySignSection({ sign }: { sign: TonalpohualliDate }) {
  const numberName = NAHUATL_NUMBERS[sign.number];

  return (
    <section className="day-sign" aria-label="Today’s Tonalpohualli sign">
      <div className="day-sign__composition">
        <div className="day-sign__title-row">
          <span className="day-sign__word" aria-label={numberName || String(sign.number)}>
            {numberName}
          </span>
          <div className="day-sign__art-placeholder" aria-label="Day sign artwork placeholder" />
          <h1 className="day-sign__word" aria-label={numberName ? `${numberName} ${sign.sign}` : sign.sign}>
            {sign.sign}
          </h1>
        </div>
        <div className="day-sign__translations">
          <p>{sign.number}</p>
          <span aria-hidden="true" />
          <p>{sign.english}</p>
        </div>
      </div>
    </section>
  );
}
