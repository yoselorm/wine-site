import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Send, Wine, Plus, ThumbsUp, ThumbsDown, ArrowLeft, MessageSquare } from 'lucide-react';
import {
  sendSommelierMessage,
  fetchSommelierHistory,
  submitSommelierFeedback,
  startNewSession,
} from '../../redux/sommelierSlice';
import { addToCart } from '../../redux/cartSlice';
import toast from '../../components/Toast';

// Renders assistant text with a typewriter effect, once, on mount.
const TypingText = ({ text, speed = 18, onDone }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayed}</>;
};

const Sommelier = () => {
  const dispatch = useDispatch();
  const { sessionId, messages, history, historyLoading, loading, error } = useSelector((state) => state.sommelier);

  const [prompt, setPrompt] = useState('');
  const [viewingHistoryItem, setViewingHistoryItem] = useState(null);
  const scrollRef = useRef(null);
  const lastAnimatedIndex = useRef(-1);

  useEffect(() => {
    dispatch(fetchSommelierHistory());
    if (!sessionId) {
      dispatch(startNewSession());
    }
  }, [dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setViewingHistoryItem(null);
    dispatch(sendSommelierMessage({ session_id: sessionId, prompt: trimmed }));
    setPrompt('');
  };

  const handleFeedback = (recommendation_log_id, feedback) => {
    dispatch(submitSommelierFeedback({ recommendation_log_id, feedback }))
      .unwrap()
      .then(() => toast.success('Thanks for the feedback'))
      .catch((err) => toast.error(err || 'Failed to submit feedback'));
  };

  const handleAddToCart = (wine) => {
    dispatch(addToCart({
      id: wine.id,
      name: wine.name,
      price: wine.sale_price || wine.price,
      image_url: wine.image_url,
      quantity: 1,
    }));
    toast.success(`${wine.name} added to cart`);
  };

  const handleNewSession = () => {
    setViewingHistoryItem(null);
    dispatch(startNewSession());
  };

  const handleViewHistoryItem = (item) => {
    setViewingHistoryItem(item);
  };

  const suggestedPrompts = [
    'What goes well with Jollof rice?',
    'Recommend something under GHS 100',
    'I like fruity reds, any suggestions?',
  ];

  return (
    <div className="flex h-[calc(100vh-6rem)] max-w-7xl mx-auto">
      {/* Sidebar: History */}
      <aside className="w-72 shrink-0 border-r border-zinc-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-200">
          <button
            onClick={handleNewSession}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            <Plus size={14} /> New Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-2 mb-3">
            Past Recommendations {history.length > 0 && `(${history.length})`}
          </h4>

          {historyLoading ? (
            <div className="space-y-3 animate-pulse px-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-zinc-100 rounded" />)}
            </div>
          ) : history.length === 0 ? (
            <p className="text-xs text-zinc-400 px-2 font-light">No past recommendations yet.</p>
          ) : (
            <div className="space-y-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleViewHistoryItem(item)}
                  className={`flex items-start gap-3 px-2 py-3 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer ${
                    viewingHistoryItem?.id === item.id ? 'bg-zinc-100' : ''
                  }`}
                >
                  <MessageSquare size={14} className="text-zinc-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-serif text-zinc-900 truncate">{item.product?.name}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      GHS {Number(item.product?.sale_price || item.product?.price || 0).toFixed(2)}
                      {' · '}
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleFeedback(item.id, 'liked')}
                      className={`p-1 rounded transition-colors ${item.user_feedback === 'liked' ? 'text-green-600' : 'text-zinc-300 hover:text-zinc-600'}`}
                    >
                      <ThumbsUp size={12} />
                    </button>
                    <button
                      onClick={() => handleFeedback(item.id, 'disliked')}
                      className={`p-1 rounded transition-colors ${item.user_feedback === 'disliked' ? 'text-red-500' : 'text-zinc-300 hover:text-zinc-600'}`}
                    >
                      <ThumbsDown size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-4 px-8 py-6 border-b border-zinc-200">
          <Link to="/shop" className="md:hidden text-zinc-400 hover:text-zinc-900">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
            <Wine size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl text-zinc-900">Virtual Sommelier</h1>
            <p className="text-xs text-zinc-400 font-light">Ask about pairings, styles, or a bottle for any occasion</p>
          </div>
        </div>

        {viewingHistoryItem ? (
          /* Read-only view of a past recommendation */
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8">
            <div className="w-full max-w-md">
              <button
                onClick={() => setViewingHistoryItem(null)}
                className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 mb-6 flex items-center gap-1"
              >
                <ArrowLeft size={12} /> Back to Live Chat
              </button>

              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-3">
                Recommended on {new Date(viewingHistoryItem.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <div className="border border-zinc-200 rounded-lg p-4 flex gap-4">
                <div className="w-16 h-24 bg-zinc-100 shrink-0 rounded" />
                <div className="flex-1">
                  <p className="font-serif text-lg text-zinc-900">{viewingHistoryItem.product?.name}</p>
                  <p className="text-sm text-zinc-400 mb-1">
                    GHS {Number(viewingHistoryItem.product?.sale_price || viewingHistoryItem.product?.price || 0).toFixed(2)}
                  </p>
                  {viewingHistoryItem.product?.short_description && (
                    <p className="text-xs text-zinc-500 font-light mb-3 line-clamp-2">
                      {viewingHistoryItem.product.short_description}
                    </p>
                  )}
                  <Link
                    to={`/shop/${viewingHistoryItem.product?.slug}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-900 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs text-zinc-400">Your feedback:</span>
                <button
                  onClick={() => handleFeedback(viewingHistoryItem.id, 'liked')}
                  className={`p-1.5 rounded transition-colors ${viewingHistoryItem.user_feedback === 'liked' ? 'text-green-600' : 'text-zinc-300 hover:text-zinc-600'}`}
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  onClick={() => handleFeedback(viewingHistoryItem.id, 'disliked')}
                  className={`p-1.5 rounded transition-colors ${viewingHistoryItem.user_feedback === 'disliked' ? 'text-red-500' : 'text-zinc-300 hover:text-zinc-600'}`}
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Live messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Wine size={40} strokeWidth={1} className="text-zinc-300 mb-6" />
                  <h2 className="font-serif text-2xl text-zinc-900 mb-2">Ask your sommelier anything</h2>
                  <p className="text-zinc-500 font-light max-w-sm mb-8">
                    From food pairings to budget picks, I'm here to help you find the right bottle.
                  </p>
                  <div className="flex flex-col gap-2 w-full max-w-sm">
                    {suggestedPrompts.map((sp) => (
                      <button
                        key={sp}
                        onClick={() => setPrompt(sp)}
                        className="text-left px-4 py-3 border border-zinc-200 rounded-lg text-sm text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => {
                const isLatestAssistant = msg.role === 'assistant' && i === messages.length - 1 && lastAnimatedIndex.current < i;

                return (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${msg.role === 'user' ? '' : 'w-full'}`}>
                      <div
                        className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-zinc-900 text-white rounded-br-sm'
                            : 'bg-zinc-50 text-zinc-800 rounded-bl-sm font-light'
                        }`}
                      >
                        {msg.role === 'assistant' && isLatestAssistant ? (
                          <TypingText
                            text={msg.content}
                            onDone={() => { lastAnimatedIndex.current = i; }}
                          />
                        ) : (
                          msg.content
                        )}
                      </div>

                      {msg.recommendations?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          {msg.recommendations.map((wine) => (
                            <div key={wine.id} className="border border-zinc-200 rounded-lg p-3 flex gap-3">
                              <div className="w-14 h-20 bg-zinc-100 shrink-0 overflow-hidden rounded">
                                {wine.image_url && <img src={wine.image_url} alt={wine.name} className="w-full h-full object-cover" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-serif text-sm text-zinc-900 truncate">{wine.name}</p>
                                <p className="text-xs text-zinc-400 mb-2">GHS {Number(wine.price).toFixed(2)}</p>
                                <button
                                  onClick={() => handleAddToCart(wine)}
                                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-900 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.role === 'assistant' && msg.recommendation_log_id && (
                        <div className="flex items-center gap-3 mt-2 px-1">
                          <span className="text-[10px] text-zinc-400">Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(msg.recommendation_log_id, 'liked')}
                            className={`p-1 rounded transition-colors ${msg.feedback === 'liked' ? 'text-green-600' : 'text-zinc-300 hover:text-zinc-600'}`}
                          >
                            <ThumbsUp size={13} />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.recommendation_log_id, 'disliked')}
                            className={`p-1 rounded transition-colors ${msg.feedback === 'disliked' ? 'text-red-500' : 'text-zinc-300 hover:text-zinc-600'}`}
                          >
                            <ThumbsDown size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-50 px-5 py-3 rounded-2xl rounded-bl-sm flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center">
                  <p className="text-xs text-red-500">{error}</p>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSend} className="border-t border-zinc-200 px-8 py-5 flex items-center gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about a pairing, occasion, or budget..."
                className="flex-1 px-4 py-3 border border-zinc-200 rounded-full text-sm focus:outline-none focus:border-zinc-900 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-11 h-11 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default Sommelier;