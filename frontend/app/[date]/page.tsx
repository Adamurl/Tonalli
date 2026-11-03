import { notFound, redirect } from "next/navigation";
import { isValidCalendarDate } from "../../lib/calendar";

export default async function DayDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!isValidCalendarDate(date)) notFound();
  redirect(`/?date=${encodeURIComponent(date)}`);
}
