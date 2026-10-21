import Image, { type StaticImageData } from "next/image";

import acatl from "../assets/icons/Acatl.png";
import atl from "../assets/icons/Atl.png";
import calli from "../assets/icons/Calli.png";
import cipactli from "../assets/icons/Cipactli.png";
import coatl from "../assets/icons/Coatl.png";
import cozcacuauhtli from "../assets/icons/Cozcacuauhtli.png";
import cuauhtli from "../assets/icons/Cuauhtli.png";
import cuetzpalin from "../assets/icons/Cuetzpalin.png";
import ehecatl from "../assets/icons/Ehecatl.png";
import itzcuintli from "../assets/icons/Itzcuintli.png";
import malinalli from "../assets/icons/Malinalli.png";
import mazatl from "../assets/icons/Mazatl.png";
import miquiztli from "../assets/icons/Miquiztli.png";
import ocelotl from "../assets/icons/Ocelotl.png";
import ollin from "../assets/icons/Ollin.png";
import ozomahtli from "../assets/icons/Ozomahtli.png";
import quiahuitl from "../assets/icons/Quiahuitl.png";
import tecpatl from "../assets/icons/Tecpatl.png";
import tochtli from "../assets/icons/Tochtli.png";
import xochitl from "../assets/icons/Xochitl.png";

const SIGN_GLYPHS: Record<string, StaticImageData> = {
  Acatl: acatl,
  Atl: atl,
  Calli: calli,
  Cipactli: cipactli,
  Coatl: coatl,
  Cozcacuauhtli: cozcacuauhtli,
  Cuauhtli: cuauhtli,
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
