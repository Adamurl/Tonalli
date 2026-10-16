"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += noise(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  uv.y = 1.0 - uv.y;
  vec2 p = uv * vec2(uResolution.x / uResolution.y, 1.0) * 2.2;
  float time = uTime * 0.12;

  vec2 flow = vec2(
    fbm(p + vec2(time, -time * 0.7)),
    fbm(p + vec2(-time * 0.6, time * 0.8) + 5.2)
  );
  vec2 warped = p + (flow - 0.5) * 1.35;
  float liquid = fbm(warped + vec2(time * 0.45, -time * 0.3));
  float y = clamp(uv.y + (liquid - 0.5) * 0.46, 0.0, 1.0);

  vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(0.10, 0.008, 0.014), smoothstep(0.48, 0.68, y));
  color = mix(color, vec3(0.49, 0.067, 0.09), smoothstep(0.64, 0.83, y));
  color = mix(color, vec3(0.96, 0.176, 0.20), smoothstep(0.78, 0.96, y));
  color = mix(color, vec3(1.0, 0.53, 0.54), smoothstep(0.93, 1.0, y));

  float grain = hash(gl_FragCoord.xy) - 0.5;
  color += grain * 0.035;
  gl_FragColor = vec4(color, 1.0);
}
`;

export function CalendarAmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const shaderContainer: HTMLDivElement = container;

    let disposed = false;
    let frameId = 0;
    let resizeObserver: ResizeObserver | undefined;
    let stopAnimation = () => {};
    let canvas: HTMLCanvasElement | undefined;

    async function mountShader() {
      try {
        const { Mesh, Program, Renderer, Transform, Triangle } = await import("ogl");
        if (disposed) return;

        const bounds = shaderContainer.getBoundingClientRect();
        const renderer = new Renderer({
          alpha: true,
          antialias: false,
          dpr: Math.min(window.devicePixelRatio || 1, 1.5),
          width: Math.max(bounds.width, 1),
          height: Math.max(bounds.height, 1),
          powerPreference: "low-power",
        });
        const gl = renderer.gl;
        canvas = gl.canvas;
        canvas.className = "liquid-gradient-canvas";
        canvas.setAttribute("aria-hidden", "true");
        shaderContainer.appendChild(canvas);

        const program = new Program(gl, {
          vertex: vertexShader,
          fragment: fragmentShader,
          uniforms: {
            uResolution: { value: [renderer.width * renderer.dpr, renderer.height * renderer.dpr] },
            uTime: { value: 0 },
          },
          depthTest: false,
          depthWrite: false,
        });
        const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
        mesh.frustumCulled = false;
        const scene = new Transform();
        scene.addChild(mesh);

        function resize() {
          const nextBounds = shaderContainer.getBoundingClientRect();
          if (!nextBounds.width || !nextBounds.height) return;
          renderer.setSize(nextBounds.width, nextBounds.height);
          program.uniforms.uResolution.value = [canvas!.width, canvas!.height];
        }

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(shaderContainer);

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        function draw(time = 0) {
          program.uniforms.uTime.value = prefersReducedMotion.matches ? 0 : time * 0.001;
          renderer.render({ scene });
          if (!prefersReducedMotion.matches) {
            frameId = window.requestAnimationFrame(draw);
          }
        }

        function handleMotionPreferenceChange() {
          window.cancelAnimationFrame(frameId);
          draw(0);
        }

        prefersReducedMotion.addEventListener("change", handleMotionPreferenceChange);
        stopAnimation = () => {
          prefersReducedMotion.removeEventListener("change", handleMotionPreferenceChange);
          window.cancelAnimationFrame(frameId);
          resizeObserver?.disconnect();
        };
        draw(0);
      } catch {
        // Keep the CSS gradient visible when WebGL is unavailable.
      }
    }

    void mountShader();
    return () => {
      disposed = true;
      stopAnimation();
      canvas?.remove();
    };
  }, []);

  return <div className="calendar-ambient-background" ref={containerRef} aria-hidden="true" />;
}
