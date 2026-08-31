import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';
import { api_url } from '../../utils/config';
import SectionBanner from '../../components/public/shared/SectionBanner';
import { getInitials, getAvatarColor } from '../../utils/placeholders';
import fallbackHero from '../../assets/images/fallbackbloghero.jpg';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get(`${api_url}/v1/blogs`);
        setBlogs(response.data?.data || response.data || []);
      } catch (err) {
        setError('Failed to load the journal entries.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <SectionBanner title="Our Blog" />
        <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse">
          <div className="h-96 w-full bg-zinc-200 mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-48 bg-zinc-200 w-full"></div>
                <div className="h-4 bg-zinc-200 w-24"></div>
                <div className="h-6 bg-zinc-200 w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cream min-h-screen">
        <SectionBanner title="Our Blog" />
        <div className="text-center py-24 text-wine font-serif text-xl">{error}</div>
      </div>
    );
  }

  const [featured, ...rest] = blogs;

  return (
    <div className="bg-cream min-h-screen">
      <SectionBanner title="Our Blog" breadcrumbs={[{ label: 'Be informed about our latest findings and wine tutorials' }]} />

      {featured && (
        <Link to={`/blog/${featured.slug}`} className="block relative h-[50vh] min-h-[360px] overflow-hidden group">
          <img
            src={featured.featured_image_url || fallbackHero}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-forest-dark/50" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
            <p className="text-gold-light text-[11px] font-bold uppercase tracking-widest mb-3">Featured Story</p>
            <p className="text-cream/70 text-xs mb-2">
              {new Date(featured.published_at || featured.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <h2 className="font-serif text-2xl md:text-4xl text-white max-w-2xl">{featured.title}</h2>
          </div>
          <span
            className="absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: getAvatarColor(featured.author?.name || 'W2U') }}
          >
            {getInitials(featured.author?.name || 'W2U')}
          </span>
        </Link>
      )}

      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl text-zinc-900 mb-14 text-center">Wine News From Around The Globe</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-10">
          {(rest.length > 0 ? rest : blogs).map((post) => (
            <article key={post.id} className="group flex flex-col">
              <Link to={`/blog/${post.slug}`} className="block mb-5 overflow-hidden bg-white aspect-[4/3]">
                <img
                  src={post.featured_image_url || fallbackHero}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>

              <Link to={`/blog/${post.slug}`}>
                <h3 className="font-serif text-lg text-zinc-900 mb-2 group-hover:text-forest transition-colors">{post.title}</h3>
              </Link>

              <p className="text-zinc-500 font-light text-sm line-clamp-2 mb-4 flex-1">
                {post.excerpt || post.content?.substring(0, 120) + '...'}
              </p>

              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: getAvatarColor(post.author?.name || post.id) }}
                >
                  {getInitials(post.author?.name || 'W2U')}
                </span>
                <span className="text-xs text-zinc-500">{post.author?.name || 'Editorial Team'}</span>
              </div>
            </article>
          ))}
        </div>

        {blogs.length > 0 && (
          <div className="flex justify-center mt-16">
            <button className="border border-forest text-forest px-10 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white transition-colors">
              Read More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
