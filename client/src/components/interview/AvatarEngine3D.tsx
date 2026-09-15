// ═══════════════════════════════════════════════════════════════
// R U Ready? — Three.js WebGL 3D AI Interviewer Avatar Engine
// Full 3D Character Mesh Loader (.GLB / Ready Player Me / Custom Asset)
// ARKit 52 Morph Targets, Oculus 15 Visemes, Studio PBR Lighting, Eye Contact
// ═══════════════════════════════════════════════════════════════

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  OculusViseme,
  ARKitBlendshapes,
  DEFAULT_ARKIT_BLENDSHAPES,
  OCULUS_VISEME_WEIGHTS,
  lerpBlendshapes,
} from './visemeMapper';

export type AvatarPersona = 'ETHAN' | 'AVA';
export type AvatarState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'REACTING';

export type FacialExpression =
  | 'NEUTRAL'
  | 'CURIOUS'
  | 'INTERESTED'
  | 'THINKING'
  | 'ENCOURAGING'
  | 'IMPRESSED'
  | 'CONCERNED'
  | 'FOCUSED'
  | 'ACKNOWLEDGING';

export interface AvatarEngine3DProps {
  persona?: AvatarPersona;
  state?: AvatarState;
  expression?: FacialExpression;
  speakingVolume?: number; // 0 to 100
  activeVisemeShape?: OculusViseme;
  subtitleText?: string;
  onPersonaChange?: (newPersona: AvatarPersona) => void;
  className?: string;
}

// Default high-detail 3D female avatar GLB with ARKit & Oculus morph targets
const DEFAULT_3D_MODEL_URL = 'https://models.readyplayer.me/64bfa15f0e72c63d7e3934a6.glb?morphTargets=ARKit,Oculus+Visemes';

// Rich multidimensional expression blendshape configurations
const EXPRESSION_BLENDSHAPES: Record<FacialExpression, Partial<ARKitBlendshapes>> = {
  NEUTRAL: { 
    browInnerUp: 0.05, 
    mouthSmileLeft: 0.15, 
    mouthSmileRight: 0.15,
    cheekSquintLeft: 0.05,
    cheekSquintRight: 0.05,
  },
  CURIOUS: { 
    browInnerUp: 0.35, 
    browOuterUpLeft: 0.25,
    browOuterUpRight: 0.15,
    eyeWideLeft: 0.1,
    eyeWideRight: 0.1,
    mouthSmileLeft: 0.25, 
    mouthSmileRight: 0.25,
    mouthDimpleLeft: 0.15,
    mouthDimpleRight: 0.15,
  },
  INTERESTED: { 
    browInnerUp: 0.28, 
    browOuterUpLeft: 0.18,
    browOuterUpRight: 0.18,
    eyeWideLeft: 0.15,
    eyeWideRight: 0.15,
    mouthSmileLeft: 0.38, 
    mouthSmileRight: 0.38,
    cheekSquintLeft: 0.2,
    cheekSquintRight: 0.2,
  },
  THINKING: { 
    browInnerUp: 0.35, 
    browOuterUpLeft: 0.4,
    browDownRight: 0.2,
    mouthPucker: 0.18,
    mouthSmileLeft: 0.05, 
    mouthSmileRight: 0.05,
    eyeLookUpRight: 0.35,
    eyeLookOutRight: 0.25,
  },
  ENCOURAGING: { 
    browInnerUp: 0.25, 
    mouthSmileLeft: 0.62, 
    mouthSmileRight: 0.62,
    cheekSquintLeft: 0.45,
    cheekSquintRight: 0.45,
    eyeSquintLeft: 0.2,
    eyeSquintRight: 0.2,
    mouthDimpleLeft: 0.3,
    mouthDimpleRight: 0.3,
  },
  IMPRESSED: { 
    browInnerUp: 0.55, 
    browOuterUpLeft: 0.35,
    browOuterUpRight: 0.35,
    eyeWideLeft: 0.25,
    eyeWideRight: 0.25,
    mouthSmileLeft: 0.55, 
    mouthSmileRight: 0.55,
    cheekSquintLeft: 0.35,
    cheekSquintRight: 0.35,
  },
  CONCERNED: { 
    browInnerUp: 0.65, 
    browDownLeft: 0.35,
    browDownRight: 0.35,
    mouthFrownLeft: 0.25, 
    mouthFrownRight: 0.25,
    mouthSmileLeft: 0,
    mouthSmileRight: 0,
  },
  FOCUSED: { 
    browInnerUp: 0.15, 
    browDownLeft: 0.22,
    browDownRight: 0.22,
    eyeSquintLeft: 0.25,
    eyeSquintRight: 0.25,
    mouthSmileLeft: 0.1, 
    mouthSmileRight: 0.1,
  },
  ACKNOWLEDGING: { 
    browInnerUp: 0.25, 
    browOuterUpLeft: 0.15,
    browOuterUpRight: 0.15,
    mouthSmileLeft: 0.4, 
    mouthSmileRight: 0.4,
    cheekSquintLeft: 0.25,
    cheekSquintRight: 0.25,
    mouthDimpleLeft: 0.2,
    mouthDimpleRight: 0.2,
  },
};

export default function AvatarEngine3D({
  persona = 'AVA',
  state = 'IDLE',
  expression = 'NEUTRAL',
  speakingVolume = 0,
  activeVisemeShape,
  subtitleText = '',
  onPersonaChange,
  className = '',
}: AvatarEngine3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelAssetLoaded, setModelAssetLoaded] = useState(false);
  const isDebugEnabled = import.meta.env.VITE_ENABLE_AVATAR_DEBUG === 'true';

  // Synchronize dynamic reactive props with refs so Three.js render loop consumes them without re-mounting
  const stateRef = useRef(state);
  const expressionRef = useRef(expression);
  const volumeRef = useRef(speakingVolume);
  const activeVisemeRef = useRef(activeVisemeShape);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { expressionRef.current = expression; }, [expression]);
  useEffect(() => { volumeRef.current = speakingVolume; }, [speakingVolume]);
  useEffect(() => { activeVisemeRef.current = activeVisemeShape; }, [activeVisemeShape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ─── 1. THREE.JS WEBGL SCENE SETUP ───
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080d1a');

    const width = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 480;

    // Portrait interview framing (close-up framing for webcam-style video tile)
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
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // ─── 2. STUDIO PBR LIGHTING RIG ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    // Warm Key Light (flattering skin tone)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(1.2, 1.8, 1.6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Soft Cool Fill Light
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.3);
    fillLight.position.set(-1.4, 1.2, 1.4);
    scene.add(fillLight);

    // Crisp Studio Rim / Hair Light (hair separation)
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 2.4);
    rimLight.position.set(0, 2.0, -1.5);
    scene.add(rimLight);

    // Studio Backlight
    const bgLight = new THREE.PointLight(0x3b82f6, 1.5, 4);
    bgLight.position.set(0, 0, -0.8);
    scene.add(bgLight);

    // ─── 3. 3D CHARACTER MESH RIG ───
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Initial procedural 3D model (always renders 3D immediately so canvas is never blank)
    const placeholderGroup = new THREE.Group();
    
    // Head sculpt
    const headGeo = new THREE.SphereGeometry(0.105, 32, 32);
    headGeo.scale(1, 1.25, 1.05);
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf5d0b5,
      roughness: 0.55,
      metalness: 0.05,
    });
    const headMeshPlaceholder = new THREE.Mesh(headGeo, skinMat);
    headMeshPlaceholder.position.set(0, 0.03, 0);
    placeholderGroup.add(headMeshPlaceholder);

    // Hair sculpt
    const hairGeo = new THREE.SphereGeometry(0.115, 24, 24);
    hairGeo.scale(1.05, 1.18, 1.15);
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1f1916,
      roughness: 0.8,
    });
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.07, -0.02);
    placeholderGroup.add(hairMesh);

    // Shoulders Bust
    const torsoGeo = new THREE.CylinderGeometry(0.06, 0.22, 0.28, 24);
    const clothMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
    });
    const torsoMesh = new THREE.Mesh(torsoGeo, clothMat);
    torsoMesh.position.set(0, -0.17, 0);
    placeholderGroup.add(torsoMesh);

    // Stylized eyes
    const eyeWhiteGeo = new THREE.SphereGeometry(0.016, 16, 16);
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const eyePupilGeo = new THREE.SphereGeometry(0.008, 16, 16);
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a });

    const leftEyeHolder = new THREE.Group();
    leftEyeHolder.add(new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat));
    const leftPupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    leftPupil.position.set(0, 0, 0.013);
    leftEyeHolder.add(leftPupil);
    leftEyeHolder.position.set(-0.038, 0.05, 0.092);
    placeholderGroup.add(leftEyeHolder);

    const rightEyeHolder = new THREE.Group();
    rightEyeHolder.add(new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat));
    const rightPupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    rightPupil.position.set(0, 0, 0.013);
    rightEyeHolder.add(rightPupil);
    rightEyeHolder.position.set(0.038, 0.05, 0.092);
    placeholderGroup.add(rightEyeHolder);

    avatarGroup.add(placeholderGroup);

    const morphMeshes: THREE.Mesh[] = [];
    let headBone: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;

    const loader = new GLTFLoader();
    const modelUrl = import.meta.env.VITE_AVATAR_3D_MODEL_URL || '/models/interviewer_ava.glb';

    // Primary loader attempt: Local GLB -> Fallback RPM GLB
    const loadModel = (url: string) => {
      loader.load(
        url,
        (gltf) => {
          const loadedModel = gltf.scene;
          
          const targetScale = 0.95;
          loadedModel.scale.set(targetScale, targetScale, targetScale);
          loadedModel.updateMatrixWorld(true);

          // Find head mesh to center portrait framing precisely
          const headMesh = loadedModel.getObjectByName('Wolf3D_Head') || loadedModel.getObjectByName('Head');
          if (headMesh) {
            const headBox = new THREE.Box3().setFromObject(headMesh);
            const headCenter = headBox.getCenter(new THREE.Vector3());
            loadedModel.position.set(-headCenter.x, -headCenter.y + 0.02, -headCenter.z);
          } else {
            loadedModel.position.set(0, -1.48, 0);
          }
          
          // Swap out placeholder mesh for full GLB character model
          avatarGroup.remove(placeholderGroup);
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
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
                morphMeshes.push(mesh);
              }
            }
            if (child.name === 'Head' || child.name === 'Wolf3D_Head' || child.name.toLowerCase().includes('head')) {
              if (!headBone || child.name === 'Head') {
                headBone = child;
              }
            }
          });
        },
        undefined,
        (err) => {
          // If local GLB missing, load Ready Player Me Avatar GLB
          if (url !== DEFAULT_3D_MODEL_URL) {
            loadModel(DEFAULT_3D_MODEL_URL);
          } else {
            console.warn('[AvatarEngine3D] GLB fallback active: procedural 3D WebGL sculpt active:', err);
            setModelAssetLoaded(true);
          }
        }
      );
    };

    loadModel(modelUrl);

    // ─── 4. ANIMATION & MORPH TARGET PHYSICS LOOP ───
    let animationFrameId: number;
    let frame = 0;

    let currentBlendshapes: ARKitBlendshapes = { ...DEFAULT_ARKIT_BLENDSHAPES };
    
    // Lifelike human blinking state
    let blinkProgress = 0;
    let isBlinking = false;
    let isDoubleBlink = false;
    let nextBlinkFrame = 100 + Math.floor(Math.random() * 180);

    // Natural eye saccades (micro eye gaze adjustments)
    let currentLookX = 0;
    let currentLookY = 0;
    let targetLookX = 0;
    let targetLookY = 0;
    let nextSaccadeFrame = 120;

    // Head orientation physics
    let headPitch = 0;
    let headYaw = 0;
    let headRoll = 0;
    let nodVelocity = 0;

    let lastTime = performance.now();

    const animate = () => {
      frame++;
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (mixer) mixer.update(delta);

      const activeState = stateRef.current;
      const activeExpr = expressionRef.current;
      const activeVol = volumeRef.current;
      const currentVisemeProp = activeVisemeRef.current;

      // Determine Target Oculus Viseme
      let activeViseme: OculusViseme = 'viseme_sil';
      if (currentVisemeProp) {
        activeViseme = currentVisemeProp;
      } else if (activeState === 'SPEAKING') {
        const vol = Math.min(1, (activeVol || 0) / 80);
        if (vol > 0.05) {
          const wave = Math.sin(frame * 0.28);
          if (wave > 0.45) activeViseme = 'viseme_aa';
          else if (wave > 0.1) activeViseme = 'viseme_E';
          else if (wave > -0.3) activeViseme = 'viseme_O';
          else activeViseme = 'viseme_SS';
        }
      }

      // Compute Target ARKit Blendshapes
      const visemeTarget = OCULUS_VISEME_WEIGHTS[activeViseme] || {};
      const exprTarget = EXPRESSION_BLENDSHAPES[activeExpr || 'NEUTRAL'] || {};
      const targetBlendshapes: ARKitBlendshapes = {
        ...DEFAULT_ARKIT_BLENDSHAPES,
        ...exprTarget,
        ...visemeTarget,
      };

      currentBlendshapes = lerpBlendshapes(currentBlendshapes, targetBlendshapes, 0.24);

      // ─── BIOPHYSIOLOGICAL BLINKING PHYSICS ───
      let blinkWeight = 0;
      if (frame >= nextBlinkFrame && !isBlinking) {
        isBlinking = true;
        blinkProgress = 0;
      }

      if (isBlinking) {
        // Asymmetric blink: eyelid descends swiftly (~75ms), opens smoothly (~125ms)
        blinkProgress += isDoubleBlink ? 0.24 : 0.17;
        if (blinkProgress >= 1) {
          isBlinking = false;
          blinkProgress = 0;
          if (!isDoubleBlink && Math.random() < 0.22) {
            // 22% probability of natural human double-blink
            isDoubleBlink = true;
            nextBlinkFrame = frame + 6;
          } else {
            isDoubleBlink = false;
            // Next blink in 2.5 to 5.5 seconds (150-330 frames at 60fps)
            nextBlinkFrame = frame + 150 + Math.floor(Math.random() * 180);
          }
        } else {
          // Non-linear eyelid trajectory: peak near mid-cycle
          blinkWeight = Math.sin(Math.pow(blinkProgress, 0.72) * Math.PI);
        }
      }

      // ─── NATURAL EYE GAZE & SACCADES ───
      if (frame >= nextSaccadeFrame) {
        nextSaccadeFrame = frame + 140 + Math.floor(Math.random() * 160);
        if (activeState === 'THINKING') {
          // Pensive upward & lateral eye saccade
          targetLookX = (Math.random() > 0.5 ? 1 : -1) * (0.15 + Math.random() * 0.25);
          targetLookY = 0.22 + Math.random() * 0.18;
        } else if (activeState === 'LISTENING') {
          // Subtle engagement micro-adjustments near candidate's eyes
          targetLookX = (Math.random() - 0.5) * 0.12;
          targetLookY = (Math.random() - 0.5) * 0.08;
        } else {
          // Resting organic eye drift
          targetLookX = (Math.random() - 0.5) * 0.08;
          targetLookY = (Math.random() - 0.5) * 0.06;
        }
      }
      currentLookX = THREE.MathUtils.lerp(currentLookX, targetLookX, 0.12);
      currentLookY = THREE.MathUtils.lerp(currentLookY, targetLookY, 0.12);

      // ─── ACTIVE INTERVIEWER HEAD GESTURES & POSTURE ───
      // Multi-frequency organic breathing
      const breathOffset = Math.sin(frame * 0.032) * 0.0035 + Math.sin(frame * 0.016) * 0.0015;
      let targetPitch = 0;
      let targetRoll = 0.015;
      let targetYaw = 0;

      if (activeState === 'LISTENING') {
        // Empathetic active listening: slight head tilt & responsive affirmative nods
        targetRoll = 0.035 + Math.sin(frame * 0.018) * 0.015;
        targetPitch = 0.02; // Attentive forward pitch
        // Affirmative head nod every 4 to 6 seconds
        if (frame % 280 < 28) {
          nodVelocity = Math.sin(((frame % 280) / 28) * Math.PI * 2) * 0.025;
        }
      } else if (activeState === 'THINKING') {
        // Contemplative head tilt & slight turn
        targetRoll = -0.045;
        targetPitch = -0.025;
        targetYaw = 0.035;
      } else if (activeState === 'SPEAKING') {
        // Natural conversational cadence
        targetPitch = Math.sin(frame * 0.15) * 0.022 + Math.sin(frame * 0.3) * 0.008;
        targetRoll = Math.sin(frame * 0.07) * 0.016;
        targetYaw = Math.sin(frame * 0.05) * 0.012;
      }

      headPitch += (targetPitch + nodVelocity - headPitch) * 0.1;
      headRoll += (targetRoll - headRoll) * 0.05;
      headYaw += (targetYaw - headYaw) * 0.05;
      nodVelocity *= 0.86;

      avatarGroup.position.y = breathOffset;
      avatarGroup.rotation.x = headPitch * 0.7;
      avatarGroup.rotation.y = headYaw * 0.7;
      avatarGroup.rotation.z = headRoll * 0.7;

      // ─── FULL 72-MORPH TARGET DRIVING ON ALL AVATAR MESHES ───
      const oculusVisemeList: OculusViseme[] = [
        'viseme_sil', 'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD',
        'viseme_kk', 'viseme_CH', 'viseme_SS', 'viseme_nn', 'viseme_RR',
        'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U'
      ];

      for (const mesh of morphMeshes) {
        const inf = mesh.morphTargetInfluences;
        const dict = mesh.morphTargetDictionary;
        if (!inf || !dict) continue;

        // ─── 4A. PRECISION OCULUS VISEME LIP SYNC (CALIBRATED & NATURAL) ───
        const hasOculus = dict['viseme_aa'] !== undefined;

        if (hasOculus) {
          // Drive 15 Oculus Visemes with calibrated conversational amplitude (never over-extended)
          for (const v of oculusVisemeList) {
            if (dict[v] !== undefined) {
              // Conversational intensity scaling: human mouth opens moderately (0.55-0.62) during speech
              let maxIntensity = 0.58;
              if (v === 'viseme_aa' || v === 'viseme_O') maxIntensity = 0.52;
              if (v === 'viseme_PP' || v === 'viseme_sil') maxIntensity = 0.70;

              const target = activeViseme === v ? maxIntensity : 0.0;
              inf[dict[v]] = THREE.MathUtils.lerp(inf[dict[v]], target, 0.30);
            }
          }

          // In models with Oculus visemes, phonetic jaw motion is already baked into visemes.
          // We apply only subtle conversational accents and prevent compound mouth drop.
          if (dict['jawOpen'] !== undefined) {
            // Only apply minimal subtle jaw accent if not already wide open from visemes
            inf[dict['jawOpen']] = THREE.MathUtils.clamp(currentBlendshapes.jawOpen * 0.25, 0, 0.12);
          }
          // Do NOT set dict['mouthOpen'] when visemes and jawOpen are active to prevent double-expansion
          if (dict['mouthOpen'] !== undefined) {
            inf[dict['mouthOpen']] = 0;
          }
        } else {
          // Non-Oculus fallback: drive single ARKit jawOpen with strict safety ceiling
          const clampedJaw = THREE.MathUtils.clamp(currentBlendshapes.jawOpen, 0, 0.35);
          if (dict['jawOpen'] !== undefined) inf[dict['jawOpen']] = clampedJaw;
          else if (dict['mouthOpen'] !== undefined) inf[dict['mouthOpen']] = clampedJaw;
        }

        // Subtly blended ARKit Expression & Lip Accents
        if (dict['mouthSmile'] !== undefined) inf[dict['mouthSmile']] = currentBlendshapes.mouthSmileLeft;
        if (dict['mouthSmileLeft'] !== undefined) inf[dict['mouthSmileLeft']] = currentBlendshapes.mouthSmileLeft;
        if (dict['mouthSmileRight'] !== undefined) inf[dict['mouthSmileRight']] = currentBlendshapes.mouthSmileRight;
        if (dict['mouthDimpleLeft'] !== undefined) inf[dict['mouthDimpleLeft']] = currentBlendshapes.mouthDimpleLeft;
        if (dict['mouthDimpleRight'] !== undefined) inf[dict['mouthDimpleRight']] = currentBlendshapes.mouthDimpleRight;
        if (dict['mouthFrownLeft'] !== undefined) inf[dict['mouthFrownLeft']] = currentBlendshapes.mouthFrownLeft;
        if (dict['mouthFrownRight'] !== undefined) inf[dict['mouthFrownRight']] = currentBlendshapes.mouthFrownRight;
        if (dict['tongueOut'] !== undefined) inf[dict['tongueOut']] = currentBlendshapes.tongueOut * 0.5;

        // Duchenne Smile & Cheek Elevation
        if (dict['cheekSquintLeft'] !== undefined) inf[dict['cheekSquintLeft']] = currentBlendshapes.cheekSquintLeft;
        if (dict['cheekSquintRight'] !== undefined) inf[dict['cheekSquintRight']] = currentBlendshapes.cheekSquintRight;

        // Natural Eye Blinking & Squinting
        if (dict['eyeBlinkLeft'] !== undefined) inf[dict['eyeBlinkLeft']] = blinkWeight;
        if (dict['eyeBlinkRight'] !== undefined) inf[dict['eyeBlinkRight']] = blinkWeight;
        if (dict['eyesClosed'] !== undefined) inf[dict['eyesClosed']] = blinkWeight;
        if (dict['eyeSquintLeft'] !== undefined) inf[dict['eyeSquintLeft']] = currentBlendshapes.eyeSquintLeft;
        if (dict['eyeSquintRight'] !== undefined) inf[dict['eyeSquintRight']] = currentBlendshapes.eyeSquintRight;
        if (dict['eyeWideLeft'] !== undefined) inf[dict['eyeWideLeft']] = currentBlendshapes.eyeWideLeft;
        if (dict['eyeWideRight'] !== undefined) inf[dict['eyeWideRight']] = currentBlendshapes.eyeWideRight;

        // Eye Gaze Saccades & Tracking
        const lookRight = Math.max(0, currentLookX);
        const lookLeft = Math.max(0, -currentLookX);
        const lookUp = Math.max(0, currentLookY);
        const lookDown = Math.max(0, -currentLookY);

        if (dict['eyeLookOutLeft'] !== undefined) inf[dict['eyeLookOutLeft']] = lookLeft;
        if (dict['eyeLookInLeft'] !== undefined) inf[dict['eyeLookInLeft']] = lookRight;
        if (dict['eyeLookOutRight'] !== undefined) inf[dict['eyeLookOutRight']] = lookRight;
        if (dict['eyeLookInRight'] !== undefined) inf[dict['eyeLookInRight']] = lookLeft;
        if (dict['eyeLookUpLeft'] !== undefined) inf[dict['eyeLookUpLeft']] = lookUp;
        if (dict['eyeLookUpRight'] !== undefined) inf[dict['eyeLookUpRight']] = lookUp;
        if (dict['eyeLookDownLeft'] !== undefined) inf[dict['eyeLookDownLeft']] = lookDown;
        if (dict['eyeLookDownRight'] !== undefined) inf[dict['eyeLookDownRight']] = lookDown;

        // Brows & Expressions
        if (dict['browInnerUp'] !== undefined) inf[dict['browInnerUp']] = currentBlendshapes.browInnerUp;
        if (dict['browOuterUpLeft'] !== undefined) inf[dict['browOuterUpLeft']] = currentBlendshapes.browOuterUpLeft;
        if (dict['browOuterUpRight'] !== undefined) inf[dict['browOuterUpRight']] = currentBlendshapes.browOuterUpRight;
        if (dict['browDownLeft'] !== undefined) inf[dict['browDownLeft']] = currentBlendshapes.browDownLeft;
        if (dict['browDownRight'] !== undefined) inf[dict['browDownRight']] = currentBlendshapes.browDownRight;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler with ResizeObserver support for fluid container scaling
    let resizeObserver: ResizeObserver | null = null;
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    if (canvas.parentElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0e172e] via-[#090e1c] to-[#04060c] overflow-hidden rounded-2xl border border-white/10 ${className}`}>
      {/* Studio Radial Backdrop Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_38%,rgba(59,130,246,0.18),transparent_65%)]" />

      {/* Three.js WebGL 3D Canvas Container - Direct 3D Model Display */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover relative z-10" 
      />

      {/* Developer Debug Overlay (Hidden in Production) */}
      {isDebugEnabled && (
        <div className="absolute top-3 left-3 z-30 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-[10px] font-mono text-amber-400">
          <span>Three.js 3D WebGL Pipeline | {modelAssetLoaded ? 'Sculpted GLB Avatar Active' : 'Procedural 3D WebGL Model Active'}</span>
        </div>
      )}
    </div>
  );
}
