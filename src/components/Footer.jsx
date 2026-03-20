/**
 * Footer Component
 * Site footer with social links and credits - matching original design
 */
import React from 'react';
import { FaInstagram, FaLinkedin, FaTelegram } from 'react-icons/fa';

/**
 * Team members who built the site
 */
const TEAM_MEMBERS = [
  { name: 'Mourya S Gowda', linkedin: 'https://www.linkedin.com/in/mourya-s' },
  { name: 'BhanuPrakash B M', linkedin: 'https://www.linkedin.com/in/bhanuprakash28/' }
];

/**
 * Social media links
 */
const SOCIAL_LINKS = [
  { icon: FaInstagram, url: 'https://www.instagram.com/astrava.tech', label: 'Instagram' },
  { icon: FaLinkedin, url: 'https://www.linkedin.com/company/astrava-tech/', label: 'LinkedIn' },
  { icon: FaTelegram, url: 'https://t.me/astrava_tech', label: 'Telegram' }
];

const Footer = () => {
  return (
    <footer className="footer relative z-10 w-full bg-[#0a0a0f] border-t border-white/10 pt-12 pb-6">
      <div className="footer-content max-w-5xl mx-auto px-6 flex flex-col items-center text-center">

        {/* Social Icons */}
        <div className="footer-social flex items-center justify-center gap-6 mb-8">
          {SOCIAL_LINKS.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon text-gray-400 hover:text-green-500 hover:scale-110 transition-all text-2xl"
              aria-label={social.label}
            >
              <social.icon />
            </a>
          ))}
        </div>

        {/* Footer Text */}
        <div className="footer-text text-sm text-gray-500 space-y-4">
          <div className="leading-relaxed">
            Copyright 2026 | Built with <span className="text-red-500">❤️</span> by{' '}
            <a
              href="https://www.linkedin.com/company/gfg-campus-body-dr-ait/"
              target="_blank"
              rel="noopener noreferrer"
              className="club-link text-gray-300 hover:text-green-400 transition-colors inline-block font-medium"
            >
              GeeksforGeeks Campus Body - Dr.AIT Club
            </a>
            {' '}|{' '}
            {TEAM_MEMBERS.map((member, index) => (
              <span key={index}>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-link text-gray-300 hover:text-green-400 transition-colors"
                  title={`Connect with ${member.name} on LinkedIn`}
                >
                  <strong>{member.name}</strong>
                </a>
                {index < TEAM_MEMBERS.length - 1 && <span className="mx-1">, </span>}
              </span>
            ))}
          </div>

          {/* Bottom Links */}
          <div className="footer-bottom-links flex items-center justify-center gap-4 text-xs text-gray-600 mt-6 pt-6 border-t border-white/5">
            <a href="#privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
