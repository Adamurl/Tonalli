import { SignGlyph } from "./SignGlyph";
import { GlyphHoverLabel } from "./GlyphHoverLabel";

export function TrecenaPanel({
  sign,
}: {
  sign: { sign: string; english: string };
}) {
  return (
    <section className="period-panel" aria-label="Trecena">
      <div className="period-panel__copy">
        <h2>Trecena</h2>
        <p>13-Day Period</p>
      </div>
      <GlyphHoverLabel name={sign.sign}>
        <SignGlyph sign={sign.sign} size="small" />
      </GlyphHoverLabel>
    </section>
  );
}
