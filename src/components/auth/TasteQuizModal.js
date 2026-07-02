// src/components/tasteProfile/TasteQuizModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { saveTasteProfile } from '../../redux/tasteProfileSlice';
import { QUESTIONS, buildTasteProfilePayload, isQuizComplete } from '../../utils/tasteQuizEngine';
import toast from '../../components/Toast';

const TasteQuizModal = ({ isOpen, onClose, existingProfile }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [answers, setAnswers] = useState({ dietary: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setShow(true));
      setAnswers(existingProfile?.quiz_answers ? { ...existingProfile.quiz_answers } : { dietary: [] });
      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
    }
  }, [isOpen, existingProfile]);

  if (!isOpen) return null;

  const selectSingle = (questionKey, letter) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: letter }));
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

  const answeredCount = QUESTIONS.filter((q) =>
    q.type === 'multi' ? Array.isArray(answers[q.key]) : !!answers[q.key]
  ).length;

  const complete = isQuizComplete(answers);

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
            <p className="text-xs text-zinc-400">
              {answeredCount} of {QUESTIONS.length} answered
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-10">
          {QUESTIONS.map((question) => {
            const currentAnswer = answers[question.key];
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
                        onClick={() => selectSingle(question.key, opt.letter)}
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
                            onClick={() => toggleMulti(question.key, opt.value)}
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
                        onClick={() => selectNone(question.key)}
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
        </form>

        <div className="px-8 py-5 border-t border-zinc-100 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!complete || submitting}
            className="w-full bg-zinc-900 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-md disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : complete ? 'Save Taste Profile' : `Answer ${QUESTIONS.length - answeredCount} more question${QUESTIONS.length - answeredCount === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TasteQuizModal;