import React, { useState, useRef } from 'react';
import { AvatarKey, Coord, FeedbackState, ScreenType } from '../types';
import { AVATARS } from '../data/gameData';
import { speakCodingExplanation, speakShort } from '../utils/speech';
import {
  playTapSound,
  playMoveSound,
  playBumpSound,
  playStarSound,
  playSuccessFanfare,
} from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  Volume2,
  FileCode2,
  Code,
} from 'lucide-react';

interface CodeScreenProps {
  childName: string;
  avatarKey: AvatarKey;
  codeText: string;
  setCodeText: (text: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const CodeScreen: React.FC<CodeScreenProps> = ({
  childName,
  avatarKey,
  codeText,
  setCodeText,
  onNavigate,
}) => {
  const avatar = AVATARS[avatarKey];
  const name = childName.trim() || 'Kleine Programmeur';

  const [codePos, setCodePos] = useState<Coord>({ x: 0, y: 0 });
  const [codeRunning, setCodeRunning] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);
  const [codeCoach, setCodeCoach] = useState<string>('Elke regel code doet precies één actie.');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isDancing, setIsDancing] = useState<boolean>(false);
  const [isBumping, setIsBumping] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const statePosRef = useRef<Coord>({ x: 0, y: 0 });

  const getCodeLines = () => {
    return codeText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
  };

  const lineCount = getCodeLines().length;

  const resetCodeLab = (resetEditor = true) => {
    playTapSound();
    statePosRef.current = { x: 0, y: 0 };
    setCodePos({ x: 0, y: 0 });
    setCodeRunning(false);
    setCurrentLineIndex(null);
    setCodeCoach('Elke regel code doet precies één actie.');
    setFeedback(null);
    setBubbleText(null);
    setIsDancing(false);
    setIsBumping(false);
    if (resetEditor) {
      setCodeText('rechts()\nrechts()\nomlaag()\nomlaag()\npraat()');
    }
  };

  const insertExampleCode = () => {
    playTapSound();
    setCodeText('rechts()\nrechts()\nomlaag()\nomlaag()\npraat()');
    textareaRef.current?.focus();
  };

  const insertCodeLine = (command: string) => {
    playTapSound();
    const val = codeText.trimEnd();
    setCodeText(val ? `${val}\n${command}` : command);
    textareaRef.current?.focus();
  };

  const parseCode = (lines: string[]) => {
    const allowed: Record<string, string> = {
      'rechts()': 'right',
      'links()': 'left',
      'omhoog()': 'up',
      'omlaag()': 'down',
      'praat()': 'talk',
      'dans()': 'dance',
      'openDeur()': 'openDoor',
    };

    if (!lines.length) {
      return { ok: false, message: 'Typ eerst minimaal één regel code in de editor.' };
    }
    if (lines.length > 10) {
      return { ok: false, message: 'Gebruik maximaal 10 regels code tegelijk.' };
    }

    const commands = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!allowed[line]) {
        return {
          ok: false,
          message: `Oeps! Regel ${i + 1} ("${line}") begrijpt de computer nog niet. Controleer op spelfouten of haakjes ().`,
        };
      }
      commands.push({ raw: line, command: allowed[line], line: i + 1 });
    }
    return { ok: true, commands };
  };

  const say = async (text: string) => {
    setBubbleText(text);
    await wait(540);
    setBubbleText(null);
  };

  const triggerBump = async () => {
    playBumpSound();
    setIsBumping(true);
    await wait(220);
    setIsBumping(false);
  };

  const moveCodeHero = (direction: 'up' | 'down' | 'left' | 'right') => {
    const cur = { ...statePosRef.current };
    const next = { ...cur };
    if (direction === 'up') next.y -= 1;
    if (direction === 'down') next.y += 1;
    if (direction === 'left') next.x -= 1;
    if (direction === 'right') next.x += 1;

    if (next.x < 0 || next.y < 0 || next.x >= 5 || next.y >= 5) {
      triggerBump();
      return;
    }
    playMoveSound();
    statePosRef.current = next;
    setCodePos(next);
  };

  const runCode = async () => {
    if (codeRunning) return;
    const lines = getCodeLines();
    const parsed = parseCode(lines);
    if (!parsed.ok || !parsed.commands) {
      playBumpSound();
      setFeedback({
        type: 'warning',
        title: 'Check je code 🐞',
        text: parsed.message || 'Controleer je regels code.',
      });
      return;
    }

    playTapSound();
    setCodeRunning(true);
    statePosRef.current = { x: 0, y: 0 };
    setCodePos({ x: 0, y: 0 });
    setFeedback(null);
    await wait(150);

    const codeWon = () => statePosRef.current.x === 4 && statePosRef.current.y === 4;

    for (let i = 0; i < parsed.commands.length; i++) {
      const item = parsed.commands[i];
      setCurrentLineIndex(i);
      setCodeCoach(`Bezig met regel ${item.line}: ${item.raw}`);
      if (codeWon()) break;

      if (item.command === 'talk') {
        setBubbleText(avatar.sound);
        speakShort(avatar.sound);
        await wait(540);
        setBubbleText(null);
      } else if (item.command === 'dance') {
        setIsDancing(true);
        await wait(520);
        setIsDancing(false);
      } else if (item.command === 'openDoor') {
        playStarSound();
        await say('Deur open! 🚪');
      } else {
        moveCodeHero(item.command as 'up' | 'down' | 'left' | 'right');
        await wait(270);
      }

      if (codeWon()) break;
    }

    setCurrentLineIndex(null);

    if (codeWon()) {
      playSuccessFanfare();
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
      setFeedback({
        type: 'success',
        title: 'GEWELDIG! 🎉',
        text: `${name}, je hebt echte werkende computercode geschreven en de vis bereikt!`,
      });
    } else {
      playBumpSound();
      setFeedback({
        type: 'warning',
        title: 'Bijna bij de vis!',
        text: 'Je code voerde netjes uit, maar je bent nog niet op vakje (4,4). Voeg nog wat stapjes toe!',
      });
    }

    setCodeCoach('Elke regel code doet precies één actie.');
    setCodeRunning(false);
  };

  const commandButtons = [
    { code: 'rechts()', label: 'rechts()', desc: '1 stap naar rechts' },
    { code: 'omlaag()', label: 'omlaag()', desc: '1 stap omlaag' },
    { code: 'links()', label: 'links()', desc: '1 stap naar links' },
    { code: 'omhoog()', label: 'omhoog()', desc: '1 stap omhoog' },
    { code: 'praat()', label: 'praat()', desc: 'laat figuur praten' },
    { code: 'dans()', label: 'dans()', desc: 'laat figuur dansen' },
    { code: 'openDeur()', label: 'openDeur()', desc: 'open de poort' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playTapSound();
              onNavigate('levels');
            }}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors cursor-pointer"
            title="Terug naar levels"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-black">
                Code Lab Studio
              </span>
              <span className="text-xl">⌨️</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {name}, schrijf je eigen code!
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => resetCodeLab(false)}
            disabled={codeRunning}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Herstart de simulatie"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Positie</span>
          </button>

          <button
            type="button"
            onClick={() => speakCodingExplanation(childName)}
            className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-bold text-xs shadow-2xs hover:bg-sky-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Uitleg</span>
          </button>
        </div>
      </div>

      {/* Code Coach Banner */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-200 flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 text-lg shadow-xs">
            🤖
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
              Codecoach Live Monitor
            </span>
            <p className="text-sm font-bold text-slate-900">{codeCoach}</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-white border border-purple-200 text-xs font-black text-purple-900 shrink-0">
          {lineCount} / 10 regels
        </div>
      </div>

      {/* Feedback Alert if shown */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border-2 mb-6 flex items-center gap-3 shadow-md ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-amber-50 border-amber-400 text-amber-950'
          }`}
        >
          <span className="text-2xl">{feedback.type === 'success' ? '🏆' : '💡'}</span>
          <div>
            <strong className="text-base font-black block">{feedback.title}</strong>
            <p className="text-xs sm:text-sm font-semibold opacity-90">{feedback.text}</p>
          </div>
        </div>
      )}

      {/* Workspace Dual Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 5x5 Simulation Board */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[460px] aspect-square p-4 rounded-3xl bg-linear-to-b from-purple-100 to-indigo-100 border-4 border-purple-200 shadow-xl relative">
            <div
              className="w-full h-full rounded-2xl overflow-hidden bg-white/95 border border-slate-300 relative shadow-inner grid grid-cols-5 grid-rows-5"
            >
              {[0, 1, 2, 3, 4].map((y) =>
                [0, 1, 2, 3, 4].map((x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`border border-slate-100 flex items-center justify-center relative select-none ${
                      (x + y) % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                    }`}
                  >
                    {x === 4 && y === 4 && (
                      <span className="text-3xl animate-fish filter drop-shadow">🐟</span>
                    )}
                  </div>
                ))
              )}

              {/* Hero Piece */}
              <div
                className={`absolute z-20 flex items-center justify-center transition-all duration-300 pointer-events-none ${
                  isDancing ? 'animate-dance' : isBumping ? 'animate-bump' : ''
                }`}
                style={{
                  width: '20%',
                  height: '20%',
                  transform: `translate(${codePos.x * 100}%, ${codePos.y * 100}%)`,
                }}
              >
                <div className="text-4xl filter drop-shadow-md select-none">
                  {avatar.icon}
                </div>

                {bubbleText && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border-2 border-purple-900 rounded-xl shadow-md text-xs font-black text-purple-950 whitespace-nowrap z-30 animate-bounce">
                    {bubbleText}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b-2 border-r-2 border-purple-900 rotate-45" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-3 text-center">
            Doel: Stuur jouw figuurtje van linksboven (0,0) naar de vis rechtsonder (4,4)!
          </p>
        </div>

        {/* Right Column: Code Editor & Quick Commands */}
        <div className="lg:col-span-6 space-y-5">
          {/* Editor Container */}
          <div className="p-5 rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-black uppercase tracking-wider text-purple-300">
                  Code Editor
                </span>
                {currentLineIndex !== null && (
                  <span className="text-[11px] font-mono bg-purple-900/80 text-purple-200 border border-purple-700 px-2 py-0.5 rounded-full animate-pulse">
                    Regel {currentLineIndex + 1}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={insertExampleCode}
                className="text-xs text-purple-300 hover:text-white font-bold hover:underline cursor-pointer"
              >
                Laad Voorbeeld
              </button>
            </div>

            {/* Line numbered textarea */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden mb-4">
              <textarea
                ref={textareaRef}
                spellCheck={false}
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                className="w-full h-44 p-4 bg-transparent text-emerald-400 font-mono text-sm leading-relaxed resize-none outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Typ hier commando's zoals:&#10;rechts()&#10;omlaag()&#10;praat()"
              />
            </div>

            {/* Run Button */}
            <button
              type="button"
              disabled={codeRunning}
              onClick={runCode}
              className="w-full py-3.5 px-5 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-emerald-950/40 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{codeRunning ? 'Bezig met uitvoeren...' : 'Voer Code Uit ▶️'}</span>
            </button>
          </div>

          {/* Quick Insert Chips */}
          <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Snel Commando Toevoegen (Klik om in te voegen)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {commandButtons.map((cmd) => (
                <button
                  key={cmd.code}
                  type="button"
                  onClick={() => insertCodeLine(cmd.code)}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all group cursor-pointer"
                >
                  <code className="text-xs font-bold font-mono text-purple-700 group-hover:text-purple-900 block">
                    {cmd.label}
                  </code>
                  <span className="text-[10px] text-slate-600 block mt-0.5">{cmd.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
