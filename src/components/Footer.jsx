/**
 * Footer Component
 * Site footer with social links and credits - matching original design
 */
import React from 'react';
import { FaInstagram, FaLinkedin, FaTelegram } from 'react-icons/fa';
import './Footer.css';

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
    <footer className="footer">
      <div className="footer-content">
        {/* Logo Section (placeholder) */}
        <div className="footer-logo-section"></div>

        {/* Social Icons */}
        <div className="footer-social">
          {SOCIAL_LINKS.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label={social.label}
            >
              <social.icon />
            </a>
          ))}
        </div>

        {/* Footer Text */}
        <div className="footer-text">
          <span>
            Copyright 2026 | Built with ❤️ by{' '}
            <a
              href="https://www.linkedin.com/company/gfg-campus-body-dr-ait/"
              target="_blank"
              rel="noopener noreferrer"
              className="club-link"
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
                  className="team-link"
                  title={`Connect with ${member.name} on LinkedIn`}
                >
                  <strong>{member.name}</strong>
                </a>
                {index < TEAM_MEMBERS.length - 1 && ', '}
              </span>
            ))}
          </span>

          {/* Bottom Links */}
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
