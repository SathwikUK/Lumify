import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './About.css';

const About = () => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const handleBulbClick = () => {
    setIsContentVisible(!isContentVisible);
  };

  const handleDownloadPDF = () => {
    // Replace with your actual PDF URL
    window.open('https://example.com/about.pdf', '_blank');
  };

  return (
    <div className="about-container">
      <div className="about-content">
        <div className="bulb-section">
          <motion.div
            className="bulb-container"
            whileHover={{ scale: 1.1 }}
            onClick={handleBulbClick}
          >
            <Lightbulb className="bulb-icon" />
            <div className="bulb-glow" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isContentVisible && (
            <motion.div
              className="text-section"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-content">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="about-title"
                >
                  About Lumify
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="about-text"
                >
                  Lumify is a cutting-edge image enhancement platform that leverages advanced AI technology to transform low-light images into stunning, well-lit photographs.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="about-text"
                >
                  Our state-of-the-art face recognition algorithms ensure that facial features are preserved and enhanced naturally, maintaining the perfect balance between brightness and detail.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="about-text"
                >
                  With Lumify, transform your dark, underexposed photos into professional-quality images with just a single click.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="pdf-button"
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default About;