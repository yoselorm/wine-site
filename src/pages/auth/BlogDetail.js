import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Share2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogBySlug, fetchBlogs } from '../../redux/catalogSlice';
import { getInitials, getAvatarColor } from '../../utils/placeholders';
import fallbackHero from '../../assets/images/fallbackbloghero.jpg';

const BlogDetail = () => {
  const { id: slug } = useParams();
  const { selectedBlog: post, blogs, loading, error } = useSelector((state) => state.catalog);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBlogBySlug(slug));
    dispatch(fetchBlogs());
    window.scrollTo(0, 0);
  }, [slug, dispatch]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 animate-pulse">
        <div className="h-4 w-32 bg-zinc-200 mb-8"></div>
        <div className="h-12 w-3/4 bg-zinc-200 mb-6"></div>
        <div className="h-64 bg-zinc-200 w-full mb-12"></div>
        <div className="space-y-4">
          <div className="h-4 bg-zinc-200 w-full"></div>
          <div className="h-4 bg-zinc-200 w-full"></div>
          <div className="h-4 bg-zinc-200 w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-32 flex flex-col items-center">
        <p className="text-wine font-serif text-xl mb-6">{error}</p>
        <Link to="/blog" className="text-xs font-bold uppercase tracking-widest border-b border-forest pb-1">
          Return to Journal
        </Link>
      </div>
    );
  }

  const authorDisplay = post.author?.name || post.author?.email || 'Editorial Team';
  const publishDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const related = blogs.filter((b) => b.id !== post.id).slice(0, 3);

  return (
    <article className="bg-cream min-h-screen pb-24">
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <img src={post.featured_image_url || fallbackHero} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-dark/55" />

        <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 py-8">
          <div className="flex items-center justify-between">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors">
              <ChevronLeft size={14} /> Back to Journal
            </Link>
            <button className="text-white/80 hover:text-white transition-colors">
              <Share2 size={16} />
            </button>
          </div>

          <div className="max-w-3xl">
            <p className="text-gold-light text-[11px] font-bold uppercase tracking-widest mb-4">Wine Article</p>
            <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-10">
        <div className="flex items-center gap-3 mb-12">
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: getAvatarColor(authorDisplay) }}
          >
            {getInitials(authorDisplay)}
          </span>
          <div>
            <p className="text-sm font-medium text-zinc-900">{authorDisplay}</p>
            <p className="text-xs text-zinc-400">{publishDate}</p>
          </div>
        </div>

        {post.excerpt && (
          <p className="text-xl font-serif text-zinc-900 leading-relaxed mb-10 italic border-l-2 border-gold pl-6">{post.excerpt}</p>
        )}

        <div className="space-y-6 text-lg text-zinc-700 font-light leading-relaxed">
          {post.content?.split('\n').map((paragraph, index) => {
            if (!paragraph.trim()) return null;
            if (index === 2) {
              return (
                <React.Fragment key={index}>
                  <img src={post.featured_image_url || fallbackHero} alt="" className="w-full aspect-video object-cover my-4" />
                  <p>{paragraph}</p>
                </React.Fragment>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-20">
          <h2 className="font-serif text-2xl text-zinc-900 mb-10">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {related.map((r) => (
              <Link key={r.id} to={`/blog/${r.slug}`} className="group block">
                <div className="aspect-[4/3] bg-white overflow-hidden mb-4">
                  <img
                    src={r.featured_image_url || fallbackHero}
                    alt={r.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-lg text-zinc-900 mb-2 group-hover:text-forest transition-colors">{r.title}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ backgroundColor: getAvatarColor(r.author?.name || r.id) }}
                  >
                    {getInitials(r.author?.name || 'W2U')}
                  </span>
                  <span className="text-xs text-zinc-500">{r.author?.name || 'Editorial Team'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetail;
