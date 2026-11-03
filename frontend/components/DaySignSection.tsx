import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import acatl from "../assets/Backgrounds/BG_Acatl.jpg";
import atl from "../assets/Backgrounds/BG_Atl.jpg";
import calli from "../assets/Backgrounds/BG_Calli.jpg";
import cipactli from "../assets/Backgrounds/BG_Cipactli.jpg";
import coatl from "../assets/Backgrounds/BG_Coatl.jpg";
import cozcacuauhtli from "../assets/Backgrounds/BG_Cozcacuauhtli.jpg";
import cuauhtli from "../assets/Backgrounds/BG_Cuauhtli.jpg";
import cuetzpalin from "../assets/Backgrounds/BG_Cuetzpalin.jpg";
import ehecatl from "../assets/Backgrounds/BG_Ehecatl.jpg";
import itzcuintli from "../assets/Backgrounds/BG_Itzcuintli.jpg";
import malinalli from "../assets/Backgrounds/BG_Malinalli.jpg";
import mazatl from "../assets/Backgrounds/BG_Mazatl.jpg";
import miquiztli from "../assets/Backgrounds/BG_Miquiztli.jpg";
import ocelotl from "../assets/Backgrounds/BG_Ocelotl.jpg";
import ollin from "../assets/Backgrounds/BG_Ollin.jpg";
import ozomahtli from "../assets/Backgrounds/BG_Ozomahtli.jpg";
import quiahuitl from "../assets/Backgrounds/BG_Quiahuitl.jpg";
import tecpatl from "../assets/Backgrounds/BG_Tecpatl.jpg";
import tochtli from "../assets/Backgrounds/BG_Tochtli.jpg";
import xochitl from "../assets/Backgrounds/BG_Xochitl.jpg";

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

export function DaySignArtwork({ sign, className = "", imageClassName = "" }: {
  sign: TonalpohualliDate;
  className?: string;
  imageClassName?: string;
}) {
  const background = DAY_SIGN_BACKGROUNDS[sign.sign];
  return (
    <div className={className} role="img" aria-label={`${sign.sign} day sign artwork${background ? "" : " placeholder"}`}>
      {background && <Image className={imageClassName} src={background} alt="" fill sizes="100vw" priority placeholder="blur" />}
    </div>
  );
}

export function DaySignSection({ sign, artwork }: {
  sign: TonalpohualliDate;
  artwork?: ReactNode;
}) {
  const numberName = NAHUATL_NUMBERS[sign.number];
  return (
    <section className="day-sign" aria-label="Today’s Tonalpohualli sign">
      <div className="day-sign__composition">
        <span className="day-sign__word day-sign__word--number">{numberName}</span>
        {artwork ?? <DaySignArtwork sign={sign} className="day-sign__art-placeholder" imageClassName="day-sign__art-image" />}
        <h1 className="day-sign__word" aria-label={numberName ? `${numberName} ${sign.sign}` : sign.sign}>{sign.sign}</h1>
        <div className="day-sign__translations">
          <p>{sign.number}</p><span aria-hidden="true" /><p>{sign.english}</p>
        </div>
      </div>
    </section>
  );
}
