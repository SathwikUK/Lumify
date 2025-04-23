import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Team.css';
import ratimg from '../assets/ratnam sir.png'
import sat from "../assets/sat.jpg";
import ame from "../assets/ame.png"
import rupa from "../assets/rupa.jpg";

const Team = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const teamMembers = [
    {
      name: "Mr. Ch Vijayananda Ratnam ",
      role: "Mentor",
      image: ratimg,
      description: "He is our guide in the project of low light image enhancement, providing direction and expertise throughout"
    },
    {
      name: "Sathwik Uday Kiran",
      role: "Team Lead, Frontend & Backend Integration, Model Preparation, Team Manager",
      image: sat,
      description: "Leading the team, managing frontend and backend integration, preparing models, and overseeing project progress."
    },
    {
      name: "Rupa Talasila",
      role: "Researcher & Dataset Collection Specialist",
      image: rupa,
      description: "Responsible for researching relevant papers and collecting datasets for model training."
    },
    {
      name: "Ameer Sayyad",
      role: "Model Trainer & Adjustments Specialist",
      image: ame,
      description: "Handles model training, making adjustments, and ensuring model accuracy."
    },
    {
      name: "Bharath",
      role: "Model Losses & Optimization Specialist",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
      description: "Focused on model losses, optimization, and performance improvements."
    }
  ];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  return (
    <div className="team-container">
      <div className="team-content">
        <button className="nav-button prev" onClick={prevCard}>←</button>

        <div className="cards-container">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              className="team-card"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-image">
                <img src={teamMembers[currentIndex].image} alt={teamMembers[currentIndex].name} />
                <div className="image-overlay" />
              </div>
              <div className="card-content">
                <h3 className="member-name">{teamMembers[currentIndex].name}</h3>
                <p className="member-role">{teamMembers[currentIndex].role}</p>
                <p className="member-description">{teamMembers[currentIndex].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button className="nav-button next" onClick={nextCard}>→</button>
      </div>

      <div className="card-indicators">
        {teamMembers.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;
