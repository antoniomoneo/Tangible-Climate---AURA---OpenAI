import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: The type import path was incorrect. It should be a relative import from the project root.
import type { Language, AppDefinition } from '../types';
// FIX: The locales import path was incorrect. It should be a relative import from the project root.
import { locales } from '../locales';

// Allow A-Frame elements in JSX
// FIX: The previous declaration for A-Frame elements was overly broad, potentially causing type conflicts.
// This revised declaration uses React.HTMLProps for a cleaner base type and adds an index signature
// to allow for A-Frame's custom attributes, resolving the "property does not exist" errors.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.HTMLProps<HTMLElement> & { [key: string]: any };
      'a-entity': React.HTMLProps<HTMLElement> & { [key: string]: any };
      'a-sky': React.HTMLProps<HTMLElement> & { [key: string]: any };
      'a-camera': React.HTMLProps<HTMLElement> & { [key: string]: any };
      'a-cursor': React.HTMLProps<HTMLElement> & { [key: string]: any };
      'a-plane': React.HTMLProps<HTMLElement> & { [key: string]: any };
      'a-text': React.HTMLProps<HTMLElement> & { [key:string]: any };
      'a-animation': React.HTMLProps<HTMLElement> & { [key: string]: any };
      'a-image': React.HTMLProps<HTMLElement> & { [key: string]: any };
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
    const sceneEl = document.querySelector('a-scene') as any;
    if (sceneEl && sceneEl.is('vr-mode')) {
      sceneEl.exitVR();
    }
    onBack();
  }, [onBack]);
  
  // App Panel click handler setup
  useEffect(() => {
    const sceneEl = sceneRef.current;
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

  const modelUrl = "https://antoniomoneo.github.io/Datasets/objects/climate-skeleton.glb";
  const vrApps = appHubApps.filter(app => app.id !== 'vr-mode' && app.enabled);
  const angleStep = 360 / vrApps.length;
  const radius = 3.5;

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
            orbit-controls="target: #grabbable-skeleton; enableDamping: true; dampingFactor: 0.125; rotateSpeed:0.25; minDistance: 1; maxDistance: 10;"
          >
          </a-camera>
          <a-entity hand-controls="hand: left; handModelStyle: lowPoly; color: #ffcccc"></a-entity>
          <a-entity
            hand-controls="hand: right; handModelStyle: lowPoly; color: #ffcccc"
            laser-controls="hand: right"
            raycaster="objects: .teleport-destination, .clickable-app; far: 5"
            teleport-controls="cameraRig: #cameraRig; teleportOrigin: #camera; button: trigger; collisionEntities: .teleport-destination; curveShootingSpeed: 8"
          ></a-entity>
        </a-entity>
        
        {/* Sculpture Model - Wrapped for grabbable interaction */}
        <a-entity
            id="grabbable-skeleton"
            grabbable=""
            position="0 0.8 0"
            rotation="-90 0 0"
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
            >
            <a-animation attribute="rotation" to="0 360 0" dur="30000" easing="linear" repeat="indefinite"></a-animation>
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
                           class="clickable-app"
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