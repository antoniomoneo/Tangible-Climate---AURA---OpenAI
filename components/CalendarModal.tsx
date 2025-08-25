import React, { useState, useEffect } from 'react';
import type { Language, CalendarEvent } from '../types';
import { locales } from '../locales';
import { CalendarIcon } from './icons';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

// Simple iCal parser
const parseICalDate = (dateString: string): Date => {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1;
  const day = parseInt(dateString.substring(6, 8), 10);
  const hour = parseInt(dateString.substring(9, 11), 10);
  const minute = parseInt(dateString.substring(11, 13), 10);
  const second = parseInt(dateString.substring(13, 15), 10);
  return new Date(Date.UTC(year, month, day, hour, minute, second));
};

const parseICS = (icsString: string): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    // Unfold multi-line properties
    const unfoldedIcs = icsString.replace(/\r\n\s/g, '');
    const eventBlocks = unfoldedIcs.split('BEGIN:VEVENT');
  
    for (const block of eventBlocks.slice(1)) {
        const lines = block.split(/\r?\n/);
        const eventData: any = {};

        lines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':');

            if (key.startsWith('SUMMARY')) eventData.summary = value;
            if (key.startsWith('DTSTART')) eventData.start = parseICalDate(value);
            if (key.startsWith('DTEND')) eventData.end = parseICalDate(value);
            if (key.startsWith('DESCRIPTION')) eventData.description = value.replace(/\\n/g, '\n');
            if (key.startsWith('LOCATION')) eventData.location = value;
        });

        if (eventData.summary && eventData.start && eventData.end) {
            events.push(eventData as CalendarEvent);
        }
    }
    return events;
};


const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, language }) => {
  const t = locales[language];
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchEvents = async () => {
        setIsLoading(true);
        setError(null);
        setEvents([]);

        const apiUrl = '/api/calendar';

        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch calendar data.');
          }
          const icsData = await response.text();
          const parsedEvents = parseICS(icsData);
          
          const upcomingEvents = parsedEvents
            .filter(event => event.end > new Date())
            .sort((a, b) => a.start.getTime() - b.start.getTime());
            
          setEvents(upcomingEvents);
        } catch (e) {
          console.error(e);
          setError(t.calendarError);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEvents();
    }
  }, [isOpen, t.calendarError, language]);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
      return date.toLocaleTimeString(language, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="font-title text-2xl text-cyan-400 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6"/>
            {t.calendarTitle}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 text-gray-300 overflow-y-auto">
            {isLoading && <p className="text-center">{t.calendarLoading}</p>}
            {error && <p className="text-center text-red-400">{error}</p>}
            {!isLoading && !error && events.length === 0 && <p className="text-center">{t.calendarNoEvents}</p>}
            
            <div className="space-y-6">
                {events.map((event, index) => (
                    <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <p className="text-lg font-bold text-cyan-400">{event.summary}</p>
                        <p className="text-sm text-gray-400 mt-1">{formatDate(event.start)}</p>
                        <p className="text-sm text-gray-400">{`${formatTime(event.start)} - ${formatTime(event.end)}`}</p>
                        {event.location && <p className="text-sm text-gray-400 mt-2"><strong>Location:</strong> {event.location}</p>}
                        {event.description && <p className="text-gray-300 mt-3 whitespace-pre-wrap">{event.description}</p>}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;