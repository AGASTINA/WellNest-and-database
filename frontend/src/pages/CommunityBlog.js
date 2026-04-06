import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser } from '../utils/auth';
import { deletePostById, listPosts, toggleLike, upsertPost } from '../utils/blogStore';

const formatDate = (value) => new Date(value).toLocaleDateString('en-GB');
const FALLBACK_BLOG_IMAGE = 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1200&q=80';

const CommunityBlog = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const currentUserId = String(user?.id || user?.email || 'guest');
  const currentUserName = user?.name || 'WellNest User';

  const [posts, setPosts] = useState(listPosts());
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Latest');
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    category: 'Fitness',
    excerpt: '',
    content: '',
    tags: '',
    imageUrl: ''
  });

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    return ['All Categories', ...dynamic];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let result = posts.filter((post) => {
      const matchCategory = category === 'All Categories' || post.category === category;
      const matchQuery = !q
        || post.title.toLowerCase().includes(q)
        || post.excerpt.toLowerCase().includes(q)
        || post.authorName.toLowerCase().includes(q)
        || (post.tags || []).some((tag) => tag.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'Popular') {
        return (b.likeUserIds?.length || 0) - (a.likeUserIds?.length || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [posts, searchQuery, category, sortBy]);

  const reloadPosts = () => setPosts(listPosts());

  const handleLike = (postId) => {
    toggleLike(postId, currentUserId);
    reloadPosts();
  };

  const handleDelete = (postId, authorName) => {
    if (authorName !== currentUserName) {
      alert('You can delete only your own posts.');
      return;
    }
    if (!window.confirm('Delete this post?')) return;
    deletePostById(postId);
    reloadPosts();
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) {
      alert('Title and content are required.');
      return;
    }

    upsertPost({
      title: draft.title.trim(),
      category: draft.category,
      authorName: currentUserName,
      authorRole: String(user?.role || 'USER').toUpperCase(),
      authorInitial: currentUserName[0]?.toUpperCase() || 'U',
      excerpt: draft.excerpt.trim() || draft.content.trim().slice(0, 140),
      content: draft.content.trim(),
      tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      imageUrl: draft.imageUrl.trim() || 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1200&q=80'
    });

    setDraft({ title: '', category: 'Fitness', excerpt: '', content: '', tags: '', imageUrl: '' });
    setShowCreate(false);
    reloadPosts();
  };

  return (
    <div className="min-h-screen wellnest-app-bg py-8 px-4">
      <div className="max-w-7xl mx-auto wellnest-content-layer">
        <div className="wellnest-surface sticky top-0 z-50 !bg-white/90 backdrop-blur border border-slate-200 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold">
              <span className="text-xl">←</span>
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Community Health Blog</h1>
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              + Create Post
            </button>
          </div>
        </div>

        <div className="wellnest-surface !bg-white/85 backdrop-blur border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search health blogs..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="lg:col-span-2">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80">
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="lg:col-span-2">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80">
                <option value="Latest">Latest</option>
                <option value="Popular">Popular</option>
              </select>
            </div>
          </div>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="wellnest-surface !bg-white/88 backdrop-blur border border-slate-200 p-6 mb-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Create New Post</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Post title" className="px-4 py-3 rounded-xl border border-slate-200" />
              <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200">
                <option>Fitness</option><option>Nutrition</option><option>Mental Wellness</option><option>Health</option>
              </select>
            </div>
            <input value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} placeholder="Image URL (optional)" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
            <input value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} placeholder="Short summary" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
            <textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} rows={6} placeholder="Write your post..." className="w-full px-4 py-3 rounded-xl border border-slate-200" />
            <input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} placeholder="Tags (comma separated)" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-slate-300">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold">Publish Post</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const likeCount = post.likeUserIds?.length || 0;
            const commentCount = post.comments?.length || 0;
            return (
              <article key={post.id} className="wellnest-surface !bg-white/88 backdrop-blur border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-56">
                  <img
                    src={post.imageUrl || FALLBACK_BLOG_IMAGE}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (e.currentTarget.src !== FALLBACK_BLOG_IMAGE) {
                        e.currentTarget.src = FALLBACK_BLOG_IMAGE;
                      }
                    }}
                  />
                  <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">{post.category}</span>
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-500 mb-3">{formatDate(post.createdAt)}</p>
                  <h3 className="text-3xl font-bold leading-tight text-green-600 mb-3">{post.title}</h3>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center">{post.authorInitial}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{post.authorName}</p>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{post.authorRole}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-5">{post.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-6">
                      <button onClick={() => handleLike(post.id)} className="inline-flex items-center gap-2 text-slate-500 hover:text-pink-600">
                        <span>💗</span><span>{likeCount}</span>
                      </button>
                      <div className="inline-flex items-center gap-2 text-slate-500">
                        <span>💬</span><span>{commentCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {post.authorName === currentUserName && (
                        <button onClick={() => handleDelete(post.id, post.authorName)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Delete</button>
                      )}
                      <button onClick={() => navigate(`/community-blog/${post.id}`)} className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700">
                        Read <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityBlog;
