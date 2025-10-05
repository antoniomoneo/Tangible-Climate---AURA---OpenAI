import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { locales } from '../locales';

// Allow A-Frame elements in JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface VRModeScreenProps {
  onBack: () => void;
  language: Language;
}

const VRModeScreen: React.FC<VRModeScreenProps> = ({ onBack, language }) => {
  const t = locales[language];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInVR, setIsInVR] = useState(false);
  const sceneRef = useRef<any>(null); // Use a ref to hold a reference to the a-scene element

  useEffect(() => {
    // A-Frame components register after React mounts, so we query for them in an effect.
    const sceneEl = document.querySelector('a-scene');
    if (!sceneEl) return;
    sceneRef.current = sceneEl;

    // VR mode state listener
    const enterVR = () => setIsInVR(true);
    const exitVR = () => setIsInVR(false);
    sceneEl.addEventListener('enter-vr', enterVR);
    sceneEl.addEventListener('exit-vr', exitVR);

    const modelEl = document.querySelector('#skeleton-model');
    let handleLoaded: (() => void) | null = null;
    let handleError: (() => void) | null = null;
    if (modelEl) {
      handleLoaded = () => setLoading(false);
      handleError = () => {
        setError(t.vrModeError);
        setLoading(false);
      };
      modelEl.addEventListener('model-loaded', handleLoaded);
      modelEl.addEventListener('model-error', handleError);
    }

    return () => {
      sceneEl.removeEventListener('enter-vr', enterVR);
      sceneEl.removeEventListener('exit-vr', exitVR);
      if (modelEl && handleLoaded && handleError) {
        modelEl.removeEventListener('model-loaded', handleLoaded);
        modelEl.removeEventListener('model-error', handleError);
      }
    };
  }, [t.vrModeError]);
  
  const handleBack = () => {
    // If we are in VR mode, exit it gracefully before navigating back.
    if (sceneRef.current && sceneRef.current.is('vr-mode')) {
      sceneRef.current.exitVR();
    }
    onBack();
  };

  return (
    <div className="fixed inset-0 bg-black text-white w-full h-full">
      <a-scene
        ref={sceneRef}
        vr-mode-ui="enterVRButton: #customEnterVRButton; exitVRButton: #customExitVRButton;"
        renderer="colorManagement: true; physicallyCorrectLights: true;"
        shadow="type: pcfsoft"
      >
        {/* Assets */}
        <a-assets>
          <a-asset-item id="skeleton-obj" src="https://raw.githubusercontent.com/antoniomoneo/Datasets/main/objects/Skeleton.obj" crossOrigin="anonymous"></a-asset-item>
        </a-assets>

        {/* Environment */}
        <a-sky color="#111827"></a-sky>
        <a-plane class="teleport-destination" position="0 0 -4" rotation="-90 0 0" width="20" height="20" color="#1f2937" shadow="receive: true"></a-plane>

        {/* --- Enhanced Lighting Setup --- */}
        {/* Ambient light for overall illumination */}
        <a-light type="ambient" color="#666" intensity="0.6"></a-light>
        {/* Key light (spotlight) to cast soft shadows */}
        <a-light type="spot" position="-1 4 4" angle="40" penumbra="0.5" intensity="1.5" castShadow="true" color="#a5f3fc" shadow-camera-far="50"></a-light>
        {/* Fill light (hemisphere) for soft, bounced lighting */}
        <a-light type="hemisphere" groundColor="#1f2937" color="#60a5fa" intensity="0.8"></a-light>
        {/* Rim light (backlight) to highlight edges */}
        <a-light type="point" position="0 2 -6" intensity="1.2" color="#f472b6"></a-light>

        {/* Sculpture Model */}
        <a-entity
          id="skeleton-model"
          obj-model="obj: #skeleton-obj"
          position="0 1.6 -3"
          scale="0.01 0.01 0.01"
          rotation="0 0 0"
          material="color: #e0f2fe; metalness: 0.2; roughness: 0.8;"
          shadow="cast: true"
        >
          <a-animation attribute="rotation"
             dur="30000"
             fill="forwards"
             to="0 360 0"
             repeat="indefinite"
             easing="linear"
          ></a-animation>
        </a-entity>
        
        {/* Pulsating Base - only visible in VR mode */}
        {isInVR && (
          <a-ring
            position="0 0.01 -3"
            rotation="-90 0 0"
            color="#a5f3fc"
            radius-inner="0.5"
            radius-outer="0.7"
            material="opacity: 0.5; transparent: true;"
          >
            <a-animation
              attribute="scale"
              dur="2000"
              from="1 1 1"
              to="1.2 1.2 1.2"
              direction="alternate"
              repeat="indefinite"
              easing="ease-in-out-sine"
            ></a-animation>
            <a-animation
              attribute="material.opacity"
              dur="2000"
              from="0.5"
              to="0.1"
              direction="alternate"
              repeat="indefinite"
              easing="ease-in-out-sine"
            ></a-animation>
          </a-ring>
        )}

        {/* Camera and Controls Rig */}
        <a-entity id="rig" position="0 0 0" wasd-controls="fly: false; acceleration: 20">
            <a-entity camera position="0 1.6 0" look-controls>
                <a-entity cursor="rayOrigin: mouse"></a-entity>
            </a-entity>
            <a-entity id="leftHand" laser-controls="hand: left"></a-entity>
            <a-entity 
                id="rightHand" 
                laser-controls="hand: right"
                teleport-controls="
                    cameraRig: #rig; 
                    teleportOrigin: #rightHand; 
                    type: parabolic; 
                    collisionEntities: .teleport-destination;
                    curveShootingSpeed: 8;
                "
            ></a-entity>
        </a-entity>
      </a-scene>

      {/* Improved HTML UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between p-4">
        {/* Top panel for status and instructions */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-center pointer-events-auto max-w-lg">
          <h2 className="font-title text-xl text-cyan-400 mb-2">{t.appHubVRTitle}</h2>
          {loading && !error && (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>{t.vrModeLoading}</span>
            </div>
          )}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && !error && <p>{t.vrModeInstruction}</p>}
        </div>

        {/* Bottom bar with action buttons */}
        <div className="w-full flex justify-between items-center pointer-events-auto">
          <button
            onClick={handleBack}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
          >
            {t.vrModeBackToHub}
          </button>
          
          <button 
            id="customEnterVRButton"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !!error}
          >
            {t.vrModeEnterVR}
          </button>
          {/* This button is required by A-Frame's vr-mode-ui but we don't need to show it */}
          <button id="customExitVRButton" style={{display: 'none'}}>{t.vrModeExitVR}</button>
        </div>
      </div>
    </div>
  );
};

export default VRModeScreen;
