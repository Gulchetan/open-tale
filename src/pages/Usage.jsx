import React from 'react';

const Usage = () => {
  return (
    <div className="text-white/90 space-y-6">
      <h2 className="text-3xl font-bold text-cyan-300">Usage Guide</h2>
      <p className="text-white/70">Create stories by describing your idea in natural language. You can add a genre, tone, or characters to get tailored results.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3">
          <h3 className="text-xl font-semibold text-purple-300">Tips</h3>
          <ul className="list-disc list-inside text-white/80 space-y-1">
            <li>Be specific: include setting, character names, and conflict.</li>
            <li>Try different tones: whimsical, suspenseful, uplifting, dark.</li>
            <li>Use the copy button to refine in your editor.</li>
          </ul>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3">
          <h3 className="text-xl font-semibold text-pink-300">Notes</h3>
          <ul className="list-disc list-inside text-white/80 space-y-1">
            <li>Stories are generated with AI; review and edit before publishing.</li>
            <li>No sensitive or private data should be entered.</li>
            <li>Generation may vary; retry with refined prompts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Usage; 