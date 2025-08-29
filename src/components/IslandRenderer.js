import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const IslandRenderer = ({ playerPosition, worldState, networkPeers }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const initScene = () => {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 5, 10);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Create island geometry
      const islandGeometry = new THREE.CylinderGeometry(20, 25, 2, 32);
      const islandMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B4513,
        transparent: true,
        opacity: 0.8
      });
      const island = new THREE.Mesh(islandGeometry, islandMaterial);
      island.position.y = -1;
      scene.add(island);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

      // Store references
      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;

      // Start render loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    };

    initScene();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [playerPosition, worldState, networkPeers]);

  // Update camera position based on player
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x = playerPosition.x;
      cameraRef.current.position.z = playerPosition.z + 10;
      cameraRef.current.lookAt(playerPosition.x, playerPosition.y, playerPosition.z);
    }
  }, [playerPosition]);

  return <div ref={mountRef} className="island-renderer" />;
};

export default IslandRenderer;