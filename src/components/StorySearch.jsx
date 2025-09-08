import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ChevronDown, Settings, Wand2, Sparkles, Search, RefreshCw, Zap, Palette, BookOpen } from 'lucide-react';
import { searchStories, generateStories } from '../services/apiServices';

// Genre options with visual elements
const genres = [
  { id: 'fantasy', name: 'Fantasy', emoji: '🐉', desc: 'Magic and mythical worlds', color: 'from-purple-500 to-pink-500' },
  { id: 'sci-fi', name: 'Sci-Fi', emoji: '🚀', desc: 'Future technology and space', color: 'from-blue-500 to-cyan-500' },
  { id: 'romance', name: 'Romance', emoji: '💕', desc: 'Love and relationships', color: 'from-rose-400 to-pink-500' },
  { id: 'mystery', name: 'Mystery', emoji: '🔍', desc: 'Suspense and investigation', color: 'from-indigo-600 to-purple-700' },
  { id: 'adventure', name: 'Adventure', emoji: '🏔️', desc: 'Action and exploration', color: 'from-orange-500 to-red-500' },
  { id: 'horror', name: 'Horror', emoji: '👻', desc: 'Scary and supernatural', color: 'from-gray-700 to-gray-900' },
  { id: 'comedy', name: 'Comedy', emoji: '😂', desc: 'Humor and laughter', color: 'from-yellow-400 to-orange-500' },
  { id: 'drama', name: 'Drama', emoji: '🎭', desc: 'Emotional and character-driven', color: 'from-violet-600 to-indigo-700' }
];

// Tone options with colors
const tones = [
  { id: 'uplifting', name: 'Uplifting', color: 'bg-yellow-500', gradient: 'from-yellow-400 to-orange-500' },
  { id: 'dark', name: 'Dark', color: 'bg-gray-700', gradient: 'from-gray-700 to-gray-900' },
  { id: 'humorous', name: 'Humorous', color: 'bg-pink-500', gradient: 'from-pink-400 to-rose-500' },
  { id: 'serious', name: 'Serious', color: 'bg-blue-600', gradient: 'from-blue-600 to-blue-800' },
  { id: 'mysterious', name: 'Mysterious', color: 'bg-purple-600', gradient: 'from-purple-600 to-indigo-700' },
  { id: 'romantic', name: 'Romantic', color: 'bg-rose-500', gradient: 'from-rose-400 to-pink-500' },
  { id: 'adventurous', name: 'Adventurous', color: 'bg-orange-500', gradient: 'from-orange-400 to-red-500' },
  { id: 'melancholic', name: 'Melancholic', color: 'bg-indigo-600', gradient: 'from-indigo-600 to-violet-700' }
];

// Length options
const lengths = [
  { id: 'short', name: 'Short', desc: '1-2 paragraphs', words: '100-200 words', icon: '✂️' },
  { id: 'medium', name: 'Medium', desc: '3-5 paragraphs', words: '300-500 words', icon: '📝' },
  { id: 'long', name: 'Long', desc: '6-10 paragraphs', words: '600-1000 words', icon: '📚' }
];

// Theme options
const themes = [
  'Friendship', 'Betrayal', 'Redemption', 'Love', 'Family', 'Courage', 'Sacrifice', 
  'Discovery', 'Revenge', 'Hope', 'Freedom', 'Identity', 'Power', 'Justice'
];

const StorySearch = ({ onStoryFound = () => {}, onError = () => {}, loading: parentLoading, setLoading: parentSetLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genre: 'fantasy',
    tone: 'uplifting',
    length: 'short',
    theme: 'friendship',
    storyCount: 1,
    creativity: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const controls = useAnimation();
  
  // Get current genre for dynamic styling
  const currentGenre = genres.find(g => g.id === filters.genre) || genres[0];
  const currentTone = tones.find(t => t.id === filters.tone) || tones[0];

  const setLoadingBoth = (v) => {
    setLoading(v);
    if (typeof parentSetLoading === 'function') parentSetLoading(v);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Add micro-interaction for filter changes
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 }
    });
  };

  // Handle typing with debounce
  const handleSearchQueryChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set typing state
    setIsTyping(true);
    
    // Debounce
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  async function handleSearch(e) {
    e?.preventDefault?.();
    setError(null);
    const q = (searchQuery || '').trim();
    if (q.length < 2) {
      const errorMsg = 'Please enter at least two characters to search.';
      setError(errorMsg);
      onError(errorMsg);
      return;
    }
    setLoadingBoth(true);
    
    // Play animation
    await controls.start({
      scale: [1, 1.02, 0.98, 1],
      transition: { duration: 0.6 }
    });
    
    try {
      // Enhanced payload with filters
      const enhancedPayload = {
        prompt: q,
        limit: Number(filters.storyCount) || 4,
        variations: true,
        genre: filters.genre,
        tone: filters.tone,
        length: filters.length,
        theme: filters.theme,
        creativity: filters.creativity
      };
      
      const res = await searchStories(q, enhancedPayload);
      onStoryFound(res);
      
      // Success animation
      await controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 }
      });
    } catch (err) {
      console.error('Search failed:', err);
      const errorMsg = err.message || 'Search failed. See console for details.';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setLoadingBoth(false);
    }
  }

  async function handleGenerate(e) {
    e?.preventDefault?.();
    setError(null);
    setLoadingBoth(true);
    
    // Play animation
    await controls.start({
      scale: [1, 1.02, 0.98, 1],
      transition: { duration: 0.6 }
    });
    
    try {
      const res = await generateStories({
        limit: Number(filters.storyCount) || 6,
        themes: [filters.theme],
        genre: filters.genre,
        tone: filters.tone,
        length: filters.length,
        creativity: filters.creativity
      });
      onStoryFound(res);
      
      // Success animation
      await controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 }
      });
    } catch (err) {
      console.error('Generate failed:', err);
      const errorMsg = err.message || 'Generate failed. See console for details.';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setLoadingBoth(false);
    }
  }

  // Active filters count (difference from defaults)
  const activeFiltersCount = (
    (filters.genre !== 'fantasy') +
    (filters.tone !== 'uplifting') +
    (filters.length !== 'short') +
    (filters.theme !== 'friendship') +
    (filters.storyCount !== 1) +
    (filters.creativity !== 5)
  );

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Floating particles effect
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() > 0.5 ? 10 : -10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );

  return (
    <motion.div 
      className="relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
      animate={controls}
      initial={{ scale: 1 }}
    >
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Decorative background elements with dynamic colors based on selected genre */}
      <div className={`pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr ${currentGenre.color} opacity-20 blur-3xl`} />
      <div className={`pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br ${currentTone.gradient} opacity-10 blur-3xl`} />
      
      {/* Animated corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-full h-full opacity-10"
        >
          {currentGenre.emoji}
        </motion.div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-full h-full opacity-10"
        >
          {currentTone.id === 'uplifting' ? '✨' : currentTone.id === 'dark' ? '🌑' : currentTone.id === 'humorous' ? '🎭' : '🎨'}
        </motion.div>
      </div>

      {/* Header */}
      <div className="relative mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 blur-md bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl opacity-60" 
            />
            <div className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 tracking-tight">
              Craft Your Tale
            </h2>
            <p className="text-white/60 text-sm md:text-base">Design the vibe, then let the magic write itself.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-6 relative">
        {/* Main Prompt Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-white/90 text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Describe your story idea
            </label>
            <motion.div 
              animate={{ 
                scale: isTyping ? [1, 1.1, 1] : 1,
                transition: { duration: 0.3 }
              }}
              className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white/70"
            >
              {searchQuery.length}/500
            </motion.div>
          </div>
          <div className="relative">
            <div className={`pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${currentGenre.color} opacity-20 blur-md`} />
            <textarea
              value={searchQuery}
              onChange={handleSearchQueryChange}
              placeholder="A brave knight discovers a magical portal in an ancient forest..."
              className="relative w-full p-5 rounded-2xl bg-white/10 border border-white/30 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all duration-300 resize-none h-36 shadow-xl/20 hover:bg-white/15"
              maxLength={500}
            />
            {searchQuery && (
              <motion.button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-white/60">
            <span>Tip: Be specific about characters, setting, and conflict for richer output.</span>
            <span className="hidden md:inline">Supports emojis and ✨ vibes.</span>
          </div>
        </div>

        {/* Quick Genre Selection */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-green-600 p-2.5 rounded-lg text-lg font-semibold mb-3 shadow-lg shadow-emerald-900/20">
            <Palette className="w-5 h-5" />
            Choose a genre
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/15 border border-white/20 text-white/80">{genres.length} options</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {genres.map(genre => (
              <motion.button
                key={genre.id}
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleFilterChange('genre', genre.id)}
                className={`group relative p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${
                  filters.genre === genre.id 
                    ? `border-cyan-400/60 bg-gradient-to-br from-cyan-400/15 via-purple-500/10 to-pink-500/10 shadow-lg shadow-cyan-900/20` 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                aria-pressed={filters.genre === genre.id}
              >
                <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full bg-gradient-to-tr ${genre.color} opacity-10 blur-xl`} />
                <div className="relative z-10">
                  <div className="text-2xl mb-2 drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {genre.emoji}
                  </div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    {genre.name}
                    {filters.genre === genre.id && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-200"
                      >
                        Selected
                      </motion.span>
                    )}
                  </div>
                  <div className="text-white/60 text-sm">{genre.desc}</div>
                </div>
                {filters.genre === genre.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <motion.button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          whileHover={{ x: 5 }}
        >
          <Settings className="w-5 h-5" />
          Advanced Settings
          {activeFiltersCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/70"
            >
              {activeFiltersCount} active
            </motion.span>
          )}
          <motion.div
            animate={{ rotate: showFilters ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5"
          >
            <ChevronDown />
          </motion.div>
        </motion.button>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 border-t border-white/20 pt-6 mt-4 rounded-xl"
            >
              {/* Tone Selection */}
              <div>
                <label className="block text-white/90 font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Story Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {tones.map(tone => (
                    <motion.button
                      key={tone.id}
                      type="button"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFilterChange('tone', tone.id)}
                      className={`px-4 py-2 rounded-full transition-all duration-300 border font-medium ${
                        filters.tone === tone.id 
                          ? `${tone.color} text-white shadow-lg border-white/20 relative overflow-hidden` 
                          : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/10'
                      }`}
                    >
                      {filters.tone === tone.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                      {tone.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Length and Theme */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/90 font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Story Length
                  </label>
                  <div className="space-y-2">
                    {lengths.map(length => (
                      <motion.label 
                        key={length.id} 
                        className="flex items-center justify-between gap-3 cursor-pointer rounded-xl px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:scale-105"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="length"
                            value={length.id}
                            checked={filters.length === length.id}
                            onChange={(e) => handleFilterChange('length', e.target.value)}
                            className="w-4 h-4 text-cyan-400 accent-cyan-500"
                          />
                          <span className="flex items-center gap-2 text-white font-medium">
                            <span>{length.icon}</span>
                            {length.name}
                          </span>
                        </span>
                        <span className="text-white/60 text-sm">{length.words}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Central Theme
                  </label>
                  <div className="relative">
                    <div className={`pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r ${currentTone.gradient} opacity-20 blur`} />
                    <select
                      value={filters.theme}
                      onChange={(e) => handleFilterChange('theme', e.target.value)}
                      className="relative w-full p-3 rounded-xl bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-4 focus:ring-purple-400/30 appearance-none"
                    >
                      {themes.map(theme => (
                        <option key={theme} value={theme.toLowerCase()} className="bg-gray-800 text-white">
                          {theme}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Count and Creativity */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/90 font-semibold mb-3 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Number of Stories: {filters.storyCount}
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={filters.storyCount}
                      onChange={(e) => handleFilterChange('storyCount', parseInt(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-lg appearance-none slider cursor-pointer"
                      onMouseDown={() => controls.start({ scale: 1.01 })}
                      onMouseUp={() => controls.start({ scale: 1 })}
                    />
                    <div className="mt-2 flex justify-between text-[10px] text-white/50">
                      <span>1</span><span>4</span><span>8</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 font-semibold mb-3 flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Creativity Level: {filters.creativity}/10
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={filters.creativity}
                      onChange={(e) => handleFilterChange('creativity', parseInt(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-sky-500/30 via-fuchsia-500/30 to-rose-500/30 rounded-lg appearance-none slider cursor-pointer"
                      onMouseDown={() => controls.start({ scale: 1.01 })}
                      onMouseUp={() => controls.start({ scale: 1 })}
                    />
                    <div className="mt-2 flex justify-between text-[10px] text-white/50">
                      <span>Low</span><span>Med</span><span>Max</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <motion.button 
            type="submit" 
            disabled={loading || (searchQuery || '').trim().length < 2} 
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex-1 min-w-[200px] py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
            <span className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 blur-md bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-opacity duration-500" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Create Story
                </>
              )}
            </span>
            {/* Shine effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
          </motion.button>
          
          <motion.button 
            type="button" 
            onClick={handleGenerate} 
            disabled={loading} 
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex-1 min-w-[200px] py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600" />
            <span className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 blur-md bg-gradient-to-r from-yellow-500 to-orange-600 transition-opacity duration-500" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Random Stories
                </>
              )}
            </span>
            {/* Shine effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
          </motion.button>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
            ❌ {error}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default StorySearch;