import { DayDetailView } from "../../../components/DayDetailView";

export default async function InterceptedDayDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  return <DayDetailView date={date} presentation="overlay" />;
}
