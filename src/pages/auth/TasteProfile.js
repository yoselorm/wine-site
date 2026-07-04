import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wine, Pencil, Grape, Sparkles as SparklesIcon, Wallet, GraduationCap, Heart, HeartCrack } from 'lucide-react';
import { fetchTasteProfile, selectIsTasteProfileComplete } from '../../redux/tasteProfileSlice';
import TasteProfileModal from '../../components/auth/TasteProfileModal';
import TasteQuizModal from '../../components/auth/TasteQuizModal';

const WINE_COLOR_STYLES = {
  red: 'bg-red-900',
  white: 'bg-amber-100 border border-amber-200',
  rose: 'bg-rose-300',
  sparkling: 'bg-yellow-200 border border-yellow-300',
};

const TANNIN_LEVELS = ['low', 'medium', 'high'];
const ACIDITY_LEVELS = ['low', 'medium', 'high'];
const SWEETNESS_LEVELS = ['bone-dry', 'dry', 'off-dry', 'medium-sweet', 'sweet'];

const ScaleBar = ({ levels, value, label }) => {
  const activeIndex = levels.indexOf(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</h4>
        <span className="text-xs font-bold text-zinc-900 capitalize">{value ? value.replace('-', ' ') : '—'}</span>
      </div>
      <div className="flex gap-1">
        {levels.map((level, i) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              activeIndex >= 0 && i <= activeIndex ? 'bg-zinc-900' : 'bg-zinc-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const TasteProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.tasteProfile);
  const [modalOpen, setModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const isComplete = useSelector(selectIsTasteProfileComplete);

  useEffect(() => {
    dispatch(fetchTasteProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 animate-pulse space-y-6">
        <div className="h-8 w-64 bg-zinc-100" />
        <div className="h-40 bg-zinc-100 rounded-lg" />
        <div className="h-40 bg-zinc-100 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => dispatch(fetchTasteProfile())} className="text-xs font-bold uppercase tracking-widest border-b border-zinc-900 pb-1">
          Try Again
        </button>
      </div>
    );
  }

  const budgetMax = profile?.typical_budget_per_bottle?.max;
  const budgetMin = profile?.typical_budget_per_bottle?.min;

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">
        <div className="flex items-end justify-between mb-12 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-2">Taste Profile</h1>
            <p className="text-sm text-zinc-500 font-light">Used to personalize your recommendations</p>
          </div>
         {isComplete && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest border border-zinc-900 px-5 py-3 hover:bg-zinc-900 hover:text-white transition-colors shrink-0"
          >
            <Pencil size={13} />
            {profile ? 'Edit' : 'Set Up'}
          </button>)}
        </div>

        {!isComplete ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-zinc-50 rounded-lg">
            <Wine size={40} strokeWidth={1} className="text-zinc-300 mb-6" />
            <h2 className="text-xl font-serif text-zinc-900 mb-3">No taste profile yet</h2>
            <p className="text-zinc-500 font-light max-w-sm mb-8">
              Tell us what you like and we'll tailor recommendations to your palate.
            </p>
            <button
              onClick={() => setQuizModalOpen(true)}
              className="bg-zinc-900 text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Build My Profile
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Wine Color + Experience — top summary card */}
            <div className="bg-zinc-900 rounded-xl p-8 flex items-center justify-between text-white">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap size={14} className="text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {profile.experience_level || 'Palate'} Drinker
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {profile.preferences?.wine_color?.length > 0 ? (
                    profile.preferences.wine_color.map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${WINE_COLOR_STYLES[c] || 'bg-zinc-500'}`} />
                        <span className="text-sm capitalize font-serif">{c}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-zinc-400 text-sm">No preference set</span>
                  )}
                </div>
              </div>
              <Grape size={36} strokeWidth={1} className="text-zinc-600 shrink-0" />
            </div>

            {/* Palate scales */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <SparklesIcon size={14} className="text-zinc-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Palate Profile</h3>
              </div>
              <div className="space-y-6">
                <ScaleBar levels={TANNIN_LEVELS} value={profile.preferences?.tannin_tolerance} label="Tannin" />
                <ScaleBar levels={ACIDITY_LEVELS} value={profile.preferences?.acidity_preference} label="Acidity" />
                <ScaleBar levels={SWEETNESS_LEVELS} value={profile.preferences?.sweetness_tolerance} label="Sweetness" />
              </div>
            </div>

            {/* Flavor likes/dislikes */}
            {(profile.flavor_profile?.likes?.length > 0 || profile.flavor_profile?.dislikes?.length > 0) && (
              <div className="bg-white border border-zinc-200 rounded-xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Wine size={14} className="text-zinc-400" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Flavor Notes</h3>
                </div>
                <div className="space-y-5">
                  {profile.flavor_profile?.likes?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Heart size={12} className="text-green-600 fill-green-600" />
                        <span className="text-xs font-bold text-zinc-700">Enjoys</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.flavor_profile.likes.map((tag) => (
                          <span key={tag} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide bg-green-50 text-green-700 border border-green-200 rounded-full capitalize">
                            {tag.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.flavor_profile?.dislikes?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <HeartCrack size={12} className="text-red-500" />
                        <span className="text-xs font-bold text-zinc-700">Avoids</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.flavor_profile.dislikes.map((tag) => (
                          <span key={tag} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide bg-red-50 text-red-600 border border-red-200 rounded-full capitalize">
                            {tag.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dietary restrictions */}
            {profile.dietary_restrictions?.length > 0 && (
              <div className="bg-white border border-zinc-200 rounded-xl p-8">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Dietary Restrictions</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.dietary_restrictions.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border border-zinc-200 rounded-full text-zinc-700 capitalize">
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Budget */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center shrink-0">
                <Wallet size={18} className="text-zinc-500" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Typical Budget Per Bottle</h4>
                <p className="font-serif text-2xl text-zinc-900">
                  GHS {budgetMin ?? 0}
                  {budgetMax != null ? ` – ${budgetMax}` : '+'}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      <TasteProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        existingProfile={profile}
      />
      <TasteQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        existingProfile={profile}
      />
    </>
  );
};

export default TasteProfile;