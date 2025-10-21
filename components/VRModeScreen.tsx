import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Language, AppDefinition } from '../types';
import { locales } from '../locales';

// Allow A-Frame elements in JSX
// The global declaration for JSX.IntrinsicElements was overwriting the default
// React types instead of extending them. This caused errors across the application where standard
// HTML elements like 'div' were not recognized. The fix is to extend React.JSX.IntrinsicElements,
// which merges the A-Frame types with the standard HTML types.
declare global {
  namespace JSX {
    // FIX: The original props type `React.HTMLProps<HTMLElement>` was likely too restrictive for A-Frame's custom attributes
    // and caused a type resolution error that broke the interface merging. Changing the props to `any` makes the declaration
    // less strict but allows the `extends React.JSX.IntrinsicElements` to function correctly, restoring the standard HTML element types.
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-sky': any;
      'a-camera': any;
      'a-cursor': any;
      'a-plane': any;
      'a-text': any;
      'a-animation': any;
      'a-image': any;
    }
  }
}

interface VRModeScreenProps {
  onBack: () => void;
  language: Language;
  appHubApps: AppDefinition[];
}

type ModelStatus = 'idle' | 'loading' | 'loaded' | 'error';

const VRModeScreen: React.FC<VRModeScreenProps> = ({ onBack, language, appHubApps }) => {
  const t = locales[language];
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
  const [error, setError] = useState<string | null>(null);
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
          specificError = Object.entries(detail)
            .map(([key, value]) => {
              let valueStr = typeof value === 'object' && value !== null ? '[Object]' : String(value);
              return `${key}: ${valueStr}`;
            })
            .join('\n');
        } else {
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

  const handleBack = useCallback(() => {
    const sceneEl = document.getElementById('vr-scene') as any;
    if (sceneEl && sceneEl.is('vr-mode')) {
      sceneEl.exitVR();
    }
    onBack();
  }, [onBack]);
  
  // App Panel click handler setup
  useEffect(() => {
    const sceneEl = document.getElementById('vr-scene') as any;
    if (!sceneEl) return;

    const handleClick = (event: any) => {
      const appId = event.target.getAttribute('data-appid');
      if (appId) {
        const app = appHubApps.find(a => a.id === appId);
        if (app && app.action) {
          // Exiting VR before triggering action
          handleBack();
          // Timeout to allow VR exit animation to start
          setTimeout(() => app.action(), 300);
        }
      }
    };

    const panels = sceneEl.querySelectorAll('.clickable-app');
    panels.forEach((panel: any) => panel.addEventListener('click', handleClick));

    return () => {
      panels.forEach((panel: any) => panel.removeEventListener('click', handleClick));
    };
  }, [appHubApps, handleBack, modelStatus]); // Re-run if modelStatus changes to attach events after render

  const handleEnterVR = async () => {
    const sceneEl = document.getElementById('vr-scene') as any;
    if (sceneEl && sceneEl.enterVR) {
        try {
            await sceneEl.enterVR();
        } catch (e) {
            console.error("Failed to enter VR:", e);
            alert("No se pudo entrar al modo VR. Es posible que su navegador no sea compatible o que la función esté deshabilitada. En Firefox, puede que necesite activar las opciones de 'WebXR' en la página 'about:config'.");
        }
    }
  };

  const modelUrl = "https://antoniomoneo.github.io/Datasets/objects/climate-skeleton.glb";
  const vrApps = appHubApps.filter(app => app.id !== 'vr-mode' && app.enabled);
  const angleStep = 360 / vrApps.length;
  const radius = 3.5;

  return (
    <div className="fixed inset-0 bg-black text-white w-full h-full">
      <a-scene
        id="vr-scene"
        embedded
        vr-mode-ui="enabled: true"
        webxr="mode: immersive-vr; optionalFeatures: cardboard, viewer;"
        renderer="antialias: true; colorManagement: true; physicallyCorrectLights: true;"
        background="color: #ECECEC"
        shadow="type: pcfsoft"
      >
        {/* Environment & Lighting */}
        <a-entity light="type: ambient; intensity: 1.0"></a-entity>
        <a-entity light="type: point; intensity: 1.0; castShadow: true" position="2 4 4"></a-entity>
        <a-sky color="#ECECEC"></a-sky>

        {/* Camera Rig with Teleport and Orbit controls */}
        <a-entity id="cameraRig" position="0 1.7 4">
          <a-camera 
            id="camera" 
            look-controls-enabled="true"
            orbit-controls="target: #grabbable-skeleton; enableDamping: true; dampingFactor: 0.125; rotateSpeed:0.25; minDistance: 1; maxDistance: 10;"
          >
          </a-camera>
          {/* Left hand for grabbing */}
          <a-entity 
            hand-controls="hand: left; handModelStyle: lowPoly; color: #ffcccc"
            grab
          ></a-entity>
          {/* Right hand for grabbing, teleporting, and UI interaction */}
          <a-entity
            hand-controls="hand: right; handModelStyle: lowPoly; color: #ffcccc"
            laser-controls="hand: right"
            raycaster="objects: .teleport-destination, .clickable-app; far: 5"
            teleport-controls="cameraRig: #cameraRig; teleportOrigin: #camera; button: trigger; collisionEntities: .teleport-destination; curveShootingSpeed: 8"
            grab
          ></a-entity>
        </a-entity>
        
        {/* Sculpture Model - Refactored for correct rotation and animation */}
        <a-entity
            id="grabbable-skeleton"
            grabbable=""
            position="0 1.6 0"
        >
          <a-entity
            id="model-wrapper"
            animation="property: rotation; to: 0 360 0; dur: 30000; easing: linear; loop: true"
          >
            <a-entity
              ref={modelEntityRef}
              id="skeleton-model"
              gltf-model={`url(${modelUrl})`}
              crossorigin="anonymous"
              position="0 0 0"
              scale="1 1 1"
              rotation="0 0 0"
              shadow="cast: true"
              visible={modelStatus === 'loaded'}
            ></a-entity>
          </a-entity>
        </a-entity>
        
        {/* App Hub Panels */}
        <a-entity id="app-hub-panels" position="0 1.6 0">
           {vrApps.map((app, index) => {
               const angleRad = (angleStep * index) * (Math.PI / 180);
               const x = radius * Math.sin(angleRad);
               const z = -radius * Math.cos(angleRad);
               const rotationY = angleStep * index;
               const title = t[app.titleKey as keyof typeof t] || app.id;
               const description = t[`${app.titleKey.replace('Title', 'Desc')}` as keyof typeof t] || '';
               return (
                   <a-entity key={app.id} position={`${x} 0 ${z}`} rotation={`0 ${rotationY} 0`}>
                       <a-plane
                           className="clickable-app"
                           data-appid={app.id}
                           width="1" height="0.6"
                           color="#1f2937"
                           opacity="0.8"
                           side="double"
                       >
                           <a-text
                               value={title}
                               align="center"
                               color="#e5e7eb"
                               width="0.9"
                               position="0 0.1 0.01"
                           ></a-text>
                            <a-text
                                value={description}
                               align="center"
                                color="#9ca3af"
                                width="0.8"
                                wrap-count="25"
                                position="0 -0.15 0.01"
                           ></a-text>
                            <a-animation attribute="scale" begin="mouseenter" end="mouseleave" to="1.1 1.1 1.1" dur="200"></a-animation>
                       </a-plane>
                   </a-entity>
               );
           })}
        </a-entity>
        
        {/* Floor for teleportation and shadow */}
        <a-plane
          className="teleport-destination"
          rotation="-90 0 0"
          position="0 0 0"
          width="20"
          height="20"
          color="#CCCCCC"
          shadow="receive: true"
        ></a-plane>

        {/* Loading / Error Feedback in Scene */}
        {(modelStatus === 'loading' || modelStatus === 'idle') && (
          <a-entity position="0 1.5 -1">
            <a-text value={t.vrModeLoading} align="center" color="black" width="4"></a-text>
          </a-entity>
        )}
        
        {modelStatus === 'error' && (
          <a-entity position="0 1.5 -1">
            <a-text value={error || ''} align="center" color="#B91C1C" width="4"></a-text>
          </a-entity>
        )}
      </a-scene>
      
      {/* HTML UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start">
        <button onClick={handleBack} className="bg-gray-800/50 hover:bg-gray-700/70 text-white font-bold py-2 px-4 rounded-lg transition-colors pointer-events-auto">
          {t.vrModeBackToHub}
        </button>
        <div className="text-center pointer-events-none">
          <h1 className="text-2xl font-bold font-title text-gray-900 drop-shadow-lg">{t.appHubVRTitle}</h1>
          <p className="text-sm opacity-90 text-gray-800 drop-shadow-md">{t.vrModeInstruction}</p>
        </div>
        <button 
          onClick={handleEnterVR}
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
