import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { saveTasteProfile } from '../../redux/tasteProfileSlice';
import { QUESTIONS, buildTasteProfilePayload } from '../../utils/tasteQuizEngine';
import toast from '../Toast';

const TasteQuizModal = ({ isOpen, onClose, existingProfile }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({ dietary: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setShow(true));
      setStepIndex(0);
      // Pre-fill from existing quiz_answers if retaking
      setAnswers(existingProfile?.quiz_answers ? { ...existingProfile.quiz_answers } : { dietary: [] });
      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
    }
  }, [isOpen, existingProfile]);

  if (!isOpen) return null;

  const question = QUESTIONS[stepIndex];
  const isLastStep = stepIndex === QUESTIONS.length - 1;
  const currentAnswer = answers[question.key];
  const hasAnswer = question.type === 'multi' ? Array.isArray(currentAnswer) : !!currentAnswer;

  const selectSingle = (letter) => {
    setAnswers((prev) => ({ ...prev, [question.key]: letter }));
  };

  const toggleMulti = (value) => {
    setAnswers((prev) => {
      const current = prev[question.key] || [];
      return {
        ...prev,
        [question.key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const selectNone = () => {
    setAnswers((prev) => ({ ...prev, [question.key]: [] }));
  };

  const goNext = () => {
    if (!hasAnswer) return;
    if (isLastStep) {
      handleFinish();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleFinish = async () => {
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

  const progress = ((stepIndex + 1) / QUESTIONS.length) * 100;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div
        className={`bg-white w-full max-w-lg relative z-50 rounded-xl shadow-2xl border border-zinc-100 flex flex-col max-h-[90vh] transition-all duration-300 ease-out ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        {/* Progress bar */}
        <div className="h-1 bg-zinc-100 rounded-t-xl overflow-hidden">
          <div
            className="h-full bg-zinc-900 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Question {stepIndex + 1} of {QUESTIONS.length}
          </span>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Question content */}
        <div className="px-8 py-6 flex-1 overflow-y-auto">
          {question.subtitle && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">{question.subtitle}</p>
          )}
          <h2 className="text-xl font-serif text-zinc-900 mb-1">{question.title}</h2>
          <p className="text-sm text-zinc-500 font-light mb-6">{question.prompt}</p>

          <div className="space-y-2">
            {question.type === 'single' &&
              question.options.map((opt) => (
                <button
                  key={opt.letter}
                  onClick={() => selectSingle(opt.letter)}
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
                      key={opt.value}
                      onClick={() => toggleMulti(opt.value)}
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
                  onClick={selectNone}
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

        {/* Footer nav */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-zinc-100">
          <button
            onClick={goBack}
            disabled={stepIndex === 0}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-0"
          >
            <ChevronLeft size={14} /> Back
          </button>

          <button
            onClick={goNext}
            disabled={!hasAnswer || submitting}
            className="flex items-center gap-1 bg-zinc-900 text-white px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed rounded-md"
          >
            {isLastStep ? (submitting ? 'Saving...' : 'Finish') : 'Next'}
            {!isLastStep && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TasteQuizModal;