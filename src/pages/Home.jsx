import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Copy, Share2, Download } from 'lucide-react';
import StorySearch from '../components/StorySearch';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedStories, setLikedStories] = useState(new Set());

  const handleStoryFound = (result) => {
    setStories(result.stories || []);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setStories([]);
  };

  const toggleLike = (index) => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const copyStory = async (story) => {
    try {
      await navigator.clipboard.writeText(story.content || story.narrative);
    } catch (err) {
      console.error('Failed to copy story:', err);
    }
  };

  const shareStory = async (story, index) => {
    const title = story.title || `Story ${index + 1}`;
    const text = story.content || story.narrative || '';
    try {
      if (navigator.share) {
        await navigator.share({ title, text });
      } else {
        await navigator.clipboard.writeText(`${title}\n\n${text}`);
        alert('Share not supported on this device. Story copied to clipboard.');
      }
    } catch (err) {
      console.error('Failed to share story:', err);
    }
  };

  const exportStory = (story, index) => {
    const title = story.title || `story-${index + 1}`;
    const safeTitle = String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `story-${index + 1}`;
    const text = story.content || story.narrative || '';
    const content = `${title}\n\n${text}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3">
              Open Tails
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Transform your imagination into captivating stories with AI-powered creativity
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <StorySearch 
          onStoryFound={handleStoryFound}
          onError={handleError}
          loading={loading}
          setLoading={setLoading}
        />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-center"
        >
          ❌ {error}
        </motion.div>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white text-lg">Crafting your stories...</span>
          </div>
        </motion.div>
      )}

      {stories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Your Generated Stories
            </h2>
            <p className="text-white/60">
              {stories.length} unique {stories.length === 1 ? 'story' : 'stories'} crafted just for you
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {stories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-cyan-300 mb-2">
                      {story.title || `Story ${index + 1}`}
                    </h3>
                    {(story.genre || story.tone) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {story.genre && (
                          <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs capitalize">
                            {story.genre}
                          </span>
                        )}
                        {story.tone && (
                          <span className="px-3 py-1 bg-pink-500/30 text-pink-200 rounded-full text-xs capitalize">
                            {story.tone}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleLike(index)}
                      className={`p-2 rounded-full transition-colors ${
                        likedStories.has(index) 
                          ? 'text-red-400 bg-red-400/20' 
                          : 'text-white/60 hover:text-red-400 hover:bg-red-400/20'
                      }`}
                      title="Like story"
                    >
                      <Heart className="w-5 h-5" fill={likedStories.has(index) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => copyStory(story)}
                      className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                      title="Copy story"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-white/90 leading-relaxed whitespace-pre-line mb-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {story.content || story.narrative}
                </div>

                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-white/50 text-sm">
                  <span>{story.model || 'AI Story Generator'}</span>
                  <div className="flex gap-3">
                    <button onClick={() => shareStory(story, index)} className="flex items-center gap-1 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button onClick={() => exportStory(story, index)} className="flex items-center gap-1 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {!loading && stories.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <BookOpen className="w-24 h-24 text-white/20 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Create Magic
          </h3>
          <p className="text-white/60 text-lg max-w-md mx-auto">
            Describe your story idea above and watch AI transform it into captivating narratives
          </p>
        </motion.div>
      )}
    </>
  );
};

export default Home; 