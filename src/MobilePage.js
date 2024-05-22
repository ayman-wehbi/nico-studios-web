import React from 'react';
import './MobilePage.css';

const MobilePage = () => {
  const handleDownload = () => {
    window.location.href = 'https://drive.google.com/file/d/1IyVio7RHcatCANd1Vnzd5tUVJyu-uXh1/view'; // Update with the correct URL
  };

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="landing-title">NICO STUDIOS</h1>
        <p className="landing-description">
          <strong>Nico Studios: The Songwriter's Companion</strong><br/><br/>
          Transform your songwriting journey with Nico Studio—your ultimate mobile songwriting app. Crafted specifically for songwriters, poets, and music producers, Nico Studio elevates your creative process, letting you focus solely on your artistry without the clutter of conventional note apps.
        </p>
        <p className="landing-description">
          <strong>Why Nico Studio?</strong><br/><br/>
          <strong>Tailored for Musicians:</strong> Designed by musicians for musicians to provide a seamless, distraction-free environment for song creation.<br/>
          <strong>Fluid Navigation:</strong> Effortlessly switch between songs and projects with intuitive, easy-to-access controls—no more backtracking through multiple pages.<br/>
          <strong>All-In-One Functionality:</strong> Write lyrics, record drafts, and jot down ideas all within a single app. Nico Studio blends simplicity with functionality to boost your productivity and creativity.
        </p>
        <p className="landing-description">
          <strong>Key Features:</strong><br/><br/>
          <strong>Lyric Creation & Editing:</strong> Craft and fine-tune your lyrics with an easy-to-use text editor.<br/>
          <strong>Project Organization:</strong> Keep your songs neatly organized by project for easy access and management.<br/>
          <strong>Enhanced Searchability:</strong> Quickly find any song with a simple search by title—never lose track of your work again.
        </p>
        <p className="landing-description">
          <strong>Ideal for:</strong><br/><br/>
          <strong>Emerging Songwriters:</strong> Perfect for those starting their songwriting journey and looking for an organized, straightforward tool to help bring their ideas to life.<br/>
          <strong>Professional Musicians:</strong> Enhance your songwriting process with features designed to improve efficiency and reduce the time spent searching through files.<br/>
          <strong>Creative Minds:</strong> Whether you're a poet or a music producer, Nico Studio adapts to your creative needs, offering you a dedicated space to capture every melody and lyric.
        </p><h2 className="landing-subtitle">Coming soon to iOS</h2>
        <button className="landing-button" onClick={handleDownload}>Download for Android</button>
      </div>
    </div>
  );
};

export default MobilePage;
