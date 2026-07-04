import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Share2 } from 'lucide-react';
import api from '../../services/Api';
import { api_url } from '../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogBySlug } from '../../redux/catalogSlice';

const BlogDetail = () => {
  const { id:slug } = useParams();
const {selectedBlog:post, loading, error} = useSelector((state) => state.catalog);
  const dispatch = useDispatch()

  useEffect(() => {
  dispatch(fetchBlogBySlug(slug)
   
  );
  }, [slug]);

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
        <p className="text-red-500 font-serif text-xl mb-6">{error}</p>
        <Link to="/blog" className="text-xs font-bold uppercase tracking-widest border-b border-zinc-900 pb-1">
          Return to Journal
        </Link>
      </div>
    );
  }

  // Parse the stringified tags array safely
  let parsedTags = [];
  try {
    if (post.tags) {
      parsedTags = JSON.parse(post.tags);
    }
  } catch (e) {
    console.error("Failed to parse tags", e);
  }

  // Handle author display (fallback to email if name is null)
  const authorDisplay = post.author?.name || post.author?.email || 'Editorial Team';
  
  // Format the date
  const publishDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  });

  return (
    <article className="bg-[#FDFBF7] min-h-screen pb-24">
      
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-8 flex items-center justify-between">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
          <ChevronLeft size={14} /> Back to Journal
        </Link>
        <button className="text-zinc-500 hover:text-zinc-900 transition-colors">
          <Share2 size={16} />
        </button>
      </div>

      {/* Article Header */}
      <header className="max-w-3xl mx-auto px-6 text-center mb-12">
        <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
          <span>{post.type}</span>
          <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
          <span>{publishDate}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-zinc-900 leading-tight mb-8">
          {post.title}
        </h1>
        
        <p className="text-sm font-light text-zinc-600">
          Words by <span className="font-medium text-zinc-900">{authorDisplay}</span>
        </p>
      </header>

      {/* Featured Image or Video */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-zinc-100 overflow-hidden relative">
          {post.video_url ? (
            <video 
              src={post.video_url} 
              controls 
              className="w-full h-full object-cover"
              poster={post.featured_image_url}
            />
          ) : (
            <img 
              src={post.featured_image_url || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80'} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-2xl mx-auto px-6">
        {/* Render excerpt as an introductory lead paragraph */}
        {post.excerpt && (
          <p className="text-xl font-serif text-zinc-900 leading-relaxed mb-10 italic border-l-2 border-zinc-900 pl-6">
            {post.excerpt}
          </p>
        )}

        {/* Split the plain text content by newlines and map to paragraphs */}
        <div className="space-y-6 text-lg text-zinc-700 font-light leading-relaxed">
          {post.content?.split('\n').map((paragraph, index) => {
            // Skip empty strings caused by multiple newlines
            if (!paragraph.trim()) return null;
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      </div>

      {/* Footer Tags */}
      {parsedTags.length > 0 && (
        <div className="max-w-2xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-200">
          <div className="flex flex-wrap gap-2">
            {parsedTags.map((tag, index) => (
              <span key={index} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-zinc-100 text-zinc-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

    </article>
  );
};

export default BlogDetail;