export async function apiPost(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload || {})
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (parseError) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function normalizeStories(raw) {
  // If already in expected shape: { stories: [...] }
  const directStories = Array.isArray(raw?.stories) ? raw.stories : Array.isArray(raw) ? raw : null;
  if (directStories) {
    return {
      stories: directStories.map((s, idx) => ({
        title: s.title || s.name || `Story ${idx + 1}`,
        content: s.content || s.text || s.narrative || '',
        model: s.model || raw?.model || undefined
      }))
    };
  }

  // Single text/content at top-level
  if (typeof raw?.content === 'string' || typeof raw?.text === 'string' || typeof raw?.narrative === 'string') {
    const single = raw.content || raw.text || raw.narrative || '';
    return {
      stories: [
        {
          title: raw.title || 'Story 1',
          content: single,
          model: raw.model || undefined,
        }
      ]
    };
  }

  // OpenAI-like: { choices: [ { message: { content }, text } ] }
  if (Array.isArray(raw?.choices) && raw.choices.length > 0) {
    const contents = raw.choices
      .map((c) => (c?.message?.content ?? c?.text ?? ''))
      .filter(Boolean);
    if (contents.length > 0) {
      return {
        stories: contents.map((c, idx) => ({ title: `Story ${idx + 1}`, content: c, model: raw?.model || undefined }))
      };
    }
  }

  // Google GenAI-like: { candidates: [ { content: { parts: [ { text } ] } } ] }
  if (Array.isArray(raw?.candidates) && raw.candidates.length > 0) {
    const contents = raw.candidates
      .map((cand) => {
        const parts = cand?.content?.parts;
        if (Array.isArray(parts)) {
          return parts
            .map((p) => p?.text)
            .filter((t) => typeof t === 'string' && t.trim().length > 0)
            .join('\n');
        }
        return undefined;
      })
      .filter(Boolean);
    if (contents.length > 0) {
      return {
        stories: contents.map((c, idx) => ({ title: `Story ${idx + 1}`, content: c, model: raw?.model || undefined }))
      };
    }
  }

  // Anthropic-like: { completion: "..." }
  if (typeof raw?.completion === 'string') {
    return {
      stories: [
        { title: 'Story 1', content: raw.completion, model: raw?.model || undefined }
      ]
    };
  }

  // Fallback empty
  return { stories: [] };
}

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

// Helper: map UI length to token/word hints
function mapLengthToLimits(lengthId) {
  switch (lengthId) {
    case 'short':
      return { maxTokens: 220, maxWords: 180, paragraphs: '1-2' };
    case 'long':
      return { maxTokens: 1100, maxWords: 900, paragraphs: '6-10' };
    case 'medium':
    default:
      return { maxTokens: 550, maxWords: 450, paragraphs: '3-5' };
  }
}

// Helper: map creativity 1-10 -> temperature 0.1-1.0
function mapCreativityToTemperature(creativity) {
  if (typeof creativity !== 'number') return undefined;
  const clamped = Math.max(1, Math.min(10, creativity));
  return Math.round((clamped / 10) * 10) / 10; // one decimal place
}

function buildCommonParams({ limit, genre, tone, length, theme, themes, creativity, variations, mode, prompt }) {
  const { maxTokens, maxWords } = mapLengthToLimits(length);
  const temperature = mapCreativityToTemperature(creativity);
  const normalizedThemes = Array.isArray(themes) ? themes : (theme ? [theme] : []);

  // Provide multiple synonymous fields for broader backend compatibility
  const common = {
    // core
    prompt: typeof prompt === 'string' ? prompt : '',
    inputs: typeof prompt === 'string' ? prompt : '',
    mode: mode || 'prompt',

    // counts/variations (include many synonyms)
    limit: Number(limit) || 1,
    n: Number(limit) || 1,
    count: Number(limit) || 1,
    num_results: Number(limit) || 1,
    num_outputs: Number(limit) || 1,
    num_samples: Number(limit) || 1,
    samples: Number(limit) || 1,
    results: Number(limit) || 1,
    outputs: Number(limit) || 1,
    variations: Boolean(variations),

    // UI filters as top-level
    genre: genre ?? undefined,
    tone: tone ?? undefined,
    length: length ?? undefined,
    theme: theme ?? undefined,
    themes: normalizedThemes,
    creativity: typeof creativity === 'number' ? creativity : undefined,

    // LLM-friendly params
    temperature: temperature,
    top_p: undefined,
    max_tokens: maxTokens,
    max_tokens_hint: maxTokens,
    max_words: maxWords,
    parameters: {
      temperature: temperature,
      max_new_tokens: maxTokens,
      max_tokens: maxTokens,
    },

    // nested filters payload for structured backends
    filters: {
      genre: genre ?? undefined,
      tone: tone ?? undefined,
      length: length ?? undefined,
      theme: theme ?? undefined,
      themes: normalizedThemes,
      creativity: typeof creativity === 'number' ? creativity : undefined,
    },

    // explicit advanced settings mirror to ensure backend consumption
    advancedSettings: {
      genre: genre ?? undefined,
      tone: tone ?? undefined,
      length: length ?? undefined,
      theme: theme ?? undefined,
      themes: normalizedThemes,
      creativity: typeof creativity === 'number' ? creativity : undefined,
      limit: Number(limit) || 1,
    },

    // ui mirror for compatibility
    ui: {
      genre: genre ?? undefined,
      tone: tone ?? undefined,
      length: length ?? undefined,
      theme: theme ?? undefined,
      themes: normalizedThemes,
      creativity: typeof creativity === 'number' ? creativity : undefined,
      limit: Number(limit) || 1,
    },

    // human-readable instruction hint to nudge generic backends
    instructions: `Generate ${Number(limit) || 1} ${length || 'medium'}-length (${maxWords} words approx) ${tone || 'neutral'} ${genre || 'story'} themed around ${normalizedThemes.join(', ') || 'the provided idea'}. Creativity: ${creativity ?? 7}/10.`,
  };

  return common;
}

export async function searchStories(
  prompt,
  {
    limit = 4,
    variations = true,
    genre,
    tone,
    length,
    theme,
    creativity
  } = {}
) {
  const payload = buildCommonParams({
    prompt: String(prompt || ''),
    limit,
    variations,
    genre,
    tone,
    length,
    theme,
    creativity,
    mode: 'prompt'
  });
  const endpoint = `${BASE_URL || ''}/api/generate`;

  // First attempt
  const data = await apiPost(endpoint, payload);
  const normalized = normalizeStories(data);

  // If backend ignored count or filters, attempt to fan-out to fulfill requested limit
  const currentStories = Array.isArray(normalized?.stories) ? [...normalized.stories] : [];
  const needed = Math.max(0, (Number(limit) || 1) - currentStories.length);

  if (needed > 0) {
    const extraPayloads = Array.from({ length: needed }).map((_, idx) => ({
      ...payload,
      // slight prompt nudge for diversity and explicit filter hint
      prompt: `${payload.prompt}\n\nConstraints: genre=${genre}, tone=${tone}, length=${length}, theme=${theme}, creativity=${creativity}. Variation #${idx + 1}.`,
      // attempt to vary seed/id if backend supports it
      seed: Date.now() + idx,
      variations: false,
      n: 1,
      limit: 1,
      count: 1,
      num_results: 1,
      outputs: 1,
    }));

    const extraResults = await Promise.all(
      extraPayloads.map(p => apiPost(endpoint, p).then(normalizeStories).catch(() => ({ stories: [] })))
    );

    for (const r of extraResults) {
      if (Array.isArray(r?.stories) && r.stories.length > 0) {
        // pick the first story from each extra call
        currentStories.push(r.stories[0]);
      }
    }
  }

  return { stories: currentStories.slice(0, Number(limit) || 1) };
}

export async function generateStories({
  limit = 6,
  themes = [],
  genre,
  tone,
  length,
  creativity
} = {}) {
  const payload = buildCommonParams({
    prompt: '',
    limit,
    variations: true,
    genre,
    tone,
    length,
    themes,
    creativity,
    mode: 'random'
  });
  const endpoint = `${BASE_URL || ''}/api/generate`;

  // First attempt
  const data = await apiPost(endpoint, payload);
  const normalized = normalizeStories(data);

  // Ensure we return the requested number of stories by fanning out if needed
  const currentStories = Array.isArray(normalized?.stories) ? [...normalized.stories] : [];
  const needed = Math.max(0, (Number(limit) || 1) - currentStories.length);

  if (needed > 0) {
    const extraPayloads = Array.from({ length: needed }).map((_, idx) => ({
      ...payload,
      prompt: `Random story. Constraints: genre=${genre}, tone=${tone}, length=${length}, themes=${Array.isArray(themes) ? themes.join(',') : themes}. Creativity=${creativity}. Variation #${idx + 1}.`,
      seed: Date.now() + idx,
      variations: false,
      n: 1,
      limit: 1,
      count: 1,
      num_results: 1,
      outputs: 1,
    }));

    const extraResults = await Promise.all(
      extraPayloads.map(p => apiPost(endpoint, p).then(normalizeStories).catch(() => ({ stories: [] })))
    );

    for (const r of extraResults) {
      if (Array.isArray(r?.stories) && r.stories.length > 0) {
        currentStories.push(r.stories[0]);
      }
    }
  }

  return { stories: currentStories.slice(0, Number(limit) || 1) };
} 