import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { locales } from '../locales';

// Allow A-Frame elements in JSX
// FIX: The previous global declaration for A-Frame elements was not being correctly
// interpreted by TypeScript. This more specific declaration extends React's base
// HTML attributes and allows for any custom A-Frame component attributes,
// resolving the "does not exist on type 'JSX.IntrinsicElements'" errors.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-sky': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-camera': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-cursor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-plane': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-text': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-animation': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
    }
  }
}

interface VRModeScreenProps {
  onBack: () => void;
  language: Language;
}

type ModelStatus = 'idle' | 'loading' | 'loaded' | 'error';

const VRModeScreen: React.FC<VRModeScreenProps> = ({ onBack, language }) => {
  const t = locales[language];
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const sceneRef = useRef<any>(null);
  const modelEntityRef = useRef<any>(null);

  // Auto-start loading the model when the component mounts
  useEffect(() => {
    setModelStatus('loading');
  }, []);

  // Effect for model-specific events (loaded/error)
  useEffect(() => {
    const modelEl = modelEntityRef.current;
    if (!modelEl) return;

    const handleLoaded = () => setModelStatus('loaded');
    
    const handleError = (evt: any) => {
      console.error('A-Frame model error event:', evt);
      
      let specificError = 'An unknown loading error occurred.';
      const detail = evt.detail;

      if (detail) {
        if (typeof detail === 'object' && detail !== null) {
          // Manually format the object to avoid "[object Object]" and handle complex structures gracefully.
          specificError = Object.entries(detail)
            .map(([key, value]) => {
              let valueStr;
              // Avoid trying to display nested objects in the VR view.
              if (typeof value === 'object' && value !== null) {
                valueStr = '[Object]';
              } else {
                valueStr = String(value);
              }
              return `${key}: ${valueStr}`;
            })
            .join('\n'); // Use newline for better formatting in a-text.
        } else {
          // Handle cases where detail is a string or other primitive.
          specificError = String(detail);
        }
      }
      
      const userFriendlyError = `${t.vrModeError}\n\nDetails:\n${specificError}`;
      setError(userFriendlyError);
      setModelStatus('error');
    };
    
    if (modelEl.object3DMap.gltf) {
      handleLoaded();
    } else {
      modelEl.addEventListener('model-loaded', handleLoaded, { once: true });
    }
    modelEl.addEventListener('model-error', handleError, { once: true });

    return () => {
      modelEl.removeEventListener('model-loaded', handleLoaded);
      modelEl.removeEventListener('model-error', handleError);
    };
  }, [t.vrModeError]);
  
  const handleBack = () => {
    const sceneEl = document.querySelector('a-scene') as any;
    if (sceneEl && sceneEl.is('vr-mode')) {
      sceneEl.exitVR();
    }
    onBack();
  };
  
  const modelUrl = "https://antoniomoneo.github.io/Datasets/objects/climate-skeleton.glb";

  return (
    <div className="fixed inset-0 bg-black text-white w-full h-full">
      <a-scene
        ref={sceneRef}
        vr-mode-ui="enabled: true;" 
        renderer="colorManagement: true; physicallyCorrectLights: true;"
        background="color: #111827"
        shadow="type: pcfsoft"
      >
        {/* Environment & Lighting */}
        <a-entity light="type: ambient; intensity: 1.5"></a-entity>
        <a-entity light="type: point; intensity: 2; castShadow: true" position="2 4 4"></a-entity>
        <a-sky color="#111827"></a-sky>

        {/* Camera Rig with Teleport and Orbit controls */}
        <a-entity id="cameraRig" position="0 1.6 4">
          <a-camera 
            id="camera" 
            look-controls-enabled="true"
            orbit-controls="target: #skeleton-model; enableDamping: true; dampingFactor: 0.125; rotateSpeed:0.25; minDistance: 1; maxDistance: 10;"
          >
            <a-cursor color="#FFF"></a-cursor>
          </a-camera>
          <a-entity oculus-touch-controls="hand: left"></a-entity>
          <a-entity
            oculus-touch-controls="hand: right"
            laser-controls="hand: right"
            raycaster="objects: .teleport-destination;"
            teleport-controls="cameraRig: #cameraRig; teleportOrigin: #camera; button: trigger; collisionEntities: .teleport-destination;"
          ></a-entity>
        </a-entity>
        
        {/* Sculpture Model */}
        <a-entity
          ref={modelEntityRef}
          id="skeleton-model"
          gltf-model={`url(${modelUrl})`}
          crossorigin="anonymous"
          position="0 0.8 0"
          scale="1 1 1"
          rotation="-90 0 0"
          shadow="cast: true"
          visible={modelStatus === 'loaded'}
        >
          <a-animation attribute="rotation" to="-90 360 0" dur="30000" easing="linear" repeat="indefinite"></a-animation>
        </a-entity>
        
        {/* Floor for teleportation and shadow */}
        <a-plane
          className="teleport-destination"
          rotation="-90 0 0"
          width="20"
          height="20"
          color="#1f2937"
          shadow="receive: true"
        ></a-plane>

        {/* Loading / Error Feedback in Scene */}
        {(modelStatus === 'loading' || modelStatus === 'idle') && (
          <a-entity position="0 1.5 -1">
            <a-text value={t.vrModeLoading} align="center" color="white" width="4"></a-text>
          </a-entity>
        )}
        
        {modelStatus === 'error' && (
          <a-entity position="0 1.5 -1">
            <a-text value={error || ''} align="center" color="#f87171" width="4"></a-text>
          </a-entity>
        )}
      </a-scene>
      
      {/* HTML UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start">
        <button onClick={handleBack} className="bg-gray-800/50 hover:bg-gray-700/70 text-white font-bold py-2 px-4 rounded-lg transition-colors pointer-events-auto">
          {t.vrModeBackToHub}
        </button>
        <div className="text-center pointer-events-none">
          <h1 className="text-2xl font-bold font-title drop-shadow-lg">{t.appHubVRTitle}</h1>
          <p className="text-sm opacity-90 drop-shadow-md">{t.vrModeInstruction}</p>
        </div>
        <button 
          onClick={() => sceneRef.current?.enterVR()}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed pointer-events-auto"
          disabled={modelStatus !== 'loaded'}
        >
          {modelStatus === 'loaded' ? t.vrModeEnterVR : t.vrModeLoading}
        </button>
      </div>
    </div>
  );
};

export default VRModeScreen;