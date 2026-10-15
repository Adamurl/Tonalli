import { DotCount } from "./DotCount";
import { SignGlyph } from "./SignGlyph";

export function XihuitlPanel({
  sign,
}: {
  sign: { number: number; sign: string };
}) {
  return (
    <section className="period-panel" aria-label="Xihuitl">
      <div className="period-panel__copy">
        <h2>Xihuitl</h2>
        <p>Solar Year</p>
      </div>
      <div className="xihuitl-panel__glyph">
        <SignGlyph sign={sign.sign} size="small" />
        <DotCount count={sign.number} small />
      </div>
    </section>
  );
}
