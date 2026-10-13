import React, { useRef, useState } from 'react';
import { AvatarKey, ScreenType } from '../types';
import { AVATARS } from '../data/gameData';
import { playTapSound, playMoveSound } from '../utils/audio';
import { speakShort } from '../utils/speech';
import { ArrowRight, Volume2, Sparkles, Terminal, BookOpen, Check } from 'lucide-react';

interface StartScreenProps {
  childName: string;
  setChildName: (name: string) => void;
  needsName: boolean;
  setNeedsName: (needs: boolean) => void;
  avatarKey: AvatarKey;
  setAvatarKey: (key: AvatarKey) => void;
  onNavigate: (screen: ScreenType) => void;
  requireName: () => boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  childName,
  setChildName,
  needsName,
  setNeedsName,
  avatarKey,
  setAvatarKey,
  onNavigate,
  requireName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentAvatar = AVATARS[avatarKey];

  // Mini preview playground state
  const [previewPos, setPreviewPos] = useState<{ x: number; y: number }>({ x: 1, y: 1 });

  const movePreview = (dx: number, dy: number) => {
    playMoveSound();
    setPreviewPos((prev) => ({
      x: Math.max(0, Math.min(2, prev.x + dx)),
      y: Math.max(0, Math.min(2, prev.y + dy)),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, ' ');
    setChildName(val);
    if (needsName) setNeedsName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (requireName()) {
        playTapSound();
        onNavigate('levels');
      } else {
        inputRef.current?.focus();
      }
    }
  };

  const handleSelectAvatar = (key: AvatarKey) => {
    playTapSound();
    setAvatarKey(key);
    speakShort(AVATARS[key].sound);
  };

  const displayName = childName.trim() || 'Kleine Programmeur';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold tracking-wide uppercase mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Leren Coderen Voor Kinderen</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Programmeren met <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-600 to-indigo-600">plaatjes én code</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
          Code is een slim stappenplan voor de computer. Jij bent de baas en vertelt precies wat er gebeurt!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Player Setup */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Naam invoeren */}
          <div className={`p-6 rounded-3xl bg-white border-2 transition-all shadow-md ${
            needsName ? 'border-amber-400 ring-4 ring-amber-100 bg-amber-50/20' : 'border-indigo-100'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Stap 1: Wie ben jij?</span>
              <span className="text-xs text-slate-500 font-medium">max 18 letters</span>
            </div>
            <label htmlFor="childName" className="block text-xl font-bold text-slate-900 mb-2">
              Wat is jouw naam?
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="childName"
                type="text"
                maxLength={18}
                autoComplete="given-name"
                placeholder="Typ hier je naam..."
                value={childName}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xl font-bold placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
              />
              {childName.trim() && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
            <p className={`mt-2.5 text-xs sm:text-sm font-semibold transition-colors ${
              needsName ? 'text-amber-700' : 'text-slate-700'
            }`}>
              {needsName
                ? '⚠️ Typ eerst even je naam, dan kan Mattís Code persoonlijk tegen jou praten!'
                : childName.trim()
                ? `Hoi ${childName.trim()}! Leuk dat je er bent. Kies hieronder jouw figuur.`
                : 'Vul je naam in zodat Mattís Code jou persoonlijke tips kan geven.'}
            </p>
          </div>

          {/* Card 2: Figuur kiezen */}
          <div className="p-6 rounded-3xl bg-white border-2 border-indigo-100 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
              Stap 2: Kies jouw held
            </span>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Met welk figuur wil je spelen?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {(['cat', 'robot', 'unicorn'] as AvatarKey[]).map((key) => {
                const av = AVATARS[key];
                const isSelected = avatarKey === key;
                return (
                  <div
                    key={key}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`${av.name} kiezen`}
                    onClick={() => handleSelectAvatar(key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectAvatar(key);
                      }
                    }}
                    className={`p-4 rounded-2xl text-left border-2 transition-all relative group flex flex-col justify-between cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-4 ring-indigo-100 -translate-y-0.5'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:scale-110 transition-transform flex items-center justify-center text-3xl shadow-2xs">
                        {av.icon}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakShort(av.sound);
                        }}
                        aria-label={`Luister naar ${av.name}`}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
                        title={av.sound}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-base font-bold text-slate-900">{av.name}</strong>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{av.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                if (requireName()) {
                  playTapSound();
                  onNavigate('levels');
                } else {
                  inputRef.current?.focus();
                }
              }}
              className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-black text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Start met blokjes programmeren</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (requireName()) {
                    playTapSound();
                    onNavigate('code');
                  } else {
                    inputRef.current?.focus();
                  }
                }}
                className="py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-purple-600" />
                <span>Code Lab (Zelf typen)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (requireName()) {
                    playTapSound();
                    onNavigate('learn');
                  } else {
                    inputRef.current?.focus();
                  }
                }}
                className="py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Hoe werkt code? 🔊</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Character Playground Card */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-linear-to-b from-indigo-900 to-slate-900 text-white shadow-xl border border-indigo-800/60 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-indigo-800/80 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">Jouw Profiel</span>
                <strong className="text-lg font-bold text-white">{displayName}</strong>
              </div>
              <div className="px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-700 text-xs font-semibold text-indigo-200">
                Speelt als {currentAvatar.name}
              </div>
            </div>

            {/* Interactive 3x3 Test Grid */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-2">
                <span>Oefenveld: test de besturing!</span>
                <span>Klik de pijltjes 👇</span>
              </div>

              <div className="w-full aspect-square max-w-[260px] mx-auto bg-slate-800/80 rounded-2xl border-2 border-indigo-700/60 p-2 grid grid-cols-3 grid-rows-3 gap-2">
                {[0, 1, 2].map((y) =>
                  [0, 1, 2].map((x) => {
                    const isHero = previewPos.x === x && previewPos.y === y;
                    const isFish = x === 2 && y === 2;
                    return (
                      <div
                        key={`${x}-${y}`}
                        className="rounded-xl bg-slate-900/60 border border-slate-700/40 flex items-center justify-center relative transition-all"
                      >
                        {isFish && !isHero && (
                          <span className="text-2xl animate-fish select-none">🐟</span>
                        )}
                        {isHero && (
                          <div className="text-3xl animate-bounce select-none filter drop-shadow">
                            {currentAvatar.icon}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* D-Pad Controls for Mini Grid */}
            <div className="flex flex-col items-center gap-1.5 mb-5">
              <button
                type="button"
                onClick={() => movePreview(0, -1)}
                className="w-11 h-11 rounded-xl bg-indigo-700 hover:bg-indigo-600 active:scale-95 text-white font-bold text-lg flex items-center justify-center shadow-md transition-all cursor-pointer"
                title="Omhoog"
              >
                ⬆️
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => movePreview(-1, 0)}
                  className="w-11 h-11 rounded-xl bg-indigo-700 hover:bg-indigo-600 active:scale-95 text-white font-bold text-lg flex items-center justify-center shadow-md transition-all cursor-pointer"
                  title="Links"
                >
                  ⬅️
                </button>
                <button
                  type="button"
                  onClick={() => movePreview(0, 1)}
                  className="w-11 h-11 rounded-xl bg-indigo-700 hover:bg-indigo-600 active:scale-95 text-white font-bold text-lg flex items-center justify-center shadow-md transition-all cursor-pointer"
                  title="Omlaag"
                >
                  ⬇️
                </button>
                <button
                  type="button"
                  onClick={() => movePreview(1, 0)}
                  className="w-11 h-11 rounded-xl bg-indigo-700 hover:bg-indigo-600 active:scale-95 text-white font-bold text-lg flex items-center justify-center shadow-md transition-all cursor-pointer"
                  title="Rechts"
                >
                  ➡️
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-800/80 text-xs text-indigo-200 leading-relaxed">
              💡 <strong>Tip van Mattís:</strong> In de levels bouw je een rij van blokjes achter elkaar. Als je op <strong>Play ▶️</strong> drukt, voert de computer ze allemaal netjes één voor één uit!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
