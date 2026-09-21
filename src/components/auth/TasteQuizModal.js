// src/components/tasteProfile/TasteQuizModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveTasteProfile, fetchQuizQuestions } from '../../redux/tasteProfileSlice';
import { buildTasteProfilePayload, isQuizComplete } from '../../utils/tasteQuizEngine';
import toast from '../../components/Toast';

const TasteQuizModal = ({ isOpen, onClose, existingProfile }) => {
  const dispatch = useDispatch();
  const { quizQuestions, quizLoading, quizError } = useSelector((state) => state.tasteProfile);
  const [show, setShow] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && quizQuestions.length === 0 && !quizLoading) {
      dispatch(fetchQuizQuestions());
    }
  }, [isOpen, quizQuestions.length, quizLoading, dispatch]);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setShow(true));
      // Multi-select questions default to an empty array (not undefined) so "no
      // selections" reads as a real, deliberate answer rather than "unanswered".
      const multiDefaults = {};
      quizQuestions.forEach((q) => {
        if (q.input_type === 'multi') multiDefaults[q.key] = [];
      });
      setAnswers({ ...multiDefaults, ...(existingProfile?.quiz_answers || {}) });
      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
    }
  }, [isOpen, existingProfile, quizQuestions]);

  if (!isOpen) return null;

  const selectSingle = (questionKey, value) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  };

  const toggleMulti = (questionKey, value) => {
    setAnswers((prev) => {
      const current = prev[questionKey] || [];
      return {
        ...prev,
        [questionKey]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const selectNone = (questionKey) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: [] }));
  };

  const answeredCount = quizQuestions.filter((q) =>
    q.input_type === 'multi' ? Array.isArray(answers[q.key]) : !!answers[q.key]
  ).length;

  const complete = isQuizComplete(answers, quizQuestions);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complete) {
      toast.error('Please answer all questions before submitting');
      return;
    }
    setSubmitting(true);
    try {
      const payload = buildTasteProfilePayload(answers);
      await dispatch(saveTasteProfile(payload)).unwrap();
      toast.success('Taste profile saved');
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to save taste profile');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-zinc-100 shrink-0">
          <div>
            <h2 className="text-2xl font-serif text-zinc-900 mb-1">Taste Quiz</h2>
            {quizQuestions.length > 0 && (
              <p className="text-xs text-zinc-400">
                {answeredCount} of {quizQuestions.length} answered
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-forest transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        {quizLoading && quizQuestions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-forest" />
          </div>
        ) : quizError && quizQuestions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 px-8 text-center">
            <p className="text-sm text-wine mb-4">{quizError}</p>
            <button
              type="button"
              onClick={() => dispatch(fetchQuizQuestions())}
              className="text-xs font-bold uppercase tracking-widest text-forest border-b border-forest hover:text-forest-dark hover:border-forest-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-10">
            {quizQuestions.map((question, index) => {
              const currentAnswer = answers[question.key];
              return (
                <div key={question.key}>
                  <span className="text-[10px] font-bold text-zinc-300">
                    Q{index + 1} OF {quizQuestions.length}
                  </span>
                  <h3 className="text-base font-serif text-zinc-900 mt-1 mb-1">{question.prompt}</h3>
                  {question.help_text && (
                    <p className="text-xs text-zinc-400 font-light italic mb-4">{question.help_text}</p>
                  )}
                  {!question.help_text && <div className="mb-4" />}

                  <div className="space-y-2">
                    {question.input_type === 'single' &&
                      question.options.map((opt) => (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => selectSingle(question.key, opt.value)}
                          className={`w-full flex items-center gap-3 text-left px-4 py-3 border rounded-lg text-sm transition-colors ${
                            currentAnswer === opt.value
                              ? 'border-forest bg-cream text-forest font-medium'
                              : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                              currentAnswer === opt.value ? 'bg-forest border-forest text-white' : 'border-zinc-300 text-zinc-400'
                            }`}
                          >
                            {currentAnswer === opt.value ? <Check size={12} /> : opt.value}
                          </span>
                          {opt.label}
                        </button>
                      ))}

                    {question.input_type === 'multi' && (
                      <>
                        {question.options.map((opt) => {
                          const selected = (currentAnswer || []).includes(opt.value);
                          return (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => toggleMulti(question.key, opt.value)}
                              className={`w-full flex items-center gap-3 text-left px-4 py-3 border rounded-lg text-sm transition-colors ${
                                selected
                                  ? 'border-forest bg-cream text-forest font-medium'
                                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                                  selected ? 'bg-forest border-forest text-white' : 'border-zinc-300'
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
                          onClick={() => selectNone(question.key)}
                          className={`w-full text-left px-4 py-3 border rounded-lg text-sm transition-colors ${
                            Array.isArray(currentAnswer) && currentAnswer.length === 0
                              ? 'border-forest bg-cream text-forest font-medium'
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
          </form>
        )}

        <div className="px-8 py-5 border-t border-zinc-100 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!complete || submitting}
            className="w-full bg-forest text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300 rounded-md disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Saving...'
              : complete
              ? 'Save Taste Profile'
              : quizQuestions.length > 0
              ? `Answer ${quizQuestions.length - answeredCount} more question${quizQuestions.length - answeredCount === 1 ? '' : 's'}`
              : 'Loading...'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TasteQuizModal;
