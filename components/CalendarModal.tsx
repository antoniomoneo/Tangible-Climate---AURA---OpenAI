import React from 'react';
import { locales } from '../locales';
import type { Language } from '../types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const CALENDAR_ID = "c_41592e57472725b685e2d4ffb20f05c12f117f9ea2a46431ea621ed686f870ff@group.calendar.google.com";

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, language }) => {
  const t = locales[language];

  if (!isOpen) return null;

  const calendarSrc = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=Europe%2FMadrid&wkst=1&bgcolor=%231e293b&color=%2306b6d4&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&mode=MONTH`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="font-title text-2xl text-cyan-400">{t.calendarTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 flex-grow flex flex-col text-gray-300">
            <p className="mb-4 flex-shrink-0">{t.calendarDescription}</p>
            <div className="flex-grow rounded-lg overflow-hidden border border-gray-600 bg-gray-700">
                 <iframe
                    src={calendarSrc}
                    style={{ borderWidth: 0 }}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    title={t.calendarTitle}
                    ></iframe>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
