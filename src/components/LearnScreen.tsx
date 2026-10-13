import React, { useState } from 'react';
import { ScreenType } from '../types';
import { speakCodingExplanation, stopSpeaking } from '../utils/speech';
import { playTapSound } from '../utils/audio';
import { Volume2, VolumeX, ArrowLeft, Terminal, Play, Sparkles } from 'lucide-react';

interface LearnScreenProps {
  childName: string;
  onNavigate: (screen: ScreenType) => void;
  requireName: () => boolean;
  openCodeLab: () => void;
  onStartFirstLevel: () => void;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  childName,
  onNavigate,
  requireName,
  openCodeLab,
  onStartFirstLevel,
}) => {
  const name = childName.trim() || 'Kleine Programmeur';
  const [isReading, setIsReading] = useState(false);

  const handleRead = () => {
    playTapSound();
    setIsReading(true);
    speakCodingExplanation(childName);
  };

  const handleStop = () => {
    playTapSound();
    setIsReading(false);
    stopSpeaking();
  };

  const steps = [
    {
      num: 1,
      title: 'Code is een recept',
      desc: 'De computer leest jouw stappenplan van boven naar beneden. Net zoals je een taart bakt volgens een recept!',
      icon: '📜',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      num: 2,
      title: 'Één regel doet één ding',
      desc: 'Elke opdracht is super precies. Eén pijltje naar rechts betekent precies één stapje naar rechts.',
      icon: '🎯',
      color: 'bg-sky-100 text-sky-900 border-sky-300',
    },
    {
      num: 3,
      title: 'Blokjes worden echte code',
      desc: 'Plaatjes en blokjes zijn handig, maar de computer leest tekst. Een blokje ➡️ is hetzelfde als de code rechts().',
      icon: '💻',
      color: 'bg-purple-100 text-purple-900 border-purple-300',
    },
    {
      num: 4,
      title: 'Debuggen is een superkracht',
      desc: 'Gaat er iets mis? Geen probleem! Echte programmeurs maken elke dag foutjes. Je zoekt de fout en past hem aan.',
      icon: '🔍',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            playTapSound();
            onNavigate('start');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Terug naar Start</span>
        </button>

        <div className="flex items-center gap-2">
          {!isReading ? (
            <button
              type="button"
              onClick={handleRead}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Lees voor met stem 🔊</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer animate-pulse"
            >
              <VolumeX className="w-4 h-4" />
              <span>Stop voorlezen ⏹️</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Banner */}
      <div className="p-8 rounded-3xl bg-linear-to-r from-amber-400 via-pink-400 to-indigo-500 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Uitleg voor {name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Zo werkt programmeren!
          </h1>
          <p className="text-white/95 font-medium text-base sm:text-lg leading-relaxed">
            Computers zijn heel snel, maar ze zijn niet slim uit zichzelf. Ze hebben jouw instructies nodig om te weten wat ze moeten doen!
          </p>
        </div>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {steps.map((st) => (
          <div
            key={st.num}
            className="p-6 rounded-3xl bg-white border-2 border-slate-100 shadow-md hover:shadow-lg transition-all flex gap-4 items-start"
          >
            <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl shrink-0 shadow-xs ${st.color}`}>
              {st.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase text-indigo-600">Stap {st.num}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">{st.title}</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Translation Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <strong className="text-base font-bold text-white">Woordenboek: Blokjes naar Code</strong>
          </div>
          <span className="text-xs text-slate-400 font-mono">Javascript Syntax</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-xl">➡️</span>
              <span className="text-slate-300">Stap naar rechts</span>
            </span>
            <code className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-xs">
              rechts()
            </code>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-xl">⬇️</span>
              <span className="text-slate-300">Stap omlaag</span>
            </span>
            <code className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-xs">
              omlaag()
            </code>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-xl">🔊</span>
              <span className="text-slate-300">Maak geluid</span>
            </span>
            <code className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-xs">
              praat()
            </code>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-xl">💃</span>
              <span className="text-slate-300">Doe een dansje</span>
            </span>
            <code className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-xs">
              dans()
            </code>
          </div>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            playTapSound();
            if (requireName()) onStartFirstLevel();
          }}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-base shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start met Level 1 🐾</span>
        </button>

        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            playTapSound();
            if (requireName()) openCodeLab();
          }}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 active:scale-95 text-slate-800 font-bold text-base shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Terminal className="w-5 h-5 text-purple-600" />
          <span>Probeer Code Lab ⌨️</span>
        </button>
      </div>
    </div>
  );
};
