const BLOG_STORAGE_KEY = 'wellnest-community-blog-v1';

const starterPosts = [
  {
    id: 'post-1',
    title: 'Stay fit Stay Healthy',
    category: 'Fitness',
    authorName: 'Likhita Reddy',
    authorRole: 'USER',
    authorInitial: 'L',
    createdAt: '2026-03-22T08:30:00.000Z',
    excerpt: 'Staying healthy is not just about hitting the gym—it’s about creating a balanced lifestyle that nourishes your body, mind, and spirit.',
    content: `💪 Staying healthy isn’t just about hitting the gym—it’s about creating a balanced lifestyle that nourishes your body, mind, and spirit. Here are some practical ways to keep yourself fit and fine every day:\n\n🥗 Eat Smart, Not Less\nFocus on whole foods: fruits, vegetables, lean proteins, and whole grains.\n\nLimit processed foods and sugary drinks—they drain energy and add empty calories.\n\nHydrate consistently; water is your body’s best friend.\n\n🏃 Move Your Body Daily\nAim for at least 30 minutes of physical activity—walking, cycling, yoga, or dancing.\n\nMix cardio with strength training to build endurance and muscle.\n\nStretch regularly to improve flexibility and prevent injuries.`,
    tags: ['Fitness', 'Health', 'WellNest'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: [
      {
        id: 'c1',
        authorName: 'Alex',
        authorInitial: 'A',
        text: 'Great read! Really helped me today.',
        createdAt: '2026-03-22T10:00:00.000Z'
      },
      {
        id: 'c2',
        authorName: 'Sam_Fit',
        authorInitial: 'S',
        text: 'Thanks for sharing this context!',
        createdAt: '2026-03-22T07:00:00.000Z'
      }
    ]
  }
];

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const readPosts = () => {
  const saved = safeParse(localStorage.getItem(BLOG_STORAGE_KEY), null);
  if (!Array.isArray(saved) || saved.length === 0) {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(starterPosts));
    return [...starterPosts];
  }
  return saved;
};

const writePosts = (posts) => {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
};

const byNewest = (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export const listPosts = () => readPosts().sort(byNewest);

export const getPostById = (id) => listPosts().find((p) => p.id === id) || null;

export const upsertPost = (postPayload) => {
  const posts = readPosts();
  const now = new Date().toISOString();

  if (postPayload.id) {
    const idx = posts.findIndex((p) => p.id === postPayload.id);
    if (idx >= 0) {
      posts[idx] = {
        ...posts[idx],
        ...postPayload,
        updatedAt: now
      };
      writePosts(posts);
      return posts[idx];
    }
  }

  const created = {
    id: `post-${Date.now()}`,
    createdAt: now,
    likeUserIds: [],
    comments: [],
    ...postPayload
  };
  posts.push(created);
  writePosts(posts);
  return created;
};

export const deletePostById = (id) => {
  const posts = readPosts().filter((p) => p.id !== id);
  writePosts(posts);
};

export const toggleLike = (postId, userId) => {
  if (!userId) return null;
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx < 0) return null;
  const likes = Array.isArray(posts[idx].likeUserIds) ? posts[idx].likeUserIds : [];
  const hasLiked = likes.includes(userId);
  posts[idx].likeUserIds = hasLiked
    ? likes.filter((id) => id !== userId)
    : [...likes, userId];
  writePosts(posts);
  return posts[idx];
};

export const addComment = (postId, commentPayload) => {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx < 0) return null;

  const nextComment = {
    id: `comment-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...commentPayload
  };

  const existingComments = Array.isArray(posts[idx].comments) ? posts[idx].comments : [];
  posts[idx].comments = [...existingComments, nextComment];
  writePosts(posts);
  return posts[idx];
};
