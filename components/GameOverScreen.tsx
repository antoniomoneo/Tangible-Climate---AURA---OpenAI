import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';
// FIX: Fix import paths to be relative.
import type { StorySegment, Language } from '../types';
// FIX: Fix import paths to be relative.
import { locales } from '../locales';
import { IdentificationIcon, DownloadIcon, ShareIcon, XIcon, LinkedInIcon, FacebookIcon, TangibleDataLogo } from './icons';
import { GRAPH_OVERVIEW_IMAGE } from '../assets';


interface GameOverScreenProps {
  finalScene: StorySegment;
  onRestart: () => void;
  language: Language;
  onOpenQuest: () => void;
}

const Diploma: React.FC<{ language: Language, t: any }> = ({ language, t }) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div 
            id="diploma-to-download" 
            className="bg-white text-gray-800 p-8 w-full max-w-2xl aspect-[1.414] shadow-2xl border-8 border-gray-700 relative flex flex-col justify-between"
        >
            <div className="absolute inset-0 bg-repeat bg-center opacity-5" style={{backgroundImage: `url("${GRAPH_OVERVIEW_IMAGE}")`, backgroundSize: '50%'}}></div>
            
            <div className="text-center z-10">
                <TangibleDataLogo className="h-8 mx-auto text-gray-800 mb-4" />
                <h1 className="font-title text-4xl font-bold text-cyan-700 tracking-wider uppercase">{t.diplomaTitle}</h1>
            </div>
            
            <div className="text-center z-10 my-8">
                <p className="text-lg">{t.diplomaAwardedTo}</p>
                <p className="font-title text-3xl font-semibold border-b-2 border-gray-400 inline-block px-8 pb-1 my-2">{t.diplomaRecipient}</p>
                <p className="text-base max-w-md mx-auto mt-4">{t.diplomaDescription}</p>
            </div>
            
            <div className="text-center z-10">
                <p className="text-sm">{t.diplomaDate}: {formattedDate}</p>
                <p className="text-xs text-gray-500 mt-1">tangibledata.xyz</p>
            </div>
        </div>
    );
};


const GameOverScreen: React.FC<GameOverScreenProps> = ({ finalScene, onRestart, language, onOpenQuest }) => {
  const t = locales[language];
  const [shareNotification, setShareNotification] = useState<string | null>(null);

  const handleDownload = () => {
    const node = document.getElementById('diploma-to-download');
    if (node) {
      htmlToImage.toPng(node, { 
          quality: 0.95,
          backgroundColor: '#ffffff',
          pixelRatio: 2, // for higher resolution
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'tangible-climate-diploma.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
    }
  };

  const handleShare = (platform: 'x' | 'linkedin' | 'facebook') => {
    const node = document.getElementById('diploma-to-download');
    if (!node) {
      console.error('Diploma element not found');
      return;
    }

    htmlToImage.toPng(node, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
    })
    .then((dataUrl) => {
        // Step 1: Trigger download
        const link = document.createElement('a');
        link.download = 'tangible-climate-diploma.png';
        link.href = dataUrl;
        link.click();
        
        // Step 2: Show notification
        setShareNotification(t.shareNotificationDownload);
        setTimeout(() => setShareNotification(null), 5000);

        // Step 3: Open share URL
        const appUrl = 'https://clima.tangibledata.xyz/';
        let shareUrl = '';

        switch (platform) {
            case 'x':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(t.shareMessageX)}&url=${encodeURIComponent(appUrl)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(appUrl)}&title=${encodeURIComponent(t.diplomaTitle)}&summary=${encodeURIComponent(t.shareMessageLinkedIn)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`;
                break;
        }

        if (shareUrl) {
          window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
        }
    })
    .catch((err) => {
        console.error('oops, something went wrong!', err);
        setShareNotification(t.shareError);
        setTimeout(() => setShareNotification(null), 4000);
    });
  };


  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center animate-fadeIn p-4 relative">
        <h1 className="font-title text-4xl md:text-5xl text-cyan-400 mb-4">{t.gameOverTitle}</h1>

        <Diploma language={language} t={t} />

        <div className="mt-8 w-full max-w-3xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                    onClick={handleDownload}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-lg flex items-center justify-center gap-2"
                >
                    <DownloadIcon className="h-5 w-5" />
                    {t.diplomaDownload}
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 hidden sm:inline">{t.diplomaShare}:</span>
                    <button onClick={() => handleShare('x')} aria-label="Share on X" className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full"><XIcon className="h-5 w-5"/></button>
                    <button onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn" className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full"><LinkedInIcon className="h-5 w-5"/></button>
                    <button onClick={() => handleShare('facebook')} aria-label="Share on Facebook" className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full"><FacebookIcon className="h-5 w-5"/></button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-700">
                <button 
                    onClick={onRestart}
                    className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-lg"
                >
                    {t.gameOverRestart}
                </button>
                <button 
                    onClick={onOpenQuest}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-lg flex items-center justify-center gap-2"
                >
                    <IdentificationIcon className="h-5 w-5" />
                    {t.appHubQuestTitle}
                </button>
            </div>
        </div>
         {shareNotification && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg z-50 animate-fadeIn">
                {shareNotification}
            </div>
        )}
    </div>
  );
};

export default GameOverScreen;