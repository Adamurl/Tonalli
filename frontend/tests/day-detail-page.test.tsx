import { describe, expect, it, vi } from "vitest";
import DayDetailPage from "../app/[date]/page";

const { redirect, notFound } = vi.hoisted(() => ({
  redirect: vi.fn(() => { throw new Error("redirect"); }),
  notFound: vi.fn(() => { throw new Error("not found"); }),
}));
vi.mock("next/navigation", () => ({ redirect, notFound }));

describe("legacy date route", () => {
  it("redirects to the continuous experience with the selected date", async () => {
    await expect(DayDetailPage({ params: Promise.resolve({ date: "2026-03-29" }) })).rejects.toThrow("redirect");
    expect(redirect).toHaveBeenCalledWith("/?date=2026-03-29");
  });
  it.each(["not-a-date", "2026-02-30"])("rejects invalid date %s", async (date) => {
    await expect(DayDetailPage({ params: Promise.resolve({ date }) })).rejects.toThrow("not found");
    expect(notFound).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
