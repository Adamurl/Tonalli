-- Rename content columns in place without changing any day-sign values.
begin;

lock table public.day_signs in access exclusive mode;

do $tonalli_rename$
declare
    column_pair record;
    old_exists boolean;
    new_exists boolean;
begin
    for column_pair in
        select * from (values
            ('app_safe_description', 'description'),
            ('literal_meaning_and_glyph', 'meaning_and_glyph'),
            ('core_meanings_and_symbolism', 'symbolism'),
            ('cultural_and_historical_context', 'cultural_context')
        ) as names(old_name, new_name)
    loop
        select
            exists (select 1 from pg_attribute
                where attrelid = 'public.day_signs'::regclass
                  and attname = column_pair.old_name and not attisdropped),
            exists (select 1 from pg_attribute
                where attrelid = 'public.day_signs'::regclass
                  and attname = column_pair.new_name and not attisdropped)
        into old_exists, new_exists;

        if old_exists = new_exists then
            raise exception 'Expected exactly one of day_signs.% or day_signs.% to exist',
                column_pair.old_name, column_pair.new_name;
        end if;
        if old_exists then
            execute format('alter table public.day_signs rename column %I to %I',
                column_pair.old_name, column_pair.new_name);
        end if;
    end loop;
end
$tonalli_rename$;

notify pgrst, 'reload schema';

commit;
