import { DotCount } from "./DotCount";
import { SignGlyph } from "./SignGlyph";
import { NAHUATL_NUMBERS, type TonalpohualliDate } from "../lib/calendar";

export function DaySignSection({ sign }: { sign: TonalpohualliDate }) {
  const numberName = NAHUATL_NUMBERS[sign.number];
  return (
    <section className="day-sign" aria-labelledby="day-sign-name">
      <div className="day-sign__emblem">
        <DotCount count={sign.number} />
        <SignGlyph sign={sign.sign} size="hero" />
      </div>
      <div className="day-sign__identity">
        <h1 id="day-sign-name" className="day-sign__name">
          {numberName && <span>{numberName}</span>}
          <span>{sign.sign}</span>
        </h1>
        <p className="day-sign__translation">
          <span>{sign.number}</span>
          <span>{sign.english}</span>
        </p>
      </div>
    </section>
  );
}
