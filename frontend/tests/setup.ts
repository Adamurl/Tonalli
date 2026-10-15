import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

vi.mock("next/image", async () => {
  const React = await import("react");

  return {
    default: (props: Record<string, unknown>) => {
      const { src, fill: _fill, priority: _priority, ...imageProps } = props;
      const assetUrl =
        typeof src === "string"
          ? src
          : typeof src === "object" && src !== null && "src" in src
            ? src.src
            : "";

      return React.createElement("img", {
        ...imageProps,
        src: assetUrl,
      } as React.ImgHTMLAttributes<HTMLImageElement>);
    },
  };
});
