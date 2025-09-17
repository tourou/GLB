import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
}

const disposeObject = (object: THREE.Object3D) => {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const geometry = mesh.geometry as THREE.BufferGeometry | undefined;
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;

    if (geometry) {
      geometry.dispose();
    }

    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else if (material) {
      material.dispose();
    }
  });
};

export const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.set(3, 2, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const initialWidth = container.clientWidth || 600;
    const initialHeight = container.clientHeight || 400;
    renderer.setSize(initialWidth, initialHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 100;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(-6, 4, -6);
    scene.add(rimLight);

    const grid = new THREE.GridHelper(10, 10, 0x334155, 0x334155);
    grid.position.y = -1;
    const gridMaterial = grid.material;
    if (Array.isArray(gridMaterial)) {
      gridMaterial.forEach((material) => {
        material.transparent = true;
        material.opacity = 0.15;
      });
    } else {
      gridMaterial.transparent = true;
      gridMaterial.opacity = 0.15;
    }
    scene.add(grid);

    let currentModel: THREE.Object3D | null = null;
    const loader = new GLTFLoader();

    const fitCameraToObject = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
      cameraDistance *= 1.5;

      const direction = new THREE.Vector3(1.2, 0.9, 1).normalize();
      const newPosition = center.clone().addScaledVector(direction, cameraDistance);
      camera.position.copy(newPosition);

      camera.near = maxDim / 100;
      camera.far = maxDim * 100;
      camera.updateProjectionMatrix();

      controls.target.copy(center);
      controls.update();

      grid.position.y = box.min.y;
    };

    loader.load(
      modelUrl,
      (gltf) => {
        if (!isMounted) return;
        currentModel = gltf.scene;
        scene.add(gltf.scene);
        fitCameraToObject(gltf.scene);
        setIsLoading(false);
        setError(null);
      },
      undefined,
      (err) => {
        if (!isMounted) return;
        console.error('Failed to load model:', err);
        setError('モデルの読み込みに失敗しました');
        setIsLoading(false);
      }
    );

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          const { width, height } = entry.contentRect;
          if (height > 0 && width > 0) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
          }
        }
      }
    });

    resizeObserver.observe(container);

    let animationFrameId: number;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      if (currentModel) {
        scene.remove(currentModel);
        disposeObject(currentModel);
      }
      scene.remove(grid);
      disposeObject(grid);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [modelUrl]);

  return (
    <div className={clsx('relative h-72 w-full overflow-hidden rounded-xl', className)}>
      <div ref={containerRef} className="absolute inset-0" />
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 text-slate-200 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
          <p className="mt-3 text-sm">モデルを読み込み中...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 px-4 text-center text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
