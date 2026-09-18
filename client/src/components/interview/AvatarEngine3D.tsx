// ═══════════════════════════════════════════════════════════════
// R U Ready? — Three.js WebGL 3D AI Interviewer Avatar Engine
// 3D Character Asset Loader (/models/interviewer_ava.glb)
// ARKit 52 Morph Targets, Oculus 15 Visemes, Studio PBR Lighting
// ═══════════════════════════════════════════════════════════════

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OculusViseme } from './visemeMapper';
import { AvatarController, CharacterState } from './avatar/AvatarController';
import { FacialExpression } from './avatar/FacialController';

export type { FacialExpression };
export type AvatarPersona = 'ETHAN' | 'AVA';
export type AvatarState = CharacterState;

export interface AvatarEngine3DProps {
  persona?: AvatarPersona;
  state?: AvatarState;
  expression?: FacialExpression;
  speakingVolume?: number; // 0 to 100
  activeVisemeShape?: OculusViseme;
  subtitleText?: string;
  onPersonaChange?: (newPersona: AvatarPersona) => void;
  onCaptionWordsUpdate?: (words: { text: string; isSpoken: boolean }[]) => void;
  className?: string;
}

// Authoritative local 3D female avatar GLB asset
const LOCAL_AVATAR_GLB_PATH = '/models/interviewer_ava.glb';

export default function AvatarEngine3D({
  persona = 'AVA',
  state = 'IDLE',
  expression = 'NEUTRAL',
  speakingVolume = 0,
  activeVisemeShape,
  subtitleText = '',
  onPersonaChange,
  onCaptionWordsUpdate,
  className = '',
}: AvatarEngine3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelAssetLoaded, setModelAssetLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Synchronize dynamic reactive props with refs so Three.js render loop consumes them without re-mounting
  const stateRef = useRef(state);
  const expressionRef = useRef(expression);
  const volumeRef = useRef(speakingVolume);
  const activeVisemeRef = useRef(activeVisemeShape);
  const subtitleTextRef = useRef(subtitleText);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { expressionRef.current = expression; }, [expression]);
  useEffect(() => { volumeRef.current = speakingVolume; }, [speakingVolume]);
  useEffect(() => { activeVisemeRef.current = activeVisemeShape; }, [activeVisemeShape]);
  useEffect(() => { subtitleTextRef.current = subtitleText; }, [subtitleText]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Master Avatar Controller
    const avatarController = new AvatarController();

    // ─── 1. THREE.JS WEBGL SCENE & PORTRAIT CAMERA SETUP ───
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080d1a');

    const width = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 480;

    // Portrait interview framing (medium close-up, eye-level framing)
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(0, 0.04, 0.72);
    camera.lookAt(0, 0.01, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // ─── 2. HIGH-FIDELITY STUDIO PBR LIGHTING RIG ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Warm Key Light (Soft facial skin illumination)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
    keyLight.position.set(1.2, 1.6, 1.5);
    scene.add(keyLight);

    // Soft Cool Fill Light (Softens cheek & neck shadows)
    const fillLight = new THREE.DirectionalLight(0xfff0e6, 1.4);
    fillLight.position.set(-1.4, 1.2, 1.4);
    scene.add(fillLight);

    // Studio Hair Rim Light (Creates beautiful halo outline around hair & shoulders)
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 2.4);
    rimLight.position.set(0, 2.2, -1.5);
    scene.add(rimLight);

    // Soft Studio Backlight Glow
    const bgLight = new THREE.PointLight(0x3b82f6, 1.5, 4);
    bgLight.position.set(0, 0, -0.8);
    scene.add(bgLight);

    // ─── 3. 3D CHARACTER ASSET GROUP (AUTHORITATIVE GLB MODEL) ───
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    const morphMeshes: THREE.Mesh[] = [];
    let mixer: THREE.AnimationMixer | null = null;

    const loader = new GLTFLoader();
    const modelUrl = import.meta.env.VITE_AVATAR_3D_MODEL_URL || LOCAL_AVATAR_GLB_PATH;

    loader.load(
      modelUrl,
      (gltf) => {
        const loadedModel = gltf.scene;

        const targetScale = 0.95;
        loadedModel.scale.set(targetScale, targetScale, targetScale);
        loadedModel.updateMatrixWorld(true);

        // Frame portrait camera using character head bounding box
        const headMesh = loadedModel.getObjectByName('Wolf3D_Head') || loadedModel.getObjectByName('Head');
        if (headMesh) {
          const headBox = new THREE.Box3().setFromObject(headMesh);
          const headCenter = headBox.getCenter(new THREE.Vector3());
          loadedModel.position.set(-headCenter.x, -headCenter.y + 0.02, -headCenter.z);
        } else {
          loadedModel.position.set(0, -1.48, 0);
        }

        avatarGroup.add(loadedModel);
        setModelAssetLoaded(true);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(loadedModel);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const nameLower = mesh.name.toLowerCase();

            // Hide casual eyewear/glasses if present on GLB asset
            if (nameLower.includes('glasses') || nameLower.includes('eyewear') || nameLower.includes('spectacles')) {
              mesh.visible = false;
            }

            // Restyle top outfit into executive dark navy corporate blazer
            if (nameLower.includes('outfit_top') || nameLower.includes('outfit') || nameLower.includes('top') || nameLower.includes('shirt')) {
              if (mesh.material) {
                const suitColor = new THREE.Color(0x1e293b);
                if (Array.isArray(mesh.material)) {
                  mesh.material.forEach((mat) => {
                    if (mat && 'color' in mat) (mat as THREE.MeshStandardMaterial).color = suitColor;
                  });
                } else if ('color' in mesh.material) {
                  (mesh.material as THREE.MeshStandardMaterial).color = suitColor;
                }
              }
            }

            // Register meshes containing facial morph target dictionaries (Wolf3D_Head, Wolf3D_Teeth, EyeLeft, EyeRight)
            if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
              morphMeshes.push(mesh);
            }
          }
        });
      },
      undefined,
      (err) => {
        console.error('[AvatarEngine3D] Error loading 3D avatar GLB asset:', err);
        setLoadError('Unable to load 3D character asset');
      }
    );

    // ─── 4. MODULAR THREE.JS RENDER LOOP ───
    let animationFrameId: number;
    let frame = 0;
    let lastTime = performance.now();

    const animate = () => {
      frame++;
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (mixer) mixer.update(delta);

      // Update state in AvatarController
      avatarController.setState(stateRef.current);
      avatarController.facial.setExpression(expressionRef.current);

      const frameState = avatarController.updateFrame(frame, activeVisemeRef.current);
      const currentBlendshapes = frameState.blendshapes;
      const eyeGaze = frameState.eyeGaze;

      // Emit progressive word caption updates to parent
      if (onCaptionWordsUpdate && frameState.isSpeaking) {
        const captionWords = avatarController.caption.getWords().map((w) => ({
          text: w.text,
          isSpoken: w.isSpoken,
        }));
        onCaptionWordsUpdate(captionWords);
      }

      // Natural interviewer head breathing physics
      const breathOffset = Math.sin(frame * 0.032) * 0.0035;
      avatarGroup.position.y = breathOffset;

      // ─── DRIVE ALL 72 GLB MORPH TARGETS (Wolf3D_Head, Wolf3D_Teeth, EyeLeft, EyeRight) ───
      const oculusVisemeList: OculusViseme[] = [
        'viseme_sil', 'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD',
        'viseme_kk', 'viseme_CH', 'viseme_SS', 'viseme_nn', 'viseme_RR',
        'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U'
      ];

      for (const mesh of morphMeshes) {
        const inf = mesh.morphTargetInfluences;
        const dict = mesh.morphTargetDictionary;
        if (!inf || !dict) continue;

        // Drive 15 Oculus Visemes with smooth attack/release interpolation
        if (dict['viseme_aa'] !== undefined) {
          for (const v of oculusVisemeList) {
            if (dict[v] !== undefined) {
              const maxIntensity = (v === 'viseme_aa' || v === 'viseme_O') ? 0.52 : 0.60;
              const target = frameState.viseme === v ? maxIntensity : 0.0;
              inf[dict[v]] = THREE.MathUtils.lerp(inf[dict[v]], target, 0.30);
            }
          }
        }

        // Biophysiological Blinking
        if (dict['eyeBlinkLeft'] !== undefined) inf[dict['eyeBlinkLeft']] = eyeGaze.blinkWeight;
        if (dict['eyeBlinkRight'] !== undefined) inf[dict['eyeBlinkRight']] = eyeGaze.blinkWeight;

        // Gaze Saccades & Camera Eye Contact
        if (dict['eyeLookInLeft'] !== undefined) inf[dict['eyeLookInLeft']] = Math.max(0, eyeGaze.lookX);
        if (dict['eyeLookOutRight'] !== undefined) inf[dict['eyeLookOutRight']] = Math.max(0, eyeGaze.lookX);
        if (dict['eyeLookUpLeft'] !== undefined) inf[dict['eyeLookUpLeft']] = Math.max(0, eyeGaze.lookY);
        if (dict['eyeLookUpRight'] !== undefined) inf[dict['eyeLookUpRight']] = Math.max(0, eyeGaze.lookY);

        // Expression Blendshapes
        if (dict['browInnerUp'] !== undefined) inf[dict['browInnerUp']] = currentBlendshapes.browInnerUp;
        if (dict['browOuterUpLeft'] !== undefined) inf[dict['browOuterUpLeft']] = currentBlendshapes.browOuterUpLeft;
        if (dict['browOuterUpRight'] !== undefined) inf[dict['browOuterUpRight']] = currentBlendshapes.browOuterUpRight;
        if (dict['mouthSmileLeft'] !== undefined) inf[dict['mouthSmileLeft']] = currentBlendshapes.mouthSmileLeft;
        if (dict['mouthSmileRight'] !== undefined) inf[dict['mouthSmileRight']] = currentBlendshapes.mouthSmileRight;
        if (dict['cheekSquintLeft'] !== undefined) inf[dict['cheekSquintLeft']] = currentBlendshapes.cheekSquintLeft;
        if (dict['cheekSquintRight'] !== undefined) inf[dict['cheekSquintRight']] = currentBlendshapes.cheekSquintRight;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      avatarController.voice.stop();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0e172e] via-[#090e1c] to-[#04060c] overflow-hidden rounded-2xl border border-slate-800 ${className}`}>
      {/* Studio Radial Backdrop Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_38%,rgba(59,130,246,0.18),transparent_65%)]" />

      {/* Loading State Spinner (Clean UI, No Fake Primitive Humans) */}
      {!modelAssetLoaded && !loadError && (
        <div className="absolute z-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-xs font-medium tracking-wide">Loading 3D AI Recruiter...</span>
        </div>
      )}

      {/* Error Fallback Card */}
      {loadError && (
        <div className="absolute z-20 flex flex-col items-center justify-center gap-2 p-4 text-center text-rose-400 bg-slate-950/80 rounded-xl border border-rose-500/30">
          <span className="text-sm font-semibold">3D Model Asset Unavailable</span>
          <span className="text-xs text-slate-400">Please check /models/interviewer_ava.glb</span>
        </div>
      )}

      {/* Three.js WebGL 3D Canvas Container */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover relative z-10" 
      />
    </div>
  );
}
