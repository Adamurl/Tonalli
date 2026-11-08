import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import crocodile from "../assets/DaySignMeaningBG/Crocodile.png";
import wind from "../assets/DaySignMeaningBG/Wind.png";
import house from "../assets/DaySignMeaningBG/House.png";
import iguana from "../assets/DaySignMeaningBG/Iguana.png";
import snake from "../assets/DaySignMeaningBG/Snake.png";
import death from "../assets/DaySignMeaningBG/Death.png";
import deer from "../assets/DaySignMeaningBG/Deer.png";
import rabbit from "../assets/DaySignMeaningBG/Rabbit.png";
import water from "../assets/DaySignMeaningBG/Water.png";
import dog from "../assets/DaySignMeaningBG/Dog.png";
import grass from "../assets/DaySignMeaningBG/Grass.png";
import reed from "../assets/DaySignMeaningBG/Reed.png";
import jaguar from "../assets/DaySignMeaningBG/Jaguar.png";
import eagle from "../assets/DaySignMeaningBG/Eagle.png";
import vulture from "../assets/DaySignMeaningBG/Vulture.png";
import movement from "../assets/DaySignMeaningBG/Movement.png";
import flint from "../assets/DaySignMeaningBG/Flint.png";
import rain from "../assets/DaySignMeaningBG/Rain.png";
import flower from "../assets/DaySignMeaningBG/Flower.png";
import monkey from "../assets/DaySignMeaningBG/Monkey.png";
import styles from "./SignStorySection.module.css";
import type { DaySignSummary } from "../lib/calendar";

const MEANING_ARTWORK: Readonly<Partial<Record<string, StaticImageData>>> = {
  Cipactli: crocodile,
  Ehecatl: wind,
  Calli: house,
  Cuetzpalin: iguana,
  Coatl: snake,
  Miquiztli: death,
  Mazatl: deer,
  Tochtli: rabbit,
  Atl: water,
  Itzcuintli: dog,
  Malinalli: grass,
  Acatl: reed,
  Ocelotl: jaguar,
  Cuauhtli: eagle,
  Cozcacuauhtli: vulture,
  Ollin: movement,
  Tecpatl: flint,
  Quiahuitl: rain,
  Xochitl: flower,
  Ozomahtli: monkey,
};

const SIGN_PALETTE: Readonly<Record<string, { background: string; text: string; artwork: "dark" | "light" }>> = {
  Cipactli: { background: "#819345", text: "#1B260D", artwork: "dark" },
  Ehecatl: { background: "#80B6D6", text: "#57300D", artwork: "dark" },
  Calli: { background: "#CD704E", text: "#0E262E", artwork: "dark" },
  Cuetzpalin: { background: "#B4CD52", text: "#34204D", artwork: "dark" },
  Coatl: { background: "#359B78", text: "#301B0A", artwork: "dark" },
  Miquiztli: { background: "#171719", text: "#D8A5C6", artwork: "light" },
  Mazatl: { background: "#B88A58", text: "#142F41", artwork: "dark" },
  Tochtli: { background: "#AF96CF", text: "#463610", artwork: "dark" },
  Atl: { background: "#43B5C1", text: "#4A250F", artwork: "dark" },
  Itzcuintli: { background: "#FF2D33", text: "#03221E", artwork: "dark" },
  Ozomahtli: { background: "#EF9544", text: "#28204F", artwork: "dark" },
  Malinalli: { background: "#709C68", text: "#371E32", artwork: "dark" },
  Acatl: { background: "#C6B352", text: "#2E3264", artwork: "dark" },
  Ocelotl: { background: "#D9A52E", text: "#30225D", artwork: "dark" },
  Cuauhtli: { background: "#D76532", text: "#09222F", artwork: "dark" },
  Cozcacuauhtli: { background: "#54324D", text: "#A7D7A6", artwork: "light" },
  Ollin: { background: "#EF716B", text: "#0D3633", artwork: "dark" },
  Tecpatl: { background: "#626E86", text: "#FCEFD3", artwork: "light" },
  Quiahuitl: { background: "#48599B", text: "#F7CDB0", artwork: "light" },
  Xochitl: { background: "#D781B3", text: "#183A31", artwork: "dark" },
};

export function SignStorySection({ sign }: { sign: DaySignSummary }) {
  const description = sign.description?.trim();
  const paragraphs = description
    ? description.match(/[^.!?]+[.!?]+(?:[”’"])?|[^.!?]+$/g)?.reduce<string[]>((groups, sentence, index) => {
        const paragraphIndex = Math.floor(index / 2);
        groups[paragraphIndex] = groups[paragraphIndex]
          ? `${groups[paragraphIndex]} ${sentence.trim()}`
          : sentence.trim();
        return groups;
      }, []) ?? [description]
    : [];
  const artwork = MEANING_ARTWORK[sign.name];
  const palette = SIGN_PALETTE[sign.name];
  const sectionStyle = palette
    ? { "--sign-background": palette.background, "--sign-text": palette.text } as CSSProperties
    : undefined;
  return (
    <section className={styles.section} aria-labelledby="sign-story-heading" data-day-sign={sign.name} data-artwork-tone={palette?.artwork ?? "dark"} data-header-surface="image" style={sectionStyle}>
      {artwork && (
        <div className={styles.artwork} aria-hidden="true">
          <Image src={artwork} alt="" fill sizes="(max-width: 760px) 100vw, 59vw" className={styles.artworkImage} />
        </div>
      )}
      <div className={styles.content}>
        <h2 id="sign-story-heading">The meaning behind {sign.name}</h2>
        {paragraphs.length
          ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          : <p>A description of this day sign is not available yet.</p>}
        <details className={styles.disclosure}>
          <summary>Learn more</summary>
          <p>{sign.name} ({sign.english}) is day sign {sign.position} in the twenty-day sequence.</p>
        </details>
      </div>
    </section>
  );
}
