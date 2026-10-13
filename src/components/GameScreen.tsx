import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AvatarKey, BlockKey, Coord, FeedbackState, ScreenType } from '../types';
import { AVATARS, BLOCKS, LEVELS } from '../data/gameData';
import { speakShort } from '../utils/speech';
import {
  playTapSound,
  playMoveSound,
  playStarSound,
  playSwitchSound,
  playBumpSound,
  playWaterSound,
  playSuccessFanfare,
} from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  Trash2,
  Code2,
  ArrowRight,
} from 'lucide-react';

interface GameScreenProps {
  childName: string;
  avatarKey: AvatarKey;
  levelIndex: number;
  onSelectLevel: (index: number) => void;
  onNavigate: (screen: ScreenType) => void;
  openCodeLabWithText: (code: string) => void;
  onLevelCompleted: (levelId: number) => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const hasCoord = (list: Coord[] = [], x: number, y: number) =>
  list.some((item) => item.x === x && item.y === y);
const coordKey = (x: number, y: number) => `${x},${y}`;

export const GameScreen: React.FC<GameScreenProps> = ({
  childName,
  avatarKey,
  levelIndex,
  onSelectLevel,
  onNavigate,
  openCodeLabWithText,
  onLevelCompleted,
}) => {
  const level = LEVELS[levelIndex] || LEVELS[0];
  const avatar = AVATARS[avatarKey];
  const name = childName.trim() || 'Kleine Programmeur';

  const [program, setProgram] = useState<BlockKey[]>([]);
  const [pos, setPos] = useState<Coord>({ ...level.start });
  const [running, setRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [codePanelOpen, setCodePanelOpen] = useState<boolean>(level.id === 5);
  const [collectedStars, setCollectedStars] = useState<Set<string>>(new Set());
  const [pressedSwitch, setPressedSwitch] = useState<boolean>(false);
  const [doorOpen, setDoorOpen] = useState<boolean>(false);
  const [actionsUsed, setActionsUsed] = useState<Set<string>>(new Set());
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isDancing, setIsDancing] = useState<boolean>(false);
  const [isBumping, setIsBumping] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // References to keep async execution fresh
  const stateRef = useRef({
    pos: { ...level.start },
    running: false,
    doorOpen: false,
    pressedSwitch: false,
    collectedStars: new Set<string>(),
    actionsUsed: new Set<string>(),
  });

  useEffect(() => {
    stateRef.current.pos = pos;
  }, [pos]);
  useEffect(() => {
    stateRef.current.running = running;
  }, [running]);
  useEffect(() => {
    stateRef.current.doorOpen = doorOpen;
  }, [doorOpen]);
  useEffect(() => {
    stateRef.current.pressedSwitch = pressedSwitch;
  }, [pressedSwitch]);
  useEffect(() => {
    stateRef.current.collectedStars = collectedStars;
  }, [collectedStars]);
  useEffect(() => {
    stateRef.current.actionsUsed = actionsUsed;
  }, [actionsUsed]);

  // Reset when level changes
  useEffect(() => {
    setProgram([]);
    setPos({ ...level.start });
    stateRef.current.pos = { ...level.start };
    setRunning(false);
    stateRef.current.running = false;
    setActiveStepIndex(null);
    setCodePanelOpen(level.id === 5);
    setCollectedStars(new Set());
    stateRef.current.collectedStars = new Set();
    setPressedSwitch(false);
    stateRef.current.pressedSwitch = false;
    setDoorOpen(false);
    stateRef.current.doorOpen = false;
    setActionsUsed(new Set());
    stateRef.current.actionsUsed = new Set();
    setBubbleText(null);
    setIsDancing(false);
    setIsBumping(false);
    setFeedback(null);
  }, [levelIndex, level]);

  const resetGameState = useCallback(() => {
    setPos({ ...level.start });
    stateRef.current.pos = { ...level.start };
    setCollectedStars(new Set());
    stateRef.current.collectedStars = new Set();
    setPressedSwitch(false);
    stateRef.current.pressedSwitch = false;
    setDoorOpen(false);
    stateRef.current.doorOpen = false;
    setActionsUsed(new Set());
    stateRef.current.actionsUsed = new Set();
    setBubbleText(null);
    setIsDancing(false);
    setIsBumping(false);
    setActiveStepIndex(null);
  }, [level]);

  const handleResetLevel = () => {
    if (running) return;
    playTapSound();
    resetGameState();
    setFeedback(null);
  };

  const addBlock = (blockName: BlockKey) => {
    if (running) return;
    playTapSound();
    setFeedback(null);
    if (program.length >= level.maxBlocks) {
      setFeedback({
        type: 'warning',
        title: 'Geen plek meer!',
        text: `Dit level heeft maximaal ${level.maxBlocks} blokjes. Druk op Play of maak een blokje leeg.`,
      });
      return;
    }
    setProgram((prev) => [...prev, blockName]);
  };

  const removeBlockAt = (index: number) => {
    if (running) return;
    playTapSound();
    setProgram((prev) => prev.filter((_, i) => i !== index));
    setFeedback(null);
  };

  const clearProgram = () => {
    if (running) return;
    playTapSound();
    setProgram([]);
    setFeedback(null);
  };

  const programToCode = (items: BlockKey[]) => {
    return items.flatMap((item) => BLOCKS[item]?.code || []).join('\n');
  };

  const sendProgramToCodeLab = () => {
    const code = programToCode(program);
    if (!code) {
      setFeedback({
        type: 'warning',
        title: 'Nog geen blokjes',
        text: 'Voeg eerst een paar blokjes toe aan je stappenplan.',
      });
      return;
    }
    playTapSound();
    openCodeLabWithText(code);
  };

  const say = async (text: string) => {
    setBubbleText(text);
    await wait(540);
    setBubbleText(null);
  };

  const talkAction = async () => {
    setActionsUsed((prev) => new Set(prev).add('talk'));
    stateRef.current.actionsUsed.add('talk');
    setBubbleText(avatar.sound);
    speakShort(avatar.sound);
    await wait(540);
    setBubbleText(null);
  };

  const danceAction = async () => {
    setActionsUsed((prev) => new Set(prev).add('dance'));
    stateRef.current.actionsUsed.add('dance');
    setIsDancing(true);
    await wait(520);
    setIsDancing(false);
  };

  const openDoorAction = async () => {
    setActionsUsed((prev) => new Set(prev).add('openDoor'));
    stateRef.current.actionsUsed.add('openDoor');
    if (stateRef.current.pressedSwitch) {
      setDoorOpen(true);
      stateRef.current.doorOpen = true;
      playStarSound();
      await say('Deur open! 🚪');
    } else {
      playBumpSound();
      await say('Eerst knop indrukken!');
    }
  };

  const triggerBump = async () => {
    playBumpSound();
    setIsBumping(true);
    await wait(220);
    setIsBumping(false);
  };

  const blocked = (point: Coord) => {
    return (
      point.x < 0 ||
      point.y < 0 ||
      point.x >= level.size ||
      point.y >= level.size ||
      hasCoord(level.walls, point.x, point.y) ||
      (hasCoord(level.doors, point.x, point.y) && !stateRef.current.doorOpen)
    );
  };

  const moveHero = (direction: 'up' | 'down' | 'left' | 'right') => {
    const cur = { ...stateRef.current.pos };
    const next = { ...cur };
    if (direction === 'up') next.y -= 1;
    if (direction === 'down') next.y += 1;
    if (direction === 'left') next.x -= 1;
    if (direction === 'right') next.x += 1;

    if (blocked(next)) {
      triggerBump();
      return;
    }
    playMoveSound();
    stateRef.current.pos = next;
    setPos(next);
  };

  const checkDanger = async (): Promise<boolean> => {
    const cur = stateRef.current.pos;
    if (hasCoord(level.lava, cur.x, cur.y)) {
      playBumpSound();
      setFeedback({
        type: 'fail',
        title: 'Ai, te heet! 🔥',
        text: 'Je figuurtje stapte in de lava. Verander je route om de lava te ontwijken.',
      });
      resetGameState();
      setRunning(false);
      stateRef.current.running = false;
      return true;
    }
    if (hasCoord(level.water, cur.x, cur.y)) {
      playWaterSound();
      setFeedback({
        type: 'warning',
        title: 'Plons! 💧',
        text: 'Natte pootjes! Kijk goed waar het water ligt en loop eromheen.',
      });
      resetGameState();
      setRunning(false);
      stateRef.current.running = false;
      return true;
    }
    return false;
  };

  const applyTileEffects = async () => {
    const cur = stateRef.current.pos;
    const k = coordKey(cur.x, cur.y);
    if (hasCoord(level.stars, cur.x, cur.y) && !stateRef.current.collectedStars.has(k)) {
      stateRef.current.collectedStars.add(k);
      setCollectedStars(new Set(stateRef.current.collectedStars));
      playStarSound();
      await say('Ster gepakt! ⭐');
    }
    if (hasCoord(level.switches, cur.x, cur.y) && !stateRef.current.pressedSwitch) {
      stateRef.current.pressedSwitch = true;
      setPressedSwitch(true);
      playSwitchSound();
      await say('Klik! Knop aan 🔘');
    }
  };

  const isGameWon = () => {
    return stateRef.current.pos.x === level.goal.x && stateRef.current.pos.y === level.goal.y;
  };

  const repeatMove = async (direction: 'right' | 'down') => {
    for (let i = 0; i < 4; i++) {
      if (isGameWon()) return false;
      moveHero(direction);
      await wait(230);
      if (await checkDanger()) return true;
      await applyTileEffects();
    }
    return false;
  };

  const runBlock = async (blockName: BlockKey) => {
    if (blockName === 'repeatRight') return repeatMove('right');
    if (blockName === 'repeatDown') return repeatMove('down');
    if (blockName === 'talk') return talkAction();
    if (blockName === 'dance') return danceAction();
    if (blockName === 'openDoor') return openDoorAction();
    moveHero(blockName as 'up' | 'down' | 'left' | 'right');
    await wait(270);
    return false;
  };

  const playProgram = async () => {
    if (running || !program.length) return;
    setRunning(true);
    stateRef.current.running = true;
    setFeedback(null);
    resetGameState();
    await wait(140);

    for (let i = 0; i < program.length; i++) {
      setActiveStepIndex(i);
      const blockName = program[i];
      if (isGameWon()) break;
      const stopped = await runBlock(blockName);
      if (stopped) return;
      if (await checkDanger()) return;
      await applyTileEffects();
      if (isGameWon()) break;
    }

    setActiveStepIndex(null);

    // Evaluation
    const won = isGameWon();
    const curActions = stateRef.current.actionsUsed;
    const curStars = stateRef.current.collectedStars;

    if (!won) {
      playBumpSound();
      setFeedback({
        type: 'warning',
        title: 'Bijna bij de vis!',
        text: 'Je stappenplan stopte vóór de vis. Kijk hoeveel stapjes je nog tekortkomt.',
      });
    } else if (level.requiredActions && level.requiredActions.some((a) => !curActions.has(a))) {
      playBumpSound();
      setFeedback({
        type: 'warning',
        title: 'Nog niet helemaal...',
        text: 'Vergeet niet om je figuurtje ook te laten praten én dansen!',
      });
    } else if (level.mustCollectStars && curStars.size < level.stars.length) {
      playBumpSound();
      setFeedback({
        type: 'warning',
        title: 'Ster vergeten! ⭐',
        text: 'Pak eerst de glinsterende ster voordat je naar de vis loopt.',
      });
    } else if (level.mustUseActions && level.mustUseActions.some((a) => !curActions.has(a))) {
      playBumpSound();
      setFeedback({
        type: 'warning',
        title: 'Poort vergeten! 🚪',
        text: 'Gebruik het speciale blokje om de poort te openen.',
      });
    } else {
      // Success!
      playSuccessFanfare();
      onLevelCompleted(level.id);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setFeedback({
        type: 'success',
        title: 'GELUKT! 🎉',
        text: `Supergoed gedaan ${name}! ${level.success}`,
      });
    }

    setRunning(false);
    stateRef.current.running = false;
  };

  const handleNextLevel = () => {
    playTapSound();
    const next = levelIndex + 1;
    if (next < LEVELS.length) {
      onSelectLevel(next);
    } else {
      onNavigate('levels');
    }
  };

  const generatedCode = programToCode(program);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Level Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playTapSound();
              onNavigate('levels');
            }}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
            title="Terug naar levels"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-black">
                Level {level.id} van {LEVELS.length}
              </span>
              <span className="text-xl">{level.icon}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {level.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetLevel}
            disabled={running}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Herstart dit level"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Opnieuw</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTapSound();
              setCodePanelOpen((prev) => !prev);
            }}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              codePanelOpen
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Toon Code</span>
          </button>
        </div>
      </div>

      {/* Mission Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-lg shadow-xs">
            🎯
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">Jouw Doel</span>
            <p className="text-sm font-bold text-slate-900">{level.mission}</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-white border border-indigo-200 text-xs font-black text-indigo-900 shrink-0">
          {program.length} / {level.maxBlocks} blokjes
        </div>
      </div>

      {/* Feedback Alert if shown */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border-2 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-bounce-short ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : feedback.type === 'fail'
              ? 'bg-rose-50 border-rose-400 text-rose-950'
              : 'bg-amber-50 border-amber-400 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {feedback.type === 'success' ? '🏆' : feedback.type === 'fail' ? '💥' : '💡'}
            </span>
            <div>
              <strong className="text-base font-black block">{feedback.title}</strong>
              <p className="text-xs sm:text-sm font-semibold opacity-90">{feedback.text}</p>
            </div>
          </div>

          {feedback.type === 'success' && (
            <button
              type="button"
              onClick={handleNextLevel}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md flex items-center gap-2 shrink-0 cursor-pointer transition-all"
            >
              <span>Volgende level</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      )}

      {/* Main Game Arena: Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Board Stage */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[500px] aspect-square p-3 sm:p-4 rounded-3xl bg-linear-to-b from-indigo-100 to-slate-200 border-4 border-indigo-200 shadow-xl relative">
            <div
              className="w-full h-full rounded-2xl overflow-hidden bg-white/95 border border-slate-300 relative shadow-inner"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${level.size}, 1fr)`,
                gridTemplateRows: `repeat(${level.size}, 1fr)`,
              }}
            >
              {/* Tile grid */}
              {Array.from({ length: level.size }).map((_, y) =>
                Array.from({ length: level.size }).map((_, x) => {
                  const isWall = hasCoord(level.walls, x, y);
                  const isLava = hasCoord(level.lava, x, y);
                  const isWater = hasCoord(level.water, x, y);
                  const isStar = hasCoord(level.stars, x, y) && !collectedStars.has(coordKey(x, y));
                  const isSwitch = hasCoord(level.switches, x, y);
                  const isDoor = hasCoord(level.doors, x, y) && !doorOpen;
                  const isGoal = level.goal.x === x && level.goal.y === y;

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`border border-slate-100/80 flex items-center justify-center relative select-none transition-all ${
                        isWall
                          ? 'bg-slate-700 text-white shadow-inner'
                          : isLava
                          ? 'bg-orange-500 shadow-inner'
                          : isWater
                          ? 'bg-sky-400/90 shadow-inner'
                          : isStar
                          ? 'bg-amber-50'
                          : isSwitch
                          ? pressedSwitch
                            ? 'bg-emerald-100'
                            : 'bg-amber-100'
                          : isDoor
                          ? 'bg-purple-200 shadow-inner'
                          : (x + y) % 2 === 0
                          ? 'bg-slate-50/60'
                          : 'bg-white'
                      }`}
                    >
                      {/* Tile Art */}
                      {isWall && <span className="text-xl sm:text-2xl filter drop-shadow">🧱</span>}
                      {isLava && <span className="text-xl sm:text-2xl animate-pulse">🔥</span>}
                      {isWater && <span className="text-xl sm:text-2xl">💧</span>}
                      {isStar && <span className="text-xl sm:text-2xl animate-star">⭐</span>}
                      {isSwitch && (
                        <span className="text-xl sm:text-2xl">
                          {pressedSwitch ? '🟢' : '🔘'}
                        </span>
                      )}
                      {isDoor && <span className="text-xl sm:text-2xl">🚪</span>}
                      {isGoal && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <span className="text-3xl sm:text-4xl animate-fish filter drop-shadow-md">
                            🐟
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Animated Hero Piece */}
              <div
                className={`absolute z-20 flex items-center justify-center transition-all duration-300 pointer-events-none ${
                  isDancing ? 'animate-dance' : isBumping ? 'animate-bump' : ''
                }`}
                style={{
                  width: `${100 / level.size}%`,
                  height: `${100 / level.size}%`,
                  transform: `translate(${pos.x * 100}%, ${pos.y * 100}%)`,
                }}
              >
                <div className="text-3xl sm:text-4xl filter drop-shadow-lg select-none">
                  {avatar.icon}
                </div>

                {/* Speech Bubble */}
                {bubbleText && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border-2 border-indigo-900 rounded-xl shadow-md text-xs font-black text-indigo-950 whitespace-nowrap z-30 animate-bounce">
                    {bubbleText}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b-2 border-r-2 border-indigo-900 rotate-45" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Deck & Blocks */}
        <div className="lg:col-span-5 space-y-5">
          {/* Program Tray */}
          <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">Mijn Stappenplan</span>
                <span className="text-xs text-slate-500 font-bold">
                  ({program.length}/{level.maxBlocks})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearProgram}
                  disabled={running || program.length === 0}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-30"
                  title="Stappenplan leegmaken"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Leegmaken</span>
                </button>
              </div>
            </div>

            {/* Blocks Queue */}
            <div className="min-h-[72px] p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap gap-2 items-center mb-4">
              {program.length === 0 ? (
                <div className="w-full text-center py-4 text-xs font-semibold text-slate-600">
                  Tik hieronder op de blokjes om jouw route te bouwen! 👆
                </div>
              ) : (
                program.map((blockName, idx) => {
                  const b = BLOCKS[blockName];
                  const isActive = activeStepIndex === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={running}
                      onClick={() => removeBlockAt(idx)}
                      className={`h-11 px-3 rounded-xl border-2 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all relative group cursor-pointer ${
                        isActive
                          ? 'bg-amber-300 border-amber-500 ring-4 ring-amber-200 scale-105 z-10'
                          : b.kind === 'smart'
                          ? 'bg-sky-50 border-sky-300 text-sky-900 hover:border-rose-400'
                          : b.kind === 'fun'
                          ? 'bg-pink-50 border-pink-300 text-pink-900 hover:border-rose-400'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-rose-400'
                      }`}
                      title="Klik om te verwijderen"
                    >
                      <span className="text-slate-600 font-mono text-[10px]">{idx + 1}.</span>
                      <span className="text-base">{b.icon}</span>
                      <span className="font-semibold">{b.label}</span>
                      <span className="hidden group-hover:inline-block text-rose-500 text-xs ml-0.5">✕</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Run Button */}
            <button
              type="button"
              disabled={running || program.length === 0}
              onClick={playProgram}
              className="w-full py-3.5 px-5 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-emerald-200 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{running ? 'Bezig met uitvoeren...' : 'Start Programma ▶️'}</span>
            </button>
          </div>

          {/* Block Palette */}
          <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Kies Blokjes om toe te voegen
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {level.blocks
                .filter((b) => b !== 'play')
                .map((blockName) => {
                  const b = BLOCKS[blockName];
                  return (
                    <button
                      key={blockName}
                      type="button"
                      disabled={running}
                      onClick={() => addBlock(blockName)}
                      className={`p-3 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-2.5 group hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                        b.kind === 'smart'
                          ? 'bg-sky-50 border-sky-300 hover:border-sky-400 text-sky-950'
                          : b.kind === 'fun'
                          ? 'bg-pink-50 border-pink-300 hover:border-pink-400 text-pink-950'
                          : 'bg-slate-50 border-slate-200 hover:border-indigo-400 text-slate-900'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 group-hover:scale-110 transition-transform flex items-center justify-center text-xl shadow-2xs">
                        {b.icon}
                      </div>
                      <div className="text-xs">
                        <span className="block leading-tight">{b.label}</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Generated Code Drawer (If toggled open) */}
          {codePanelOpen && (
            <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Echte Code Vertaling
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">JS Output</span>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs leading-relaxed max-h-36 overflow-y-auto mb-3">
                {generatedCode || '// Nog geen blokjes gekozen'}
              </pre>

              <button
                type="button"
                onClick={sendProgramToCodeLab}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open & bewerk in Code Lab ⌨️</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
