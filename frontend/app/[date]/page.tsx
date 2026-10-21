"use client";

import { useParams } from "next/navigation";

import { DayDetailView } from "../../components/DayDetailView";

export default function DayDetailPage() {
  const { date } = useParams<{ date: string }>();
  return <DayDetailView date={date} presentation="page" />;
}
