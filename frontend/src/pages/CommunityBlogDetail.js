import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addComment, getPostById, toggleLike } from '../utils/blogStore';
import { getStoredUser } from '../utils/auth';

const timeAgo = (dateLike) => {
  const diff = Date.now() - new Date(dateLike).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
};

const CommunityBlogDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [post, setPost] = useState(getPostById(postId));
  const [draftComment, setDraftComment] = useState('');

  const currentUserName = user?.name || 'You';
  const currentUserId = String(user?.id || user?.email || 'guest');

  const likeCount = post?.likeUserIds?.length || 0;
  const comments = useMemo(() => [...(post?.comments || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [post]);

  if (!post) {
    return (
      <div className="min-h-screen wellnest-app-bg py-12 px-4">
        <div className="max-w-5xl mx-auto wellnest-content-layer wellnest-surface p-8 !bg-white/88 backdrop-blur">
          <p className="text-slate-600">Post not found.</p>
          <button onClick={() => navigate('/community-blog')} className="mt-4 text-green-600 font-semibold">← Back to Blogs</button>
        </div>
      </div>
    );
  }

  const onLike = () => {
    const updated = toggleLike(post.id, currentUserId);
    if (updated) setPost(updated);
  };

  const onComment = () => {
    const text = draftComment.trim();
    if (!text) return;
    const updated = addComment(post.id, {
      authorName: currentUserName,
      authorInitial: currentUserName[0]?.toUpperCase() || 'Y',
      text
    });
    if (updated) setPost(updated);
    setDraftComment('');
  };

  return (
    <div className="min-h-screen wellnest-app-bg py-8 px-4">
      <div className="max-w-6xl mx-auto wellnest-content-layer">
        <div className="wellnest-surface !bg-white/90 backdrop-blur border border-slate-200 shadow-sm sticky top-0 z-40 px-6 py-4 mb-4">
          <button onClick={() => navigate('/community-blog')} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold">
            <span className="text-xl">←</span>
            <span>Back to Blogs</span>
          </button>
        </div>

        <section className="wellnest-surface !bg-white/86 backdrop-blur border border-slate-200 p-8 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 font-bold text-3xl flex items-center justify-center">{post.authorInitial}</div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{post.authorName}</p>
                <span className="inline-flex mt-1 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">{post.authorRole}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onLike} className="px-5 py-3 rounded-2xl border border-slate-200 bg-white/80 text-slate-700 inline-flex items-center gap-2 font-semibold hover:bg-slate-50">
                💜 {likeCount}
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="px-5 py-3 rounded-2xl border border-slate-200 bg-white/80 text-slate-700 inline-flex items-center gap-2 font-semibold hover:bg-slate-50"
              >
                🔗 Share
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h1 className="text-3xl font-bold text-green-600 mb-2">{post.title}</h1>
            <p className="text-sm text-slate-500 mb-6">{new Date(post.createdAt).toLocaleDateString('en-GB')} • {post.category}</p>

            <div className="text-[36px] md:text-[38px] leading-[1.95] text-slate-800 whitespace-pre-line">
              {post.content}
            </div>

            <div className="border-t border-slate-200 mt-8 pt-6">
              <p className="text-xl font-bold text-slate-500 mb-3">TAGS</p>
              <div className="flex flex-wrap gap-2">
                {(post.tags || []).map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="wellnest-surface !bg-white/86 backdrop-blur border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-4xl font-bold text-slate-900">Comments</h2>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">{comments.length}</span>
          </div>

          <div className="flex gap-4 mb-8 items-start">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-xl">{currentUserName[0]?.toUpperCase() || 'Y'}</div>
            <div className="flex-1">
              <textarea
                value={draftComment}
                onChange={(e) => setDraftComment(e.target.value)}
                placeholder="Add to the discussion..."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-700"
              />
              <div className="flex justify-end mt-3">
                <button onClick={onComment} className="px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800">Post Comment</button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <article key={comment.id} className="rounded-2xl border border-slate-100 bg-white/75 p-4 flex gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xl">{comment.authorInitial}</div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-3xl font-bold text-slate-900">{comment.authorName}</p>
                    <span className="text-sm text-slate-400">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 text-[37px] leading-[1.8]">{comment.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommunityBlogDetail;
