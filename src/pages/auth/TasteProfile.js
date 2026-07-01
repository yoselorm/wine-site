import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wine, Pencil } from 'lucide-react';
import { fetchTasteProfile } from '../../redux/tasteProfileSlice';
import TasteProfileModal from '../../components/auth/TasteProfileModal';

const TasteProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.tasteProfile);
  const [modalOpen, setModalOpen] = useState(false);

  console.log(profile)

  useEffect(() => {
    dispatch(fetchTasteProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 animate-pulse space-y-6">
        <div className="h-8 w-64 bg-zinc-100" />
        <div className="h-40 bg-zinc-100" />
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

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">
        <div className="flex items-end justify-between mb-12 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-2">Taste Profile</h1>
            <p className="text-sm text-zinc-500 font-light">Used to personalize your recommendations</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest border border-zinc-900 px-5 py-3 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Pencil size={13} />
            {profile ? 'Edit' : 'Set Up'}
          </button>
        </div>

        {!profile ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-zinc-50 rounded-lg">
            <Wine size={40} strokeWidth={1} className="text-zinc-300 mb-6" />
            <h2 className="text-xl font-serif text-zinc-900 mb-3">No taste profile yet</h2>
            <p className="text-zinc-500 font-light max-w-sm mb-8">
              Tell us what you like and we'll tailor recommendations to your palate.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-zinc-900 text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Build My Profile
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Wine Color */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Wine Color</h4>
              <div className="flex flex-wrap gap-2">
                {profile.preferences?.wine_color?.length > 0 ? (
                  profile.preferences.wine_color.map((c) => (
                    <span key={c} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border border-zinc-200 rounded-full text-zinc-700 capitalize">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-400 text-sm">—</span>
                )}
              </div>
            </div>

            {/* Tannin / Acidity / Sweetness */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Tannin</h4>
                <p className="font-serif text-lg text-zinc-900 capitalize">{profile.preferences?.tannin_tolerance || '—'}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Acidity</h4>
                <p className="font-serif text-lg text-zinc-900 capitalize">{profile.preferences?.acidity_preference || '—'}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Sweetness</h4>
                <p className="font-serif text-lg text-zinc-900 capitalize">{profile.preferences?.sweetness_tolerance || '—'}</p>
              </div>
            </div>

            {/* Flavor likes/dislikes */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Flavor Notes</h4>
              <div className="space-y-3">
                {profile.flavor_profile?.likes?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-400 w-14">Likes</span>
                    {profile.flavor_profile.likes.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide bg-green-50 text-green-700 border border-green-200 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {profile.flavor_profile?.dislikes?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-400 w-14">Dislikes</span>
                    {profile.flavor_profile.dislikes.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide bg-red-50 text-red-600 border border-red-200 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dietary restrictions */}
            {profile.dietary_restrictions?.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Dietary Restrictions</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.dietary_restrictions.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border border-zinc-200 rounded-full text-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Budget & Experience */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Typical Budget</h4>
                <p className="font-serif text-lg text-zinc-900">
                  GHS {profile.typical_budget_per_bottle?.min || 0} – {profile.typical_budget_per_bottle?.max || 0}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Experience Level</h4>
                <p className="font-serif text-lg text-zinc-900 capitalize">{profile.experience_level || '—'}</p>
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
    </>
  );
};

export default TasteProfile;