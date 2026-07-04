// src/pages/blog/Blog.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../../services/Api';
import { api_url } from '../../utils/config';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get(`${api_url}/v1/blogs`);
        // Adjust depending on your API's exact pagination structure (e.g., response.data.data)
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
      <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse">
        <div className="h-12 w-64 bg-zinc-200 mb-16 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-64 bg-zinc-200 w-full"></div>
              <div className="h-4 bg-zinc-200 w-24"></div>
              <div className="h-6 bg-zinc-200 w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-24 text-red-500 font-serif text-xl">{error}</div>;
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen pb-24">
      {/* Header */}
      <div className="pt-24 pb-16 px-6 text-center max-w-3xl mx-auto">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-6">The Cellar Journal</h4>
        <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-6">
          Notes on culture, regions, and the art of winemaking.
        </h1>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {blogs.map((post) => (
            <article key={post.id} className="group flex flex-col">
              <Link to={`/blog/${post.slug}`} className="block mb-6 overflow-hidden bg-zinc-100 aspect-[4/3]">
                <img 
                  src={post.image_url || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80'} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                {post.category && (
                  <>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                    <span>{post.category.name}</span>
                  </>
                )}
              </div>

              <Link to={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-serif text-zinc-900 mb-3 group-hover:text-zinc-600 transition-colors">
                  {post.title}
                </h2>
              </Link>

              <p className="text-zinc-600 font-light text-sm line-clamp-3 mb-6 flex-1">
                {post.excerpt || post.content?.substring(0, 150) + '...'}
              </p>

              <Link 
                to={`/blog/${post.slug}`} 
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-900 mt-auto hover:text-zinc-500 transition-colors"
              >
                Read Article <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;