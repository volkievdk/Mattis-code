import React from 'react';
import { AvatarKey, ScreenType } from '../types';
import { AVATARS, LEVELS } from '../data/gameData';
import { playTapSound } from '../utils/audio';
import { ArrowLeft, Star, Volume2, Sparkles, Play, Award } from 'lucide-react';

interface LevelScreenProps {
  childName: string;
  avatarKey: AvatarKey;
  completedLevels: Set<number>;
  onSelectLevel: (index: number) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const LevelScreen: React.FC<LevelScreenProps> = ({
  childName,
  avatarKey,
  completedLevels,
  onSelectLevel,
  onNavigate,
}) => {
  const name = childName.trim() || 'Kleine Programmeur';
  const avatar = AVATARS[avatarKey];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => {
            playTapSound();
            onNavigate('start');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Terug naar Start</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playTapSound();
            onNavigate('learn');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-bold text-sm shadow-xs hover:bg-sky-100 transition-colors"
        >
          <Volume2 className="w-4 h-4 text-sky-600" />
          <span>Hoe werkt code? 🔊</span>
        </button>
      </div>

      {/* Progress & Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-indigo-100 shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-200 to-indigo-200 border-2 border-indigo-200 flex items-center justify-center text-4xl shadow-sm">
            {avatar.icon}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Programmeer Avontuur</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Kies een level, {name}!
            </h1>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              Jij speelt als de slimme <strong className="text-indigo-600">{avatar.name}</strong>.
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="w-full md:w-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jouw Voortgang</div>
            <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
              <span>{completedLevels.size} van de {LEVELS.length} voltooid</span>
              {completedLevels.size === LEVELS.length && <span>🏆</span>}
            </div>
            <div className="w-36 h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedLevels.size / LEVELS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LEVELS.map((level, index) => {
          const isCompleted = completedLevels.has(level.id);

          return (
            <button
              key={level.id}
              type="button"
              onClick={() => {
                playTapSound();
                onSelectLevel(index);
              }}
              className={`p-5 rounded-3xl text-left border-2 transition-all relative flex flex-col justify-between group cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400 shadow-sm hover:shadow-md'
                  : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-lg shadow-sm hover:-translate-y-1'
              }`}
            >
              <div>
                {/* Card Top: Level badge & completion star */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                      {level.id}
                    </span>
                    <span className="text-2xl">{level.icon}</span>
                  </div>

                  {isCompleted ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                      <span>Voltooid</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-700">
                      {level.maxBlocks} blokjes
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                  {level.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                  {level.lesson}
                </p>
              </div>

              {/* Card Footer: Mission snippet & Play button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[120px]">
                  {level.mission}
                </span>
                <span className="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
