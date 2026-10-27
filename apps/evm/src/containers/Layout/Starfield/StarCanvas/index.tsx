import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STAR_FIELD, STAR_TUNING } from '../constants';
import { getStarColor } from '../getStarColor';
import { getStarTier } from '../getStarTier';
import { hashSeed } from '../hashSeed';
import { isBehindContent } from '../isBehindContent';
import { sampleRange } from '../sampleRange';

const VERTEX_SHADER = `
  attribute float aSize;
  attribute float aIntensity;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  varying float vIntensity;
  varying vec3 vColor;

  void main() {
    vIntensity = aIntensity;
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearAlpha(0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, 0.1, 2000);
    camera.position.z = 1000;

    const material = new THREE.ShaderMaterial({
      uniforms: { uPixelRatio: { value: pixelRatio } },
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
    let intensities = new Float32Array(0);
    let baseIntensities = new Float32Array(0);
    let twinkleRates = new Float32Array(0);
    let twinklePhases = new Float32Array(0);
    let basePositions = new Float32Array(0);
    let driftPhases = new Float32Array(0);
    let driftVelocities = new Float32Array(0);
    let verticalAmplitudes = new Float32Array(0);
    let verticalWavelengths = new Float32Array(0);
    let travel = new Float32Array(0);
    let elapsedSeconds = 0;
    let lastFrameSeconds = 0;
    let lastTimeMs = 0;
    let frame = 0;
    let isVisible = false;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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
      intensities = new Float32Array(starCount);
      baseIntensities = new Float32Array(starCount);
      twinkleRates = new Float32Array(starCount);
      twinklePhases = new Float32Array(starCount);
      driftPhases = new Float32Array(starCount);
      driftVelocities = new Float32Array(starCount);
      verticalAmplitudes = new Float32Array(starCount);
      verticalWavelengths = new Float32Array(starCount);
      travel = new Float32Array(starCount);

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
        const intensity = dimmed * STAR_TUNING.brightness;

        intensities[index] = intensity;
        baseIntensities[index] = intensity;
        twinkleRates[index] =
          hashSeed(index, 16) < STAR_TUNING.twinkle
            ? sampleRange(STAR_FIELD.twinkle.cyclesPerSecond, hashSeed(index, 17))
            : 0;
        twinklePhases[index] = hashSeed(index, 18);
        driftPhases[index] = hashSeed(index, 22) * Math.PI * 2;
        driftVelocities[index] = sampleRange(STAR_FIELD.drift.pixelsPerSecond, hashSeed(index, 23));
        verticalAmplitudes[index] = sampleRange(
          STAR_FIELD.drift.verticalAmplitudePixels,
          hashSeed(index, 24),
        );
        verticalWavelengths[index] = sampleRange(
          STAR_FIELD.drift.verticalWavelengthPixels,
          hashSeed(index, 25),
        );

        starColors.set(getStarColor({ tier, isWarm, blueSeed: hashSeed(index, 21) }), index * 3);
      }

      basePositions = new Float32Array(positions);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensities, 1));
      geometry.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));

      mesh = new THREE.Points(geometry, material);
      mesh.renderOrder = -1;
      scene.add(mesh);
    };

    const updateStars = () => {
      if (!mesh) {
        return;
      }

      const { minimumBrightness } = STAR_FIELD.twinkle;
      const midpoint = (1 + minimumBrightness) / 2;
      const amplitude = (1 - minimumBrightness) / 2;

      for (let index = 0; index < intensities.length; index++) {
        const rate = twinkleRates[index];
        intensities[index] =
          rate && !motionQuery.matches
            ? baseIntensities[index] *
              (midpoint +
                amplitude * Math.sin((elapsedSeconds * rate + twinklePhases[index]) * Math.PI * 2))
            : baseIntensities[index];
      }

      mesh.geometry.attributes.aIntensity.needsUpdate = true;

      if (motionQuery.matches) {
        return;
      }

      const positions = mesh.geometry.attributes.position.array as Float32Array;
      const margin = STAR_FIELD.drift.wrapMarginPixels;
      const span = width + margin * 2;

      for (let index = 0; index < intensities.length; index++) {
        travel[index] =
          (travel[index] + lastFrameSeconds * driftVelocities[index] * STAR_TUNING.drift) % span;
        const distance = travel[index];
        positions[index * 3] = ((basePositions[index * 3] + distance + margin) % span) - margin;
        positions[index * 3 + 1] =
          basePositions[index * 3 + 1] +
          verticalAmplitudes[index] *
            (Math.sin((distance / verticalWavelengths[index]) * Math.PI * 2 + driftPhases[index]) -
              Math.sin(driftPhases[index]));
      }

      mesh.geometry.attributes.position.needsUpdate = true;
    };

    const tick = (timeMs: number) => {
      frame = window.requestAnimationFrame(tick);
      lastFrameSeconds = lastTimeMs ? Math.min((timeMs - lastTimeMs) / 1000, 0.05) : 0;
      lastTimeMs = timeMs;
      elapsedSeconds += lastFrameSeconds;
      updateStars();
      renderer.render(scene, camera);
    };

    const syncLoop = () => {
      const shouldAnimate = isVisible && !document.hidden;

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
    motionQuery.addEventListener('change', syncLoop);

    resize();
    syncLoop();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', syncLoop);
      motionQuery.removeEventListener('change', syncLoop);
      mesh?.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="venus-starfield__canvas" />;
};
