import React from 'react';
import Spline from '@splinetool/react-spline';

export default function SceneOrnament() {
  // Subtle 3D ambience in the background (optional)
  return (
    <div className="absolute inset-0 opacity-70">
      {/* Replace the URL with any hosted spline scene if desired */}
      <Spline scene="https://prod.spline.design/2p7uIm6W5Y0NMkL1/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/80 pointer-events-none" />
    </div>
  );
}
