import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Enhance from './pages/Enhance';
import About from './pages/About';
import Team from './pages/Team';
import Contact from './pages/Contact';
import './App.css';

// Particle Component
const Particles = () => {
  const particleCount = 50; // Number of particles
  const particles = Array.from({ length: particleCount }).map((_, index) => {
    const delay = `${Math.random() * 10}s`;
    const duration = `${Math.random() * 10 + 5}s`;
    const x = `${Math.random() * 100}vw`;
    const y = `${Math.random() * 100}vh`;

    return (
      <div
        key={index}
        className="particle"
        style={{
          '--x': x,
          '--y': y,
          '--delay': delay,
          '--duration': duration,
          top: y,
          left: x,
        }}
      ></div>
    );
  });

  return <div className="particles">{particles}</div>;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Particles /> {/* Add particle effects */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enhance" element={<Enhance />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
