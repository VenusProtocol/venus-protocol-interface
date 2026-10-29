import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STAR_FIELD, STAR_TUNING } from '../constants';
import { getStarColor } from '../getStarColor';
import { getStarTier } from '../getStarTier';
import { hashSeed } from '../hashSeed';
import { isBehindContent } from '../isBehindContent';
import { sampleRange } from '../sampleRange';

// Drift and twinkle are derived from elapsed time on the GPU, so a frame costs one
// uniform write and one draw call rather than a pass over every star.
const VERTEX_SHADER = `
  attribute float aSize;
  attribute float aBaseIntensity;
  attribute vec3 aColor;
  attribute vec2 aTwinkle;
  attribute vec4 aDrift;

  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uMotion;
  uniform float uSpan;
  uniform float uMargin;
  uniform float uDriftScale;
  uniform float uTwinkleMidpoint;
  uniform float uTwinkleAmplitude;

  varying float vIntensity;
  varying vec3 vColor;

  const float TAU = 6.283185307179586;

  void main() {
    vColor = aColor;

    float twinkleRate = aTwinkle.x;
    float twinklePhase = aTwinkle.y;
    float twinkle = uTwinkleMidpoint + uTwinkleAmplitude * sin((uTime * twinkleRate + twinklePhase) * TAU);
    vIntensity = aBaseIntensity * mix(1.0, twinkle, step(0.0001, twinkleRate) * uMotion);

    float velocity = aDrift.x;
    float verticalAmplitude = aDrift.y;
    float verticalWavelength = aDrift.z;
    float driftPhase = aDrift.w;

    float travel = mod(uTime * velocity * uDriftScale, uSpan) * uMotion;
    float x = mod(position.x + travel + uMargin, uSpan) - uMargin;
    float y = position.y + verticalAmplitude *
      (sin((travel / verticalWavelength) * TAU + driftPhase) - sin(driftPhase)) * uMotion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, position.z, 1.0);
    gl_PointSize = aSize * uPixelRatio;
  }
`;

const FRAGMENT_SHADER = `
  varying float vIntensity;
  varying vec3 vColor;

  void main() {
    vec2 point = gl_PointCoord - vec2(0.5);
    float radius = length(point);
    float core = 1.0 - smoothstep(0.04, 0.2, radius);
    float halo = 1.0 - smoothstep(0.12, 0.5, radius);
    float alpha = (core * 0.78 + halo * 0.22) * vIntensity;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// A defocused backdrop reads the same at one device pixel per CSS pixel.
const PIXEL_RATIO = 1;
// The sky drifts a few pixels a second, so a sixth of the display's rate is already
// finer than the eye can follow.
const FRAME_INTERVAL_MS = 1000 / 15;
// Stars do not share a period, so wrapping jumps the sky. Keep the uniform
// precise enough for the shader while pushing the wrap past any session.
const TIME_WRAP_SECONDS = 86400;
// Only guards against a long stall; must stay above the frame interval so a
// normal frame advances by the time it actually took.
const MAX_STEP_SECONDS = 0.25;

export const StarCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(PIXEL_RATIO);
    renderer.setClearAlpha(0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, 0.1, 2000);
    camera.position.z = 1000;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const { minimumBrightness } = STAR_FIELD.twinkle;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: PIXEL_RATIO },
        uTime: { value: 0 },
        uMotion: { value: motionQuery.matches ? 0 : 1 },
        uSpan: { value: 1 },
        uMargin: { value: STAR_FIELD.drift.wrapMarginPixels },
        uDriftScale: { value: STAR_TUNING.drift },
        uTwinkleMidpoint: { value: (1 + minimumBrightness) / 2 },
        uTwinkleAmplitude: { value: (1 - minimumBrightness) / 2 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });

    let width = Math.max(mount.clientWidth, 1);
    let height = Math.max(mount.clientHeight, 1);
    let mesh: THREE.Points | undefined;
    let elapsedSeconds = 0;
    let lastTimeMs = 0;
    let frame = 0;
    let isVisible = false;

    const buildStars = () => {
      if (mesh) {
        mesh.geometry.dispose();
        scene.remove(mesh);
      }

      const { counts, areaScale, referenceViewport, distribution, size, brightness } = STAR_FIELD;
      const density = STAR_TUNING.stars / (counts.dust + counts.bright + counts.glint);
      const referenceArea = referenceViewport.width * referenceViewport.height;
      const scale = Math.min(
        areaScale.max,
        Math.max(areaScale.min, (width * height) / referenceArea),
      );
      const dustCount = Math.round(counts.dust * scale * density);
      const brightCount = Math.max(3, Math.round(counts.bright * scale * density));
      const glintCount = Math.max(1, Math.round(counts.glint * scale * density));
      const starCount = dustCount + brightCount + glintCount;

      const positions = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);
      const starColors = new Float32Array(starCount * 3);
      const baseIntensities = new Float32Array(starCount);
      const twinkles = new Float32Array(starCount * 2);
      const drifts = new Float32Array(starCount * 4);

      for (let index = 0; index < starCount; index++) {
        const isUpperRight = hashSeed(index, 15) < distribution.upperRightShare;
        const x = isUpperRight
          ? distribution.upperRightStartX +
            hashSeed(index, 19) * (1 - distribution.upperRightStartX)
          : hashSeed(index, 11);
        const seedY = hashSeed(index, 12);
        const y = isUpperRight
          ? distribution.upperRightTopY + seedY * distribution.upperRightHeight
          : seedY;

        positions.set([x * width, y * height, -800], index * 3);

        const tier = getStarTier({ index, dustCount, brightCount });
        const isWarm = tier !== 'glint' && hashSeed(index, 26) < STAR_TUNING.warmth;

        sizes[index] = sampleRange(size[tier], hashSeed(index, 13)) * STAR_TUNING.size;

        const baseIntensity = sampleRange(brightness[tier], hashSeed(index, 14));
        const dimmed = isBehindContent({ x, y })
          ? baseIntensity * distribution.contentDim
          : baseIntensity;
        baseIntensities[index] = dimmed * STAR_TUNING.brightness;

        const twinkleRate =
          hashSeed(index, 16) < STAR_TUNING.twinkle
            ? sampleRange(STAR_FIELD.twinkle.cyclesPerSecond, hashSeed(index, 17))
            : 0;
        twinkles.set([twinkleRate, hashSeed(index, 18)], index * 2);

        drifts.set(
          [
            sampleRange(STAR_FIELD.drift.pixelsPerSecond, hashSeed(index, 23)),
            sampleRange(STAR_FIELD.drift.verticalAmplitudePixels, hashSeed(index, 24)),
            sampleRange(STAR_FIELD.drift.verticalWavelengthPixels, hashSeed(index, 25)),
            hashSeed(index, 22) * Math.PI * 2,
          ],
          index * 4,
        );

        starColors.set(getStarColor({ tier, isWarm, blueSeed: hashSeed(index, 21) }), index * 3);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));
      geometry.setAttribute('aBaseIntensity', new THREE.BufferAttribute(baseIntensities, 1));
      geometry.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkles, 2));
      geometry.setAttribute('aDrift', new THREE.BufferAttribute(drifts, 4));

      material.uniforms.uSpan.value = width + STAR_FIELD.drift.wrapMarginPixels * 2;

      mesh = new THREE.Points(geometry, material);
      mesh.renderOrder = -1;
      scene.add(mesh);
    };

    const tick = (timeMs: number) => {
      frame = window.requestAnimationFrame(tick);

      const sinceLastDraw = timeMs - lastTimeMs;

      if (lastTimeMs && sinceLastDraw < FRAME_INTERVAL_MS) {
        return;
      }

      elapsedSeconds =
        (elapsedSeconds + (lastTimeMs ? Math.min(sinceLastDraw / 1000, MAX_STEP_SECONDS) : 0)) %
        TIME_WRAP_SECONDS;
      lastTimeMs = timeMs;
      material.uniforms.uTime.value = elapsedSeconds;
      renderer.render(scene, camera);
    };

    const syncLoop = () => {
      const shouldAnimate = isVisible && !document.hidden && document.hasFocus();

      if (shouldAnimate && !frame) {
        lastTimeMs = 0;
        frame = window.requestAnimationFrame(tick);
        return;
      }

      if (!shouldAnimate && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const syncMotion = () => {
      material.uniforms.uMotion.value = motionQuery.matches ? 0 : 1;
      renderer.render(scene, camera);
    };

    const resize = () => {
      width = Math.max(mount.clientWidth, 1);
      height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.left = 0;
      camera.right = width;
      camera.top = 0;
      camera.bottom = height;
      camera.updateProjectionMatrix();
      buildStars();
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const intersectionObserver = new IntersectionObserver(entries => {
      isVisible = entries[0]?.isIntersecting ?? false;
      syncLoop();
    });
    intersectionObserver.observe(mount);

    document.addEventListener('visibilitychange', syncLoop);
    window.addEventListener('focus', syncLoop);
    window.addEventListener('blur', syncLoop);
    motionQuery.addEventListener('change', syncMotion);

    resize();
    syncLoop();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', syncLoop);
      window.removeEventListener('focus', syncLoop);
      window.removeEventListener('blur', syncLoop);
      motionQuery.removeEventListener('change', syncMotion);
      mesh?.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="venus-starfield__canvas" />;
};
