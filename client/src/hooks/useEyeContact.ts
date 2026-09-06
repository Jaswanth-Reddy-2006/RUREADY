import { useEffect, useRef } from 'react';

/**
 * Browser-native eye-contact estimator (no third-party services).
 * Uses FaceDetector when available; otherwise falls back to camera + focus heuristics.
 */
export function useEyeContact(
  stream: MediaStream | null,
  isCameraOn: boolean,
  onSample: (score: number) => void,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!stream || !isCameraOn || typeof window === 'undefined') return;

    let cancelled = false;
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.srcObject = stream;
    videoRef.current = video;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let faceDetector: any = null;
    if ('FaceDetector' in window) {
      try {
        // Browser-native FaceDetector (Chrome/Edge) — no external services
        faceDetector = new (window as unknown as { FaceDetector: new (opts: object) => unknown }).FaceDetector({
          maxDetectedFaces: 1,
          fastMode: true,
        });
      } catch {
        faceDetector = null;
      }
    }

    const started = video.play().catch(() => undefined);

    intervalRef.current = setInterval(async () => {
      if (cancelled) return;
      await started;
      if (cancelled) return;
      if (document.hidden) {
        onSample(35);
        return;
      }

      if (faceDetector && video.readyState >= 2) {
        try {
          const faces = await faceDetector.detect(video);
          if (faces.length === 0) {
            onSample(40);
            return;
          }
          const box = faces[0].boundingBox;
          const vw = video.videoWidth || 640;
          const vh = video.videoHeight || 480;
          const cx = box.x + box.width / 2;
          const cy = box.y + box.height / 2;
          const dx = Math.abs(cx - vw / 2) / (vw / 2);
          const dy = Math.abs(cy - vh / 2) / (vh / 2);
          const offset = Math.sqrt(dx * dx + dy * dy);
          const score = Math.round(Math.max(45, 100 - offset * 55));
          onSample(score);
          return;
        } catch {
          // fall through
        }
      }

      onSample(video.readyState >= 2 ? 72 : 50);
    }, 2000);

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      video.srcObject = null;
      videoRef.current = null;
    };
  }, [stream, isCameraOn, onSample]);
}
