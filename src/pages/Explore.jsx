import React from 'react';

const examples = [
  {
    title: 'Whimsical Forest Adventure',
    prompt: 'Write a short story about a curious child who discovers a talking fox in an enchanted forest.',
  },
  {
    title: 'Sci-fi Mystery',
    prompt: 'Create a suspenseful story set on a silent space station orbiting a dying star.',
  },
  {
    title: 'Slice of Life',
    prompt: 'Describe a day in the life of a street musician who changes someone’s life with a song.',
  },
];

const Explore = () => {
  return (
    <div className="text-white/90 space-y-6">
      <h2 className="text-3xl font-bold text-cyan-300">Explore</h2>
      <p className="text-white/70">Try these curated prompts or use them as inspiration to craft your own.</p>
      <div className="grid md:grid-cols-2 gap-6">
        {examples.map((ex, idx) => (
          <div key={idx} className="bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">{ex.title}</h3>
            <p className="text-white/80 text-sm">{ex.prompt}</p>
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-pink-300 mb-2">Featured</h3>
        <p className="text-white/70">Check back soon for community favorites and seasonal prompts.</p>
      </div>
    </div>
  );
};

export default Explore; 