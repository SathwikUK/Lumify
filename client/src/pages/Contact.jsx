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

    emailjs
      .sendForm(
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
        }, 5000);
      })
      .catch(() => {
        setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
      });
  };

  useEffect(() => {
    // Basic Three.js scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const container = document.getElementById('model-container');
    container.style.position = 'relative';

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const setRendererSize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', setRendererSize);

    // Add basic lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Create neon-glow stars (draggable)
    const stars = [];
    const starCount = 50;
    const starGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xffd700,
      emissiveIntensity: 2,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < starCount; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(
        THREE.MathUtils.randFloatSpread(4),
        THREE.MathUtils.randFloatSpread(4),
        THREE.MathUtils.randFloatSpread(4)
      );
      scene.add(star);
      stars.push(star);
    }

    // OrbitControls for scene navigation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Dragging logic using raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedStar = null;
    const offset = new THREE.Vector3();
    const dragPlane = new THREE.Plane();
    const planeNormal = new THREE.Vector3();

    const updateMouse = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onMouseDown = (event) => {
      updateMouse(event);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stars);

      if (intersects.length > 0) {
        selectedStar = intersects[0].object;
        planeNormal.copy(camera.position).sub(selectedStar.position).normalize();
        dragPlane.setFromNormalAndCoplanarPoint(planeNormal, selectedStar.position);

        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
        offset.copy(intersectionPoint).sub(selectedStar.position);

        controls.enabled = false;
      }
    };

    const onMouseMove = (event) => {
      if (!selectedStar) return;
      updateMouse(event);
      raycaster.setFromCamera(mouse, camera);
      const intersectionPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
        selectedStar.position.copy(intersectionPoint.sub(offset));
      }
    };

    const onMouseUp = () => {
      selectedStar = null;
      controls.enabled = true;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setRendererSize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
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
          <button type="submit" className="submit-button" disabled={status.type === 'loading'}>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`status-message ${status.type}`}>
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
