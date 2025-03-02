import React from 'react';
import { motion } from 'framer-motion';
import './Home.css';
import About from './About';
import Contact from './Contact';
import Enhance from './Enhance';
import Team from './Team';
import { Section } from 'lucide-react';
import lumify from '../assets/lum.mp4'

const Home = () => {
  return (
    <div className="home-container">
      <div className="particles">
        <Particles />
      </div>

      <div className="glitter-container">
        <Glitters />
      </div>

      <div className="content">
        <div className="grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="left-content"
          >
            <h1 className="title">Lumify</h1>
            <p className="subtitle">
              Low light image enhancement with face recognition
            </p>
            <div className="button-container">
              <button className="glow-button">Get Started</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="right-content"
          >
            <div className="video-container">
              <video autoPlay loop muted playsInline>
                <source
                  src={lumify}
                  type="video/mp4"
                />
              </video>
              <div className="video-overlay" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Particles = () => {
  return (
    <div className="particles-container">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--duration': `${3 + Math.random() * 4}s`,
            '--delay': `${-Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

const Glitters = () => {
  return (
    <div className="glitter-container">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="glitter"
          style={{
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--duration': `${2 + Math.random() * 4}s`,
            '--delay': `${-Math.random() * 5}s`,
            '--color': Math.random() > 0.5 ? '#fff' : '#facc15',
          }}
        />
      ))}
      <Section>
      <Enhance/>
      </Section>
      <Section>
      <Enhance/>
      </Section>
      <Section>
      <About/>
      </Section>
      <Section>
      <Contact/>
      </Section>
      <Section>
      <Team/>
      </Section>
     
      
      
    </div>
  );
};

export default Home;
