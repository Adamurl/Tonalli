import Image, { type StaticImageData } from "next/image";

import acatl from "../assets/Acatl.png";
import atl from "../assets/Atl.png";
import calli from "../assets/Calli.png";
import cipactli from "../assets/Cipactli.png";
import coatl from "../assets/Coatl.png";
import cozcacuauhtli from "../assets/Cozcacuauhtli.png";
import cuetzpalin from "../assets/Cuetzpalin.png";
import ehecatl from "../assets/Ehecatl.png";
import itzcuintli from "../assets/Itzcuintli.png";
import malinalli from "../assets/Malinalli.png";
import mazatl from "../assets/Mazatl.png";
import miquiztli from "../assets/Miquiztli.png";
import ocelotl from "../assets/Ocelotl.png";
import ollin from "../assets/Ollin.png";
import ozomahtli from "../assets/Ozomahtli.png";
import quiahuitl from "../assets/Quiahuitl.png";
import tecpatl from "../assets/Tecpatl.png";
import tochtli from "../assets/Tochtli.png";
import xochitl from "../assets/Xochitl.png";

const SIGN_GLYPHS: Record<string, StaticImageData> = {
  Acatl: acatl,
  Atl: atl,
  Calli: calli,
  Cipactli: cipactli,
  Coatl: coatl,
  Cozcacuauhtli: cozcacuauhtli,
  Cuetzpalin: cuetzpalin,
  Ehecatl: ehecatl,
  Itzcuintli: itzcuintli,
  Malinalli: malinalli,
  Mazatl: mazatl,
  Miquiztli: miquiztli,
  Ocelotl: ocelotl,
  Ollin: ollin,
  Ozomahtli: ozomahtli,
  Quiahuitl: quiahuitl,
  Tecpatl: tecpatl,
  Tochtli: tochtli,
  Xochitl: xochitl,
};

type SignGlyphProps = {
  sign?: string;
  size: "hero" | "small";
};

export function SignGlyph({ sign, size }: SignGlyphProps) {
  const glyph = sign ? SIGN_GLYPHS[sign] : undefined;

  return (
    <div className={`sign-glyph-frame sign-glyph-frame--${size}`}>
      {glyph && sign ? (
        <Image
          className="sign-glyph"
          src={glyph}
          alt={`${sign} day-sign glyph`}
          fill
          sizes={size === "hero" ? "(max-width: 600px) 60vw, min(28vw, 25rem)" : "6rem"}
          priority={size === "hero"}
        />
      ) : (
        <span
          className="glyph-placeholder"
          role="img"
          aria-label={sign ? `Glyph for ${sign} will be added later` : "Loading calendar glyph"}
        >
          GLYPH
        </span>
      )}
    </div>
  );
}
