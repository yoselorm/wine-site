import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { saveTasteProfile } from '../../redux/tasteProfileSlice';
import {
  QUESTIONS,
  EXPERIENCE_MAP,
  COLOR_MAP,
  TANNIN_MAP,
  ACIDITY_MAP,
  DESSERT_SWEETNESS_MAP,
  DESSERT_LIKES_MAP,
  FRUIT_LIKES_MAP,
  BUDGET_MAP,
  isAdvancedOrExpert,
  isQuizComplete,
} from '../../utils/tasteQuizEngine';
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

const emptyForm = {
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
  quiz_answers: { dietary: [] },
};

const TasteProfileModal = ({ isOpen, onClose, existingProfile }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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
          quiz_answers: existingProfile.quiz_answers ? { ...existingProfile.quiz_answers } : { dietary: [] },
        });
      } else {
        setForm(emptyForm);
      }

      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
    }
  }, [isOpen, existingProfile]);

  if (!isOpen) return null;

  // ---- Quiz answer handlers: write straight into the shared form fields ----

  const answerSingle = (question, letter) => {
    setForm((prev) => {
      const next = { ...prev, quiz_answers: { ...prev.quiz_answers, [question.key]: letter } };

      switch (question.key) {
        case 'experience':
          next.experience_level = EXPERIENCE_MAP[letter];
          break;
        case 'color':
          next.wine_color = COLOR_MAP[letter] || [];
          break;
        case 'coffee':
          next.tannin_tolerance = TANNIN_MAP[letter];
          break;
        case 'lemon':
          next.acidity_preference = ACIDITY_MAP[letter];
          break;
        case 'dessert': {
          let sweetness = DESSERT_SWEETNESS_MAP[letter];
          if (letter === 'E' && isAdvancedOrExpert(prev.quiz_answers.experience)) {
            sweetness = 'bone-dry';
          }
          next.sweetness_tolerance = sweetness;
          const additions = (DESSERT_LIKES_MAP[letter] || []).filter((tag) => !prev.dislikes.includes(tag));
          next.likes = [...new Set([...prev.likes, ...additions])];
          break;
        }
        case 'fruit': {
          const additions = (FRUIT_LIKES_MAP[letter] || []).filter((tag) => !prev.dislikes.includes(tag));
          next.likes = [...new Set([...prev.likes, ...additions])];
          break;
        }
        case 'budget':
          next.budget_min = BUDGET_MAP[letter]?.min ?? '';
          next.budget_max = BUDGET_MAP[letter]?.max ?? '';
          break;
        default:
          break;
      }
      return next;
    });
  };

  const answerDietary = (value) => {
    setForm((prev) => {
      const current = prev.quiz_answers.dietary || [];
      const nextDietary = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return {
        ...prev,
        dietary_restrictions: nextDietary,
        quiz_answers: { ...prev.quiz_answers, dietary: nextDietary },
      };
    });
  };

  const answerDietaryNone = () => {
    setForm((prev) => ({
      ...prev,
      dietary_restrictions: [],
      quiz_answers: { ...prev.quiz_answers, dietary: [] },
    }));
  };

  // ---- Fine-tune handlers: directly edit the same fields ----

  const toggleInArray = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value],
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

  const answeredCount = QUESTIONS.filter((q) =>
    q.type === 'multi' ? Array.isArray(form.quiz_answers[q.key]) : !!form.quiz_answers[q.key]
  ).length;

  const complete = isQuizComplete(form.quiz_answers);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complete) {
      toast.error('Please answer all quiz questions before submitting');
      return;
    }
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
        typical_budget_per_bottle: { min: Number(form.budget_min) || 0, max: form.budget_max === '' ? null : Number(form.budget_max) },
        experience_level: form.experience_level,
        quiz_answers: form.quiz_answers,
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
        className={`bg-white w-full max-w-2xl relative z-50 rounded-xl shadow-2xl border border-zinc-100 flex flex-col max-h-[90vh] transition-all duration-300 ease-out ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-zinc-100 shrink-0">
          <div>
            <h2 className="text-2xl font-serif text-zinc-900 mb-1">Your Taste Profile</h2>
            <p className="text-xs text-zinc-400">
              {answeredCount} of {QUESTIONS.length} quiz questions answered — fine-tune anything below
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6">
          {/* ---- Section 1: The Quiz ---- */}
          <div className="space-y-9 mb-12">
            {QUESTIONS.map((question) => {
              const currentAnswer = form.quiz_answers[question.key];
              return (
                <div key={question.key}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[10px] font-bold text-zinc-300">Q{question.number}</span>
                    {question.subtitle && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{question.subtitle}</span>
                    )}
                  </div>
                  <h3 className="text-base font-serif text-zinc-900 mb-1">{question.title}</h3>
                  <p className="text-sm text-zinc-500 font-light mb-4">{question.prompt}</p>

                  <div className="space-y-2">
                    {question.type === 'single' &&
                      question.options.map((opt) => (
                        <button
                          type="button"
                          key={opt.letter}
                          onClick={() => answerSingle(question, opt.letter)}
                          className={`w-full flex items-center gap-3 text-left px-4 py-3 border rounded-lg text-sm transition-colors ${
                            currentAnswer === opt.letter
                              ? 'border-zinc-900 bg-zinc-50 text-zinc-900 font-medium'
                              : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                              currentAnswer === opt.letter ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 text-zinc-400'
                            }`}
                          >
                            {currentAnswer === opt.letter ? <Check size={12} /> : opt.letter}
                          </span>
                          {opt.label}
                        </button>
                      ))}

                    {question.type === 'multi' && (
                      <>
                        {question.options.map((opt) => {
                          const selected = (currentAnswer || []).includes(opt.value);
                          return (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => answerDietary(opt.value)}
                              className={`w-full flex items-center gap-3 text-left px-4 py-3 border rounded-lg text-sm transition-colors ${
                                selected
                                  ? 'border-zinc-900 bg-zinc-50 text-zinc-900 font-medium'
                                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                                  selected ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300'
                                }`}
                              >
                                {selected && <Check size={12} />}
                              </span>
                              {opt.label}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={answerDietaryNone}
                          className={`w-full text-left px-4 py-3 border rounded-lg text-sm transition-colors ${
                            Array.isArray(currentAnswer) && currentAnswer.length === 0
                              ? 'border-zinc-900 bg-zinc-50 text-zinc-900 font-medium'
                              : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'
                          }`}
                        >
                          None
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---- Section 2: Fine-tune (pre-filled from quiz, directly editable) ---- */}
          <div className="border-t border-zinc-100 pt-8 space-y-8">
            <div>
              <h3 className="text-base font-serif text-zinc-900 mb-1">Fine-tune Your Profile</h3>
              {/* <p className="text-sm text-zinc-500 font-light">
                These were set from your answers above — adjust anything that doesn't feel right.
              </p> */}
            </div>

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
              <p className="text-[11px] text-zinc-400 mb-3">Tap to like. Tap a liked tag again to mark it disliked instead.</p>
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
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-zinc-100 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!complete || saving}
            className="w-full bg-zinc-900 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-md disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : complete ? 'Save Taste Profile' : `Answer ${QUESTIONS.length - answeredCount} more quiz question${QUESTIONS.length - answeredCount === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TasteProfileModal;