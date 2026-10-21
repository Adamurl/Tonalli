-- Reference data transcribed from the user's workbook.
-- Gregorian spans describe its 2022 Mexico City correlation; the 365.25-day
-- boundary drifts by six hours per year, so these are reference spans only.
create table if not exists public.veintenas (
    position smallint primary key check (position between 1 and 19),
    name text not null unique,
    span text not null,
    span_es text not null,
    meaning_es text not null,
    meaning_en text not null,
    correlation text not null default 'workbook_2022_mexico_city',
    source text not null default 'Tonalpohualli updated 01.11.22.xlsx, Reference worksheet',
    constraint veintenas_position_name check (
        (position = 19 and name = 'Nemontemi')
        or (position between 1 and 18 and name <> 'Nemontemi')
    )
);

alter table public.veintenas enable row level security;
drop policy if exists "Public can read veintena reference" on public.veintenas;
create policy "Public can read veintena reference"
    on public.veintenas for select to anon, authenticated using (true);
grant select on public.veintenas to anon, authenticated;

insert into public.veintenas
    (position, name, span, span_es, meaning_es, meaning_en)
values
    (1, 'Atlacahualo', 'March 12–31', '12–31 de marzo', 'Lo dejado por las aguas', 'What is left by the water'),
    (2, 'Tlacaxipehualiztli', 'April 1–20', '1–20 de abril', 'El cambio en la Persona', 'The Change in the Person'),
    (3, 'Tezoztontli', 'April 21–May 10', '21 de abril–10 de mayo', 'La Pequeña velación', 'The Small Vigil'),
    (4, 'Hueytozoztli', 'May 11–30', '11–30 de mayo', 'La gran velación', 'The Big Vigil'),
    (5, 'Toxcatl', 'May 31–June 19', '31 de mayo–19 de junio', 'Las cosas secas', 'The Dry things'),
    (6, 'Etzalcualiztli', 'June 20–July 9', '20 de junio–9 de julio', 'Comer frijol y maíz', 'The feast of beans & corn'),
    (7, 'Tecuilhuitontli', 'July 10–29', '10–29 de julio', 'Fiesta de los Señores', 'Fiesta of the Great people'),
    (8, 'Huey Tecuilhuitl', 'July 30–August 18', '30 de julio–18 de agosto', 'La Gran Fiesta de los Señores', 'The Big fiesta of the great people'),
    (9, 'Tlaxochimaco', 'August 19–September 7', '19 de agosto–7 de septiembre', 'Ofrenda de Flores', 'Offering of the Flowers'),
    (10, 'Xocotl Huetzi', 'September 8–27', '8–27 de septiembre', 'La Caída de los Frutos', 'The Falling of the Fruit'),
    (11, 'Ochpaniztli', 'September 28–October 17', '28 de septiembre–17 de octubre', 'Barrimiento de los Caminos', 'The Sweeping of the Roads'),
    (12, 'Teotleco', 'October 18–November 6', '18 de octubre–6 de noviembre', 'La Llegada de los principios generadores de la Naturaleza', 'The Arriving of the principle generators of Nature'),
    (13, 'Tepeilhuitl', 'November 7–26', '7–26 de noviembre', 'La Fiesta de los Cerros', 'The Fiesta of the Mountains'),
    (14, 'Quecholli', 'November 27–December 16', '27 de noviembre–16 de diciembre', 'La Veintena del Flamingo', 'The 20 day count of the Flamingo'),
    (15, 'Panquetzaliztli', 'December 17–January 5', '17 de diciembre–5 de enero', 'El Levantamiento de los Estandartes', 'The Raising of the Standards'),
    (16, 'Atemoztli', 'January 6–25', '6–25 de enero', 'El Descenso de las Aguas', 'The Descent of the Water'),
    (17, 'Tititl', 'January 26–February 14', '26 de enero–14 de febrero', 'Veintena del recogimiento', 'The 20 day count of Absorption'),
    (18, 'Izcalli', 'February 15–March 6', '15 de febrero–6 de marzo', 'Veintena del resurgimiento', 'The 20 day count of Resurgence'),
    (19, 'Nemontemi', 'March 7–11; final boundary drifts by 6 hours each year', '7–11 de marzo; el límite final avanza 6 horas cada año', 'Tiempo de Reflexión', '5.25 days for Reflection')
on conflict (position) do update set
    name = excluded.name,
    span = excluded.span,
    span_es = excluded.span_es,
    meaning_es = excluded.meaning_es,
    meaning_en = excluded.meaning_en,
    correlation = excluded.correlation,
    source = excluded.source;
