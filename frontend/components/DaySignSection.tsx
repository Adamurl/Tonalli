import Image, { type StaticImageData } from "next/image";

import acatl from "../assets/BG_Acatl.jpg";
import atl from "../assets/BG_Atl.jpg";
import calli from "../assets/BG_Calli.jpg";
import cipactli from "../assets/BG_Cipactli.jpg";
import coatl from "../assets/BG_Coatl.jpg";
import cozcacuauhtli from "../assets/BG_Cozcacuauhtli.jpg";
import cuauhtli from "../assets/BG_Cuauhtli.jpg";
import cuetzpalin from "../assets/BG_Cuetzpalin.jpg";
import ehecatl from "../assets/BG_Ehecatl.jpg";
import itzcuintli from "../assets/BG_Itzcuintli.jpg";
import malinalli from "../assets/BG_Malinalli.jpg";
import mazatl from "../assets/BG_Mazatl.jpg";
import miquiztli from "../assets/BG_Miquiztli.jpg";
import ocelotl from "../assets/BG_Ocelotl.jpg";
import ollin from "../assets/BG_Ollin.jpg";
import ozomahtli from "../assets/BG_Ozomahtli.jpg";
import quiahuitl from "../assets/BG_Quiahuitl.jpg";
import tecpatl from "../assets/BG_Tecpatl.jpg";
import tochtli from "../assets/BG_Tochtli.jpg";
import xochitl from "../assets/BG_Xochitl.jpg";

import { NAHUATL_NUMBERS, type TonalpohualliDate } from "../lib/calendar";

const DAY_SIGN_BACKGROUNDS: Record<string, StaticImageData> = {
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

export function DaySignSection({ sign }: { sign: TonalpohualliDate }) {
  const numberName = NAHUATL_NUMBERS[sign.number];
  const background = DAY_SIGN_BACKGROUNDS[sign.sign];

  return (
    <section className="day-sign" aria-label="Today’s Tonalpohualli sign">
      <div className="day-sign__composition">
        <div className="day-sign__title-row">
          <span className="day-sign__word" aria-label={numberName || String(sign.number)}>
            {numberName}
          </span>
          <div
            className="day-sign__art-placeholder"
            role="img"
            aria-label={background ? `${sign.sign} day sign artwork` : `${sign.sign} day sign artwork placeholder`}
          >
            {background && (
              <Image
                className="day-sign__art-image"
                src={background}
                alt=""
                fill
                sizes="12rem"
                priority
              />
            )}
          </div>
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
