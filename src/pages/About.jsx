import React from 'react';

const About = () => {
  return (
    <div className="text-white/90 space-y-6">
      <h2 className="text-3xl font-bold text-cyan-300">About Open Tails</h2>
      <p className="text-white/70">
        Open Tails turns your prompts into engaging stories with AI-assisted creativity. It focuses on simplicity, speed, and delightful reading.
      </p>
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3">
        <h3 className="text-xl font-semibold text-purple-300">Credits</h3>
        <p className="text-white/70">Created by <span className="text-white">Gulchetan Singh</span> with Gemini-powered AI integration.</p>
        <p className="text-white/60 text-sm">Built with React, Vite, Tailwind CSS, Framer Motion, and Lucide icons.</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-pink-300 mb-2">Roadmap</h3>
        <ul className="list-disc list-inside text-white/80 space-y-1">
          <li>Export stories as PDF/Markdown</li>
          <li>Shareable story links</li>
          <li>Story workspace with collections</li>
        </ul>
      </div>
    </div>
  );
};

export default About; 