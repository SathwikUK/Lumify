import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import './Contact.css';

import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';


const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState({ type: '', message: '' });

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending...' });

    emailjs.sendForm(
      'service_mco82ym',
      'template_7s7n3ea',
      form.current,
      'ajykOHZkq5Q6Z5rlX'
    )
      .then(() => {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        form.current.reset();
        setTimeout(() => {
          setStatus({ type: '', message: '' });
        }, 5000);  // Hide the success message after 5 seconds
      })
      .catch(() => {
        setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
      });
  };

  useEffect(() => {
    // 3D scene setup using THREE.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    document.getElementById('model-container').appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const light = new THREE.AmbientLight(0x404040, 1.5);  // Ambient light
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div className="contact-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="contact-content-left"
      >
        <h2 className="contact-title">Get in Touch</h2>

        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              name="user_name"
              required
              placeholder="Your Name"
              className="form-input"
            />
            <div className="input-glow" />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="user_email"
              required
              placeholder="Your Email"
              className="form-input"
            />
            <div className="input-glow" />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              required
              placeholder="Your Message"
              className="form-input"
              rows="5"
            />
            <div className="input-glow" />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? (
              <div className="loading">
                <div className="spinner" />
                <span>Sending...</span>
              </div>
            ) : (
              <>
                <Send className="send-icon" />
                <span>Send Message</span>
              </>
            )}
          </button>

          {status.message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`status-message ${status.type}`}
            >
              {status.message}
            </motion.div>
          )}
        </form>
      </motion.div>

      <div id="model-container" className="contact-content-right"></div>
    </div>
  );
};

export default Contact;
