import React from 'react';
import { XIcon, InstagramIcon, FacebookIcon, LinkedInIcon } from './icons';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/tangibledata/',
    icon: <InstagramIcon className="w-6 h-6" />,
  },
  {
    name: 'X',
    url: 'https://x.com/tandatxyz',
    icon: <XIcon className="w-6 h-6" />,
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/people/Tangible-Data/61569837263686/',
    icon: <FacebookIcon className="w-6 h-6" />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/tangible-data-xyz/',
    icon: <LinkedInIcon className="w-6 h-6" />,
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 p-3 z-30">
      <div className="w-full max-w-7xl mx-auto flex justify-center items-center gap-6">
        <span className="text-xs text-gray-500 hidden sm:block">
          &copy; {new Date().getFullYear()} Tangible Data
        </span>
        <div className="flex items-center gap-5">
          {socialLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Tangible Data on ${link.name}`}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;