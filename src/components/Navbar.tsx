import React from 'react';
import { ScreenType, AvatarKey } from '../types';
import { AVATARS } from '../data/gameData';
import { Volume2, VolumeX, Sparkles, BookOpen, Layers, Terminal } from 'lucide-react';
import { setSoundEnabled, playTapSound } from '../utils/audio';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  childName: string;
  avatarKey: AvatarKey;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  completedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  childName,
  avatarKey,
  soundOn,
  setSoundOn,
  completedCount,
}) => {
  const avatar = AVATARS[avatarKey];
  const name = childName.trim();

  const handleSoundToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playTapSound();
  };

  const navItems: { screen: ScreenType; label: string; icon: React.ReactNode }[] = [
    { screen: 'start', label: 'Start', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { screen: 'learn', label: 'Uitleg', icon: <BookOpen className="w-4 h-4 text-sky-500" /> },
    { screen: 'levels', label: 'Levels', icon: <Layers className="w-4 h-4 text-emerald-500" /> },
    { screen: 'code', label: 'Code Lab', icon: <Terminal className="w-4 h-4 text-purple-500" /> },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            playTapSound();
            onNavigate('start');
          }}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-300 via-pink-400 to-indigo-400 p-0.5 shadow-sm group-hover:rotate-6 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl">
              {avatar.icon}
            </div>
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Mattís Code
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-700 bg-amber-100/80 px-2 py-0.5 rounded-full ml-2">
              Junior 2.0
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => {
                  playTapSound();
                  onNavigate(item.screen);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span className="hidden md:inline-flex">{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Player Pill & Sound Control */}
        <div className="flex items-center gap-2 shrink-0">
          {name && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-semibold text-slate-700">
              <span className="text-base">{avatar.icon}</span>
              <span className="truncate max-w-[100px]">{name}</span>
              {completedCount > 0 && (
                <span className="text-amber-500 font-bold ml-0.5">⭐ {completedCount}</span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Geluid dempen' : 'Geluid aanzetten'}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
