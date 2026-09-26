// ═══════════════════════════════════════════════════════════════
// Rennetus — Three.js WebGL 3D Female Interviewer Avatar Engine
// Precise Head-Lock Bounding & World Translation (Close-up Portrait Face Focus)
// HD PBR Studio Lighting, Dynamic Situational Expressions, Smooth Morph Damping
// ═══════════════════════════════════════════════════════════════

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OculusViseme, OCULUS_VISEME_WEIGHTS } from './visemeMapper';
import { AvatarController, CharacterState } from './avatar/AvatarController';
import { FacialExpression } from './avatar/FacialController';
import { AvatarModelId, getModelAssetPath, PLATFORM_AVATAR_MODELS } from '../../lib/platformConfig';

export type { FacialExpression };
export type AvatarPersona = AvatarModelId;
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

  // Synchronize dynamic reactive props with refs so Three.js render loop consumes them smoothly
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

    setModelAssetLoaded(false);
    setLoadError(null);

    const avatarController = new AvatarController();

    // ─── 1. WEBGL SCENE & CINEMATIC CLOSE-UP PORTRAIT CAMERA ───
    const scene = new THREE.Scene();

    const width = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 480;

    // Portrait Close-up Camera directly framing the full face & upper shoulders
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.05, 50);
    camera.position.set(0, 0.01, 0.65);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ─── 2. HIGH-DEFINITION STUDIO PBR LIGHTING RIG ───
    const ambientLight = new THREE.AmbientLight(0xfffaf6, 1.3);
    scene.add(ambientLight);

    // Warm Key Light (Primary soft facial illumination)
    const keyLight = new THREE.DirectionalLight(0xfff7ee, 2.4);
    keyLight.position.set(0.6, 1.2, 1.4);
    scene.add(keyLight);

    // Cool Fill Light (Softens cheek and neck shadows)
    const fillLight = new THREE.DirectionalLight(0xe8f2ff, 1.4);
    fillLight.position.set(-1.0, 0.8, 1.1);
    scene.add(fillLight);

    // Rim / Hair Halo Light (Creates depth around hair and head outline)
    const rimLight = new THREE.DirectionalLight(0xa5caff, 2.1);
    rimLight.position.set(0, 1.6, -1.2);
    scene.add(rimLight);

    // Warm Chin Bounce Light
    const bounceLight = new THREE.DirectionalLight(0xffe8d6, 0.5);
    bounceLight.position.set(0, -0.8, 0.5);
    scene.add(bounceLight);

    // Eye Catchlight (Makes eyes sparkle with life)
    const eyeLight = new THREE.PointLight(0xffffff, 0.6, 2);
    eyeLight.position.set(0.04, 0.05, 0.5);
    scene.add(eyeLight);

    // ─── 3. 3D CHARACTER ASSET GROUP & HEAD-LOCK POSITIONING ───
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    const morphMeshes: THREE.Mesh[] = [];
    let mixer: THREE.AnimationMixer | null = null;

    const loader = new GLTFLoader();
    const modelUrl = getModelAssetPath(persona);

    loader.load(
      modelUrl,
      (gltf) => {
        const loadedModel = gltf.scene;

        // ─── Detect Mixamo models (cm scale) and normalize to meters ───
        let isMixamo = false;
        loadedModel.traverse((child) => {
          if (child.name && child.name.toLowerCase().startsWith('mixamorig')) {
            isMixamo = true;
          }
        });
        if (isMixamo) {
          loadedModel.scale.set(0.01, 0.01, 0.01);
        } else {
          loadedModel.scale.set(1, 1, 1);
        }

        loadedModel.position.set(0, 0, 0);

        // ─── STEP 1: Add to scene FIRST so world matrices become valid ───
        avatarGroup.add(loadedModel);

        // ─── STEP 2: Force full scene world matrix update AFTER adding to scene ───
        scene.updateMatrixWorld(true);

        // ─── STEP 3: Find Eyes or Head Bone for precise visual face center ───
        let leftEyeObj: THREE.Object3D | null = null;
        let rightEyeObj: THREE.Object3D | null = null;
        let headObj: THREE.Object3D | null = null;

        loadedModel.traverse((child) => {
          if (child.name) {
            if (!leftEyeObj && /^(LeftEye|EyeLeft|eye_L|mixamorigLeftEye)$/i.test(child.name)) {
              leftEyeObj = child;
            }
            if (!rightEyeObj && /^(RightEye|EyeRight|eye_R|mixamorigRightEye)$/i.test(child.name)) {
              rightEyeObj = child;
            }
            if (!headObj && /^(Wolf3D_Head|Head|head|mixamorig:Head|mixamorigHead|CC_Base_Head)$/i.test(child.name)) {
              headObj = child;
            }
          }
        });

        const faceCenter = new THREE.Vector3();

        if (leftEyeObj && rightEyeObj) {
          const lPos = new THREE.Vector3();
          const rPos = new THREE.Vector3();
          (leftEyeObj as THREE.Object3D).getWorldPosition(lPos);
          (rightEyeObj as THREE.Object3D).getWorldPosition(rPos);
          // Face center is midpoint of eyes, shifted slightly down to bridge of nose (-2cm)
          faceCenter.addVectors(lPos, rPos).multiplyScalar(0.5);
          faceCenter.y -= 0.02;
          console.log('[AvatarEngine3D] Eye-locked face center:', faceCenter.toArray());
        } else if (headObj) {
          (headObj as THREE.Object3D).getWorldPosition(faceCenter);
          // Head bone is at neck/chin level, so face center is ~6.5cm higher
          faceCenter.y += 0.065;
          console.log('[AvatarEngine3D] Head bone + offset face center:', faceCenter.toArray());
        } else {
          // Fallback: bounding box upper 90% region
          const box = new THREE.Box3().setFromObject(loadedModel);
          const size = box.getSize(new THREE.Vector3());
          faceCenter.set(
            (box.min.x + box.max.x) / 2,
            box.min.y + size.y * 0.90,
            (box.min.z + box.max.z) / 2
          );
          console.log('[AvatarEngine3D] BBox fallback face center:', faceCenter.toArray());
        }

        // ─── STEP 4: Translate model so face center is at world origin (0,0,0) ───
        loadedModel.position.set(-faceCenter.x, -faceCenter.y, -faceCenter.z);

        // Re-sync matrices after repositioning
        scene.updateMatrixWorld(true);

        setModelAssetLoaded(true);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(loadedModel);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        // HD Materials & Morph Target Collector
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const nameLower = mesh.name.toLowerCase();

            // Hide eyewear
            if (nameLower.includes('glasses') || nameLower.includes('eyewear') || nameLower.includes('spectacles')) {
              mesh.visible = false;
            }

            if (mesh.material) {
              const personaMeta = PLATFORM_AVATAR_MODELS.find((m) => m.id === persona);
              const suitHex = personaMeta?.suitColorHex || 0x162234;

              // Tailored corporate executive blazer & outfit styling
              if (
                nameLower.includes('outfit_top') ||
                nameLower.includes('outfit') ||
                nameLower.includes('top') ||
                nameLower.includes('shirt') ||
                nameLower.includes('body') ||
                nameLower.includes('avaturn_look')
              ) {
                const suitColor = new THREE.Color(suitHex);
                if (Array.isArray(mesh.material)) {
                  mesh.material.forEach((mat) => {
                    if (mat && 'color' in mat) (mat as THREE.MeshStandardMaterial).color = suitColor;
                  });
                } else if ('color' in mesh.material) {
                  (mesh.material as THREE.MeshStandardMaterial).color = suitColor;
                }
              }

              // Ultra-realistic PBR studio skin shader with balanced subsurface scattering feel
              if (nameLower.includes('head') || nameLower.includes('skin') || nameLower.includes('face') || nameLower.includes('avaturn_body')) {
                if (!Array.isArray(mesh.material)) {
                  const mat = mesh.material as THREE.MeshStandardMaterial;
                  mat.roughness = 0.50;
                  mat.metalness = 0.0;
                }
              }
            }

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

    // ─── 4. DYNAMIC SITUATIONAL EXPRESSION RENDER LOOP ───
    let animationFrameId: number;
    let frame = 0;
    let lastTime = performance.now();

    const oculusVisemeList: OculusViseme[] = [
      'viseme_sil', 'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD',
      'viseme_kk', 'viseme_CH', 'viseme_SS', 'viseme_nn', 'viseme_RR',
      'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U'
    ];

    const animate = () => {
      frame++;
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (mixer) mixer.update(delta);

      const currentState = stateRef.current;
      const currentExpr = expressionRef.current;

      avatarController.setState(currentState);
      if (currentExpr && currentExpr !== 'NEUTRAL') {
        avatarController.facial.setExpression(currentExpr);
      }

      const frameState = avatarController.updateFrame(delta, activeVisemeRef.current);
      const currentBlendshapes = frameState.blendshapes;
      const eyeGaze = frameState.eyeGaze;

      // ─── Natural Dynamic Head Movements ───
      const breathPhase = now * 0.001;
      let targetPitch = Math.sin(breathPhase * 0.8) * 0.002;
      let targetYaw = Math.sin(breathPhase * 0.35) * 0.001;
      let targetRoll = Math.sin(breathPhase * 0.25) * 0.002;

      // Situational Reactions:
      if (currentState === 'LISTENING') {
        const nodPhase = (now % 3800) / 3800;
        if (nodPhase < 0.20) {
          targetPitch += Math.sin(nodPhase * Math.PI * 5.0) * 0.016;
        }
        targetRoll += 0.012; // Attentive slight head tilt
      } else if (currentState === 'THINKING') {
        targetPitch -= 0.014;
        targetYaw += 0.020;
        targetRoll -= 0.016;
      } else if (currentState === 'SPEAKING') {
        // Conversational subtle emphasis nods
        const speechCadence = Math.sin(now * 0.006);
        targetPitch += speechCadence * 0.008;
      } else if (currentState === 'REACTING') {
        targetPitch += Math.sin(breathPhase * 4) * 0.014;
      }

      avatarGroup.position.y = Math.sin(breathPhase * 0.8) * 0.0015;
      avatarGroup.position.x = THREE.MathUtils.lerp(avatarGroup.position.x, targetYaw, 0.05);
      avatarGroup.rotation.x = THREE.MathUtils.lerp(avatarGroup.rotation.x, targetPitch, 0.08);
      avatarGroup.rotation.y = THREE.MathUtils.lerp(avatarGroup.rotation.y, targetYaw, 0.08);
      avatarGroup.rotation.z = THREE.MathUtils.lerp(avatarGroup.rotation.z, targetRoll, 0.08);

      // ─── Morph Target Influence Driver ───
      for (const mesh of morphMeshes) {
        const inf = mesh.morphTargetInfluences;
        const dict = mesh.morphTargetDictionary;
        if (!inf || !dict) continue;

        // 1. Oculus Visemes for models having Oculus viseme shapes
        if (dict['viseme_aa'] !== undefined) {
          for (const v of oculusVisemeList) {
            if (dict[v] !== undefined) {
              const maxIntensity = (v === 'viseme_aa' || v === 'viseme_O' || v === 'viseme_E') ? 0.36 : 0.28;
              const target = frameState.viseme === v ? maxIntensity : 0.0;
              const lerpFactor = target > inf[dict[v]] ? 0.38 : 0.22;
              inf[dict[v]] = THREE.MathUtils.lerp(inf[dict[v]], target, lerpFactor);
            }
          }
        }

        // Natural Eyelid Blinking
        if (dict['eyeBlinkLeft'] !== undefined) inf[dict['eyeBlinkLeft']] = eyeGaze.blinkWeight;
        if (dict['eyeBlinkRight'] !== undefined) inf[dict['eyeBlinkRight']] = eyeGaze.blinkWeight;
        if (dict['eyesClosed'] !== undefined && dict['eyeBlinkLeft'] === undefined) {
          inf[dict['eyesClosed']] = eyeGaze.blinkWeight;
        }

        // Eye Contact & Gaze
        let gazeX = eyeGaze.lookX * 0.35;
        let gazeY = eyeGaze.lookY * 0.35;
        if (currentState === 'THINKING') {
          gazeX = 0.12;
          gazeY = 0.10;
        }

        if (dict['eyeLookInLeft'] !== undefined) inf[dict['eyeLookInLeft']] = Math.min(0.20, Math.max(0, gazeX));
        if (dict['eyeLookOutRight'] !== undefined) inf[dict['eyeLookOutRight']] = Math.min(0.20, Math.max(0, gazeX));
        if (dict['eyeLookUpLeft'] !== undefined) inf[dict['eyeLookUpLeft']] = Math.min(0.18, Math.max(0, gazeY));
        if (dict['eyeLookUpRight'] !== undefined) inf[dict['eyeLookUpRight']] = Math.min(0.18, Math.max(0, gazeY));

        // 2. ARKit Blendshapes & Situational Expressions Driver
        const isMouthShape = (name: string) => /^(jawOpen|mouthFunnel|mouthPucker|mouthStretch|mouthLowerDown|mouthUpperUp|mouthPress|mouthRoll|mouthDimple|mouthClose)/.test(name);
        const activeVisemeARKit = (OCULUS_VISEME_WEIGHTS as any)[frameState.viseme] || {};

        for (const [bsName, bsVal] of Object.entries(currentBlendshapes)) {
          if (dict[bsName] !== undefined && typeof bsVal === 'number') {
            let targetVal = bsVal;
            
            // If model does not have native Oculus visemes, inject ARKit viseme weights
            if (dict['viseme_aa'] === undefined && activeVisemeARKit[bsName] !== undefined) {
              targetVal = Math.max(targetVal, activeVisemeARKit[bsName]);
            }

            // Situational enhancements
            if (currentState === 'LISTENING') {
              if (bsName === 'mouthSmileLeft' || bsName === 'mouthSmileRight') targetVal = Math.max(targetVal, 0.14);
              if (bsName === 'browInnerUp') targetVal = Math.max(targetVal, 0.10);
            } else if (currentState === 'THINKING') {
              if (bsName === 'browDownLeft' || bsName === 'browDownRight') targetVal = Math.max(targetVal, 0.08);
              if (bsName === 'mouthSmileLeft' || bsName === 'mouthSmileRight') targetVal = Math.min(targetVal, 0.04);
            } else if (currentState === 'REACTING') {
              if (bsName === 'mouthSmileLeft' || bsName === 'mouthSmileRight') targetVal = Math.max(targetVal, 0.20);
              if (bsName === 'browInnerUp') targetVal = Math.max(targetVal, 0.12);
            } else if (currentState === 'IDLE') {
              if (bsName === 'mouthSmileLeft' || bsName === 'mouthSmileRight') targetVal = Math.max(targetVal, 0.06);
            }

            const maxLimit = isMouthShape(bsName) ? 0.40 : 0.25;
            const clamped = Math.min(maxLimit, Math.max(0, targetVal));
            const lerpSpeed = isMouthShape(bsName) ? 0.32 : 0.18;
            inf[dict[bsName]] = THREE.MathUtils.lerp(inf[dict[bsName]], clamped, lerpSpeed);
          }
        }

        // Idle gentle jaw breathing when silent
        if (dict['jawOpen'] !== undefined && frameState.viseme === 'viseme_sil') {
          inf[dict['jawOpen']] = THREE.MathUtils.lerp(inf[dict['jawOpen']], Math.sin(breathPhase * 0.9) * 0.012, 0.1);
        }
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
      renderer.dispose();
    };
  }, [persona]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl border border-[#1E293B] ${className}`}
         style={{ background: 'linear-gradient(180deg, #0d1527 0%, #090f1d 40%, #050a14 100%)' }}>
      {/* Studio Radial Backdrop Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_35%,rgba(36,89,168,0.22),transparent_65%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_80%,rgba(30,41,59,0.35),transparent_50%)]" />

      {/* Loading State Spinner */}
      {!modelAssetLoaded && !loadError && (
        <div className="absolute z-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-9 h-9 rounded-full border-2 border-[#4A8BDF] border-t-transparent animate-spin" />
          <span className="text-xs font-medium tracking-wide">Loading 3D HD Model...</span>
        </div>
      )}

      {/* Error Fallback Card */}
      {loadError && (
        <div className="absolute z-20 flex flex-col items-center justify-center gap-2 p-4 text-center text-rose-400 bg-slate-950/80 rounded-2xl border border-rose-500/30">
          <span className="text-sm font-semibold">3D Model Asset Unavailable</span>
          <span className="text-xs text-slate-400">Please check model file path</span>
        </div>
      )}

      {/* Three.js WebGL 3D Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover relative z-10" 
      />
    </div>
  );
}
