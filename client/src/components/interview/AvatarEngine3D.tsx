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

// Blendshape target values per expression
const EXPRESSION_BLENDSHAPES: Record<FacialExpression, Partial<ARKitBlendshapes>> = {
  NEUTRAL: { browInnerUp: 0, eyeBlinkLeft: 0, mouthSmileLeft: 0.15, mouthSmileRight: 0.15 },
  CURIOUS: { browInnerUp: 0.35, mouthSmileLeft: 0.25, mouthSmileRight: 0.25 },
  INTERESTED: { browInnerUp: 0.2, mouthSmileLeft: 0.4, mouthSmileRight: 0.4 },
  THINKING: { browInnerUp: 0.5, mouthSmileLeft: 0.05, mouthSmileRight: 0.05, mouthPucker: 0.2 },
  ENCOURAGING: { browInnerUp: 0.25, mouthSmileLeft: 0.55, mouthSmileRight: 0.55 },
  IMPRESSED: { browInnerUp: 0.6, mouthSmileLeft: 0.45, mouthSmileRight: 0.45 },
  CONCERNED: { browInnerUp: 0.6, mouthSmileLeft: 0, mouthSmileRight: 0 },
  FOCUSED: { browInnerUp: 0.1, mouthSmileLeft: 0.1, mouthSmileRight: 0.1 },
  ACKNOWLEDGING: { browInnerUp: 0.2, mouthSmileLeft: 0.35, mouthSmileRight: 0.35 },
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ─── 1. THREE.JS WEBGL SCENE SETUP ───
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#060608');

    const width = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(26, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 1.75);
    camera.lookAt(0, 0.08, 0);

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ─── 2. STUDIO PBR LIGHTING RIG ───
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.95);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff1e0, 1.7);
    keyLight.position.set(1.5, 2.2, 1.8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    fillLight.position.set(-1.8, 1.0, 1.2);
    scene.add(fillLight);

    // Hair Rim Light
    const rimLight = new THREE.DirectionalLight(0xffedd5, 1.9);
    rimLight.position.set(0, 2.2, -1.8);
    scene.add(rimLight);

    // ─── 3. 3D CHARACTER MESH & PROCEDURAL SCULPT RIG ───
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    const morphMeshes: THREE.Mesh[] = [];
    let headBone: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;

    // Procedural 3D WebGL Character Rig (Guarantees 3D Avatar is NEVER black or empty)
    const proceduralHeadGroup = new THREE.Group();

    // 1. PBR Skin Head Mesh
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xE8B896,
      roughness: 0.55,
      metalness: 0.05,
    });
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 32), headMat);
    headMesh.scale.set(1, 1.22, 0.95);
    headMesh.position.set(0, 0.12, 0);
    proceduralHeadGroup.add(headMesh);

    // 2. Eyes (Left & Right)
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x2459A8, roughness: 0.3 }); // Royal Blue Iris
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });

    const createEye = (xSign: number) => {
      const eyeGroup = new THREE.Group();
      const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), eyeWhiteMat);
      eyeGroup.add(eyeWhite);

      const iris = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.01, 16), irisMat);
      iris.rotation.x = Math.PI / 2;
      iris.position.z = 0.038;
      eyeGroup.add(iris);

      const pupil = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.012, 16), pupilMat);
      pupil.rotation.x = Math.PI / 2;
      pupil.position.z = 0.039;
      eyeGroup.add(pupil);

      eyeGroup.position.set(xSign * 0.082, 0.16, 0.19);
      return eyeGroup;
    };

    const leftEye = createEye(-1);
    const rightEye = createEye(1);
    proceduralHeadGroup.add(leftEye);
    proceduralHeadGroup.add(rightEye);

    // Eyelids for physics blinking
    const eyelidMat = new THREE.MeshStandardMaterial({ color: 0xD8A07E, roughness: 0.6 });
    const leftEyelid = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), eyelidMat);
    leftEyelid.position.set(-0.082, 0.16, 0.188);
    leftEyelid.rotation.x = -0.3;
    leftEyelid.scale.y = 0.01; // Blinking scale
    proceduralHeadGroup.add(leftEyelid);

    const rightEyelid = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), eyelidMat);
    rightEyelid.position.set(0.082, 0.16, 0.188);
    rightEyelid.rotation.x = -0.3;
    rightEyelid.scale.y = 0.01;
    proceduralHeadGroup.add(rightEyelid);

    // 3. Eyebrows
    const browMat = new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.8 });
    const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.012, 0.015), browMat);
    leftBrow.position.set(-0.082, 0.22, 0.21);
    leftBrow.rotation.z = -0.05;
    proceduralHeadGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.012, 0.015), browMat);
    rightBrow.position.set(0.082, 0.22, 0.21);
    rightBrow.rotation.z = 0.05;
    proceduralHeadGroup.add(rightBrow);

    // 4. Lip-syncing Mouth Mesh
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xA0006D, roughness: 0.4 }); // Signature Eggplant lip
    const mouthMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.015, 16), mouthMat);
    mouthMesh.rotation.x = Math.PI / 2;
    mouthMesh.position.set(0, 0.04, 0.21);
    proceduralHeadGroup.add(mouthMesh);

    // 5. Hair Sculp Mesh
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x2A1B10, roughness: 0.7 });
    const hairMesh = new THREE.Mesh(new THREE.SphereGeometry(0.255, 24, 24), hairMat);
    hairMesh.scale.set(1.03, 1.1, 1.05);
    hairMesh.position.set(0, 0.16, -0.02);
    proceduralHeadGroup.add(hairMesh);

    // 6. Neck & Corporate Suit Torso
    const neckMat = new THREE.MeshStandardMaterial({ color: 0xDFAB8B, roughness: 0.5 });
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.18, 16), neckMat);
    neckMesh.position.set(0, -0.08, 0);
    avatarGroup.add(neckMesh);

    const suitMat = new THREE.MeshStandardMaterial({ color: 0x11183D, roughness: 0.4 }); // Corporate Dark Blue suit
    const suitMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.36, 0.55, 16), suitMat);
    suitMesh.position.set(0, -0.42, 0);
    avatarGroup.add(suitMesh);

    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
    const shirtMesh = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 4), shirtMat);
    shirtMesh.position.set(0, -0.3, 0.15);
    avatarGroup.add(shirtMesh);

    avatarGroup.add(proceduralHeadGroup);

    const loader = new GLTFLoader();
    const modelUrl = import.meta.env.VITE_AVATAR_3D_MODEL_URL || '/models/interviewer_ava.glb';

    // Primary loader attempt: Local GLB -> Fallback RPM GLB
    const loadModel = (url: string) => {
      loader.load(
        url,
        (gltf) => {
          const loadedModel = gltf.scene;
          loadedModel.position.set(0, -0.62, 0);
          loadedModel.scale.set(0.85, 0.85, 0.85);
          
          // Hide procedural mesh once GLB is verified & loaded
          proceduralHeadGroup.visible = false;
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
            if (child.name.toLowerCase().includes('head') || child.name.toLowerCase().includes('neck')) {
              headBone = child;
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
            setModelAssetLoaded(false);
          }
        }
      );
    };

    loadModel(modelUrl);

    // ─── 4. ANIMATION & MORPH TARGET PHYSICS LOOP ───
    let animationFrameId: number;
    let frame = 0;

    let currentBlendshapes: ARKitBlendshapes = { ...DEFAULT_ARKIT_BLENDSHAPES };
    let blinkProgress = 0;
    let nextBlinkFrame = 120 + Math.random() * 200;

    let headPitch = 0;
    let headYaw = 0;
    let headRoll = 0;
    let nodVelocity = 0;

    const clock = new THREE.Clock();

    const animate = () => {
      frame++;
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      // Determine Target Oculus Viseme
      let activeViseme: OculusViseme = 'viseme_sil';
      if (activeVisemeShape) {
        activeViseme = activeVisemeShape;
      } else if (state === 'SPEAKING') {
        const vol = Math.min(1, speakingVolume / 80);
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
      const exprTarget = EXPRESSION_BLENDSHAPES[expression || 'NEUTRAL'] || {};
      const targetBlendshapes: ARKitBlendshapes = {
        ...DEFAULT_ARKIT_BLENDSHAPES,
        ...exprTarget,
        ...visemeTarget,
      };

      currentBlendshapes = lerpBlendshapes(currentBlendshapes, targetBlendshapes, 0.22);

      // Eye Blinking Physics
      if (frame >= nextBlinkFrame) {
        blinkProgress += 0.25;
        if (blinkProgress >= 1) {
          blinkProgress = 0;
          nextBlinkFrame = frame + 120 + Math.random() * 240;
        }
      }
      const blinkWeight = Math.max(0, Math.sin(blinkProgress * Math.PI));

      // Head Movement & Orientation Physics
      const breathOffset = Math.sin(frame * 0.035) * 0.005;
      let targetPitch = 0;
      let targetRoll = 0.02;

      if (state === 'LISTENING') {
        targetRoll = Math.sin(frame * 0.02) * 0.025 + 0.03;
        if (frame % 360 < 20) nodVelocity = Math.sin((frame % 360) * 0.3) * 0.03;
      } else if (state === 'THINKING') {
        targetRoll = -0.04;
        targetPitch = -0.03;
      } else if (state === 'SPEAKING') {
        targetPitch = Math.sin(frame * 0.16) * 0.018;
        targetRoll = Math.sin(frame * 0.08) * 0.018;
      }

      headPitch += (targetPitch + nodVelocity - headPitch) * 0.1;
      headRoll += (targetRoll - headRoll) * 0.05;
      nodVelocity *= 0.85;

      avatarGroup.position.y = breathOffset;
      if (headBone) {
        headBone.rotation.x = headPitch;
        headBone.rotation.z = headRoll;
      } else {
        avatarGroup.rotation.x = headPitch;
        avatarGroup.rotation.z = headRoll;
      }

      // Drive morph targets on all loaded 3D GLB meshes
      for (const mesh of morphMeshes) {
        const inf = mesh.morphTargetInfluences;
        const dict = mesh.morphTargetDictionary;
        if (!inf || !dict) continue;

        // Oculus Visemes & Jaw Morphs
        if (dict['jawOpen'] !== undefined) inf[dict['jawOpen']] = currentBlendshapes.jawOpen;
        if (dict['mouthFunnel'] !== undefined) inf[dict['mouthFunnel']] = currentBlendshapes.mouthFunnel;
        if (dict['mouthPucker'] !== undefined) inf[dict['mouthPucker']] = currentBlendshapes.mouthPucker;
        if (dict['mouthSmile'] !== undefined) inf[dict['mouthSmile']] = currentBlendshapes.mouthSmileLeft;
        if (dict['mouthSmileLeft'] !== undefined) inf[dict['mouthSmileLeft']] = currentBlendshapes.mouthSmileLeft;
        if (dict['mouthSmileRight'] !== undefined) inf[dict['mouthSmileRight']] = currentBlendshapes.mouthSmileRight;

        // Oculus Viseme Specific Targets
        if (dict['viseme_aa'] !== undefined) inf[dict['viseme_aa']] = activeViseme === 'viseme_aa' ? 1 : 0;
        if (dict['viseme_E'] !== undefined) inf[dict['viseme_E']] = activeViseme === 'viseme_E' ? 1 : 0;
        if (dict['viseme_I'] !== undefined) inf[dict['viseme_I']] = activeViseme === 'viseme_I' ? 1 : 0;
        if (dict['viseme_O'] !== undefined) inf[dict['viseme_O']] = activeViseme === 'viseme_O' ? 1 : 0;
        if (dict['viseme_U'] !== undefined) inf[dict['viseme_U']] = activeViseme === 'viseme_U' ? 1 : 0;
        if (dict['viseme_sil'] !== undefined) inf[dict['viseme_sil']] = activeViseme === 'viseme_sil' ? 1 : 0;

        // Eye Blinking Morphs
        if (dict['eyeBlinkLeft'] !== undefined) inf[dict['eyeBlinkLeft']] = blinkWeight;
        if (dict['eyeBlinkRight'] !== undefined) inf[dict['eyeBlinkRight']] = blinkWeight;
        if (dict['eyesClosed'] !== undefined) inf[dict['eyesClosed']] = blinkWeight;

        // Brows & Expressions
        if (dict['browInnerUp'] !== undefined) inf[dict['browInnerUp']] = currentBlendshapes.browInnerUp;
      }

      // Drive procedural character mesh animations if active
      if (proceduralHeadGroup.visible) {
        leftEyelid.scale.y = blinkWeight * 0.9 + 0.01;
        rightEyelid.scale.y = blinkWeight * 0.9 + 0.01;

        const mouthOpen = currentBlendshapes.jawOpen * 2.5 + (activeViseme !== 'viseme_sil' ? 0.35 : 0.02);
        mouthMesh.scale.set(1 + (currentBlendshapes.mouthFunnel || 0) * 0.3, Math.max(0.08, mouthOpen), 1);

        const browShift = (currentBlendshapes.browInnerUp || 0) * 0.025;
        leftBrow.position.y = 0.22 + browShift;
        rightBrow.position.y = 0.22 + browShift;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [persona, state, expression, speakingVolume, activeVisemeShape]);

  return (
    <div className={`relative w-full h-full min-h-[380px] flex items-center justify-center bg-[#060608] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 ${className}`}>
      {/* Three.js WebGL 3D Canvas Container */}
      <canvas ref={canvasRef} className="w-full h-full object-cover" />

      {/* Developer Debug Overlay (Hidden in Production) */}
      {isDebugEnabled && (
        <div className="absolute top-3 left-3 z-30 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-[10px] font-mono text-amber-400">
          <span>Three.js 3D WebGL Pipeline | {modelAssetLoaded ? 'Sculpted GLB Avatar Loaded' : 'Loading GLB Asset...'}</span>
        </div>
      )}
    </div>
  );
}
