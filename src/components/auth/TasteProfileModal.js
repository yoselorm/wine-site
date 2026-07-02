// src/components/tasteProfile/TasteProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { saveTasteProfile } from '../../redux/tasteProfileSlice';
import toast from '../../components/Toast';

const WINE_COLORS = ['red', 'white', 'rose', 'sparkling'];
const TANNIN_OPTIONS = ['low', 'medium', 'high'];
const ACIDITY_OPTIONS = ['low', 'medium', 'high'];
const SWEETNESS_OPTIONS = ['bone-dry', 'dry', 'off-dry', 'medium-sweet', 'sweet'];
const EXPERIENCE_OPTIONS = ['beginner', 'intermediate', 'advanced', 'expert'];
const DIETARY_OPTIONS = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'organic', label: 'Organic / Biodynamic' },
  { value: 'low-sulfite', label: 'Low Sulfite' },
];
const FLAVOR_TAGS = [
  'black-fruit', 'red-fruit', 'citrus-fruit', 'stone-fruit', 'tropical-fruit', 'jammy',
  'chocolate', 'earthy', 'rich', 'vanilla', 'buttery', 'spice', 'caramel', 'honey',
  'savory', 'oaky', 'floral', 'herbal', 'bitter', 'smoky',
];

const TasteProfileModal = ({ isOpen, onClose, existingProfile }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    wine_color: [],
    tannin_tolerance: '',
    acidity_preference: '',
    sweetness_tolerance: '',
    likes: [],
    dislikes: [],
    dietary_restrictions: [],
    budget_min: '',
    budget_max: '',
    experience_level: '',
  });

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setShow(true));

      if (existingProfile) {
        setForm({
          wine_color: existingProfile.preferences?.wine_color || [],
          tannin_tolerance: existingProfile.preferences?.tannin_tolerance || '',
          acidity_preference: existingProfile.preferences?.acidity_preference || '',
          sweetness_tolerance: existingProfile.preferences?.sweetness_tolerance || '',
          likes: existingProfile.flavor_profile?.likes || [],
          dislikes: existingProfile.flavor_profile?.dislikes || [],
          dietary_restrictions: existingProfile.dietary_restrictions || [],
          budget_min: existingProfile.typical_budget_per_bottle?.min ?? '',
          budget_max: existingProfile.typical_budget_per_bottle?.max ?? '',
          experience_level: existingProfile.experience_level || '',
        });
      }

      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
    }
  }, [isOpen, existingProfile]);

  if (!isOpen) return null;

  const toggleInArray = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const toggleFlavor = (field, value) => {
    const opposite = field === 'likes' ? 'dislikes' : 'likes';
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value],
      [opposite]: prev[opposite].filter((v) => v !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(saveTasteProfile({
        preferences: {
          wine_color: form.wine_color,
          tannin_tolerance: form.tannin_tolerance,
          acidity_preference: form.acidity_preference,
          sweetness_tolerance: form.sweetness_tolerance,
        },
        flavor_profile: { likes: form.likes, dislikes: form.dislikes },
        dietary_restrictions: form.dietary_restrictions,
        typical_budget_per_bottle: {
          min: Number(form.budget_min) || 0,
          max: form.budget_max === '' ? null : Number(form.budget_max),
        },
        experience_level: form.experience_level,
        quiz_answers: existingProfile?.quiz_answers || {},
      })).unwrap();
      toast.success('Taste profile saved');
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to save taste profile');
    } finally {
      setSaving(false);
    }
  };

  const Pill = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border rounded-full transition-colors capitalize ${
        active ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
      }`}
    >
      {children}
    </button>
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div
        className={`bg-white w-full max-w-lg p-8 relative z-50 rounded-xl shadow-2xl border border-zinc-100 max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors">
          <X size={18} />
        </button>

        <h2 className="text-2xl font-serif mb-1">Fine-tune Your Profile</h2>
        <p className="text-xs text-zinc-400 mb-8">Directly adjust any preference</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Wine Color</h4>
            <div className="flex flex-wrap gap-2">
              {WINE_COLORS.map((opt) => (
                <Pill key={opt} active={form.wine_color.includes(opt)} onClick={() => toggleInArray('wine_color', opt)}>
                  {opt}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Tannin Tolerance</h4>
            <div className="grid grid-cols-3 gap-2">
              {TANNIN_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setForm((p) => ({ ...p, tannin_tolerance: opt }))}
                  className={`py-2 text-[11px] font-bold uppercase tracking-wide border rounded-md transition-colors capitalize ${
                    form.tannin_tolerance === opt ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Acidity Preference</h4>
            <div className="grid grid-cols-3 gap-2">
              {ACIDITY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setForm((p) => ({ ...p, acidity_preference: opt }))}
                  className={`py-2 text-[11px] font-bold uppercase tracking-wide border rounded-md transition-colors capitalize ${
                    form.acidity_preference === opt ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Sweetness Tolerance</h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SWEETNESS_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setForm((p) => ({ ...p, sweetness_tolerance: opt }))}
                  className={`py-2 text-[10px] font-bold uppercase tracking-wide border rounded-md transition-colors capitalize ${
                    form.sweetness_tolerance === opt ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Flavor Notes</h4>
            <p className="text-[11px] text-zinc-400 mb-3">Tap to like. Tap a liked tag again to mark it disliked.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {FLAVOR_TAGS.map((tag) => {
                const isLiked = form.likes.includes(tag);
                const isDisliked = form.dislikes.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleFlavor(isDisliked ? 'likes' : isLiked ? 'dislikes' : 'likes', tag)}
                    className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border rounded-full transition-colors ${
                      isLiked
                        ? 'bg-green-50 text-green-700 border-green-300'
                        : isDisliked
                        ? 'bg-red-50 text-red-600 border-red-300 line-through'
                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-zinc-500"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Liked</span>
              <span className="flex items-center gap-1.5 text-zinc-500"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Disliked</span>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Dietary Restrictions</h4>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((opt) => (
                <Pill
                  key={opt.value}
                  active={form.dietary_restrictions.includes(opt.value)}
                  onClick={() => toggleInArray('dietary_restrictions', opt.value)}
                >
                  {opt.label}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Typical Budget Per Bottle (GHS)</h4>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                value={form.budget_min}
                onChange={(e) => setForm((p) => ({ ...p, budget_min: e.target.value }))}
                className="w-full p-3 border border-zinc-200 text-sm rounded-md focus:outline-none focus:border-zinc-900 transition-colors"
              />
              <span className="text-zinc-300">—</span>
              <input
                type="number"
                placeholder="No max"
                value={form.budget_max}
                onChange={(e) => setForm((p) => ({ ...p, budget_max: e.target.value }))}
                className="w-full p-3 border border-zinc-200 text-sm rounded-md focus:outline-none focus:border-zinc-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Experience Level</h4>
            <select
              value={form.experience_level}
              onChange={(e) => setForm((p) => ({ ...p, experience_level: e.target.value }))}
              className="w-full border-b border-zinc-300 py-2 bg-transparent outline-none cursor-pointer text-sm text-zinc-800 hover:border-zinc-900 transition-colors capitalize"
            >
              <option value="">Select level</option>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="capitalize">{opt}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-zinc-900 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Taste Profile'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default TasteProfileModal;