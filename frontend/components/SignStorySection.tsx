import styles from "./SignStorySection.module.css";
import type { DaySignSummary } from "../lib/calendar";

export function SignStorySection({ sign }: { sign: DaySignSummary }) {
  const description = sign.description?.trim();
  return (
    <section className={styles.section} aria-labelledby="sign-story-heading" data-header-surface="image">
      <div className={styles.artwork} aria-hidden="true" />
      <div className={styles.content}>
        <h2 id="sign-story-heading">The meaning behind<br />the sign</h2>
        <p>{description || "A description of this day sign is not available yet."}</p>
        <details className={styles.disclosure}>
          <summary>Learn more</summary>
          <p>{sign.name} ({sign.english}) is day sign {sign.position} in the twenty-day sequence.</p>
        </details>
      </div>
    </section>
  );
}
