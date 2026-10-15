# Tonalpohualli day-sign content package

One Markdown record per day sign. The files use consistent categories and are intended as editorial drafts for import into Supabase/Postgres.

## Standardized categories

- **Quick reference:** sequence position, translation, glyph description, and attributed deity.
- **Literal meaning and glyph:** lexical meaning and pictorial depiction.
- **Core meanings and symbolism:** culturally grounded themes; not personality traits or automatic predictions.
- **Cultural and historical context:** mythic, ritual, social, ecological, and calendrical context.
- **Day-sign deity association:** the deity listed by AztecCalendar.com, explicitly marked source-specific.
- **App-safe description:** concise public-facing copy.
- **Editorial cautions:** disagreements and limits on interpretation.
- **Sources:** bibliography and direct references.

## Interpretation rule

A Tonalpohualli date combines a number (1–13) and a sign. Historical interpretation can also depend on the trecena and its patron, other calendrical cycles, and the question being divined. These records describe the sign's contribution to the calendar's symbolic vocabulary; they do not assign a fixed fortune or personality to everyone born on a date with that sign.

AztecCalendar.com separately lists day-sign deities, numeral deities, and trecena patrons. Keep those as separate data. Its definite fate descriptions are that site's interpretive model, not universal scholarly consensus.

## Suggested database mapping

- day_signs: slug, position, nahuatl_name, english_label, literal_translation, glyph_description, app_safe_description, content_status.
- day_sign_sections: day_sign_id, section_key, body_markdown, display_order.
- sources: citation metadata and URL.
- section_sources: section_id, source_id, locator, claim_scope.

For an initial import, prose can remain in section-level Markdown fields. If you later need citations attached to individual claims, split those claims into individual rows. Store each deity name with its source and certainty. In Supabase, enable row-level security and allow public reads only for published content; keep privileged credentials out of browser code.

## Research sources

- **[S1]** Bernardino de Sahagún, *Florentine Codex*, Book IV, trans. Arthur J. O. Anderson and Charles E. Dibble. [Digital Florentine Codex](https://florentinecodex.getty.edu/book/4/folio/1r)
- **[S2]** Elizabeth Hill Boone, *Cycles of Time and Meaning in the Mexican Books of Fate* (University of Texas Press, 2007). [Publisher page](https://utpress.utexas.edu/9780292712638/)
- **[S3]** *Tonalámatl de Aubin*, INAH, Códices de México. [Manuscript overview](https://www.codices.inah.gob.mx/pc/contenido.php?id=2)
- **[S4]** Enrique Vela, “El tonalpohualli,” *Arqueología Mexicana*. [Article](https://www.arqueologiamexicana.mx/mexico-antiguo/el-tonalpohualli)
- **[S5]** Gabriel K. Kruell, “Algunas precisiones terminológicas sobre el calendario náhuatl,” *Estudios de Cultura Náhuatl* 54 (UNAM, 2017), 135–164. [Article](https://nahuatl.historicas.unam.mx/index.php/ecn/article/view/77841)
- **[S6]** Rafael Tena, *El calendario mexica y la cronografía*, INAH.
- **[S7]** Diego Durán, *Historia de las Indias de Nueva España e Islas de Tierra Firme*.
- **[S8]** Diana Magaloni Kerpel, “El origen mítico de las ciudades,” *Arqueología Mexicana*. [Article](https://arqueologiamexicana.mx/mexico-antiguo/origen-mitico-de-las-ciudades)
- **[S9]** AztecCalendar.com, “Introduction to the Aztec Calendar.” [Structure and deity tables](https://www.azteccalendar.com/azteccalendar.html)
- **[S10]** AztecCalendar.com day-sign pages; each sign file links its matching page.

AztecCalendar.com is used for the deity table and interpretive model requested. Its day-fortune claims remain attributed to that site rather than merged with context-dependent evidence from colonial sources and modern scholarship.
