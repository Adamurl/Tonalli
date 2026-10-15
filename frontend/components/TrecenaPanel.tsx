import { SignGlyph } from "./SignGlyph";

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
      <SignGlyph sign={sign.sign} size="small" />
    </section>
  );
}
