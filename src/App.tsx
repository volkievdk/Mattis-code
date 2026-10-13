import { useState, useEffect } from 'react';
import { ScreenType, AvatarKey } from './types';
import { Navbar } from './components/Navbar';
import { StartScreen } from './components/StartScreen';
import { LearnScreen } from './components/LearnScreen';
import { LevelScreen } from './components/LevelScreen';
import { GameScreen } from './components/GameScreen';
import { CodeScreen } from './components/CodeScreen';


export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('start');
  const [childName, setChildName] = useState<string>('Mattís');
  const [needsName, setNeedsName] = useState<boolean>(false);
  const [avatarKey, setAvatarKey] = useState<AvatarKey>('cat');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [codeText, setCodeText] = useState<string>(
    'rechts()\nrechts()\nomlaag()\nomlaag()\npraat()'
  );

  // Load / persist saved name & progress in localStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('mattis_code_name');
      if (savedName) setChildName(savedName);

      const savedAvatar = localStorage.getItem('mattis_code_avatar') as AvatarKey;
      if (savedAvatar) setAvatarKey(savedAvatar);

      const savedCompleted = localStorage.getItem('mattis_code_completed');
      if (savedCompleted) {
        setCompletedLevels(new Set(JSON.parse(savedCompleted)));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const handleSetChildName = (name: string) => {
    setChildName(name);
    try {
      localStorage.setItem('mattis_code_name', name);
    } catch {
      // Ignore
    }
  };

  const handleSetAvatar = (key: AvatarKey) => {
    setAvatarKey(key);
    try {
      localStorage.setItem('mattis_code_avatar', key);
    } catch {
      // Ignore
    }
  };

  const handleLevelCompleted = (levelId: number) => {
    setCompletedLevels((prev) => {
      const next = new Set(prev).add(levelId);
      try {
        localStorage.setItem('mattis_code_completed', JSON.stringify(Array.from(next)));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const requireName = (): boolean => {
    const cleaned = childName.trim().replace(/\s+/g, ' ');
    setChildName(cleaned);
    if (!cleaned) {
      setNeedsName(true);
      return false;
    }
    setNeedsName(false);
    return true;
  };

  const openCodeLabWithText = (text: string) => {
    setCodeText(text);
    setCurrentScreen('code');
  };

  const handleSelectLevel = (index: number) => {
    setCurrentLevelIndex(index);
    setCurrentScreen('game');
  };

  return (
    <div className="min-h-screen flex flex-col bg-radial-[at_top_right] from-amber-50/50 via-white to-sky-50/40 text-slate-900">
      {/* Top Bar Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        childName={childName}
        avatarKey={avatarKey}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        completedCount={completedLevels.size}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {currentScreen === 'start' && (
          <StartScreen
            childName={childName}
            setChildName={handleSetChildName}
            needsName={needsName}
            setNeedsName={setNeedsName}
            avatarKey={avatarKey}
            setAvatarKey={handleSetAvatar}
            onNavigate={setCurrentScreen}
            requireName={requireName}
          />
        )}

        {currentScreen === 'learn' && (
          <LearnScreen
            childName={childName}
            onNavigate={setCurrentScreen}
            requireName={requireName}
            openCodeLab={() => setCurrentScreen('code')}
            onStartFirstLevel={() => handleSelectLevel(0)}
          />
        )}

        {currentScreen === 'levels' && (
          <LevelScreen
            childName={childName}
            avatarKey={avatarKey}
            completedLevels={completedLevels}
            onSelectLevel={handleSelectLevel}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'game' && (
          <GameScreen
            childName={childName}
            avatarKey={avatarKey}
            levelIndex={currentLevelIndex}
            onSelectLevel={handleSelectLevel}
            onNavigate={setCurrentScreen}
            openCodeLabWithText={openCodeLabWithText}
            onLevelCompleted={handleLevelCompleted}
          />
        )}

        {currentScreen === 'code' && (
          <CodeScreen
            childName={childName}
            avatarKey={avatarKey}
            codeText={codeText}
            setCodeText={setCodeText}
            onNavigate={setCurrentScreen}
          />
        )}
      </main>

      {/* Clean, unobtrusive educational footer */}
      <footer className="w-full border-t border-slate-200/80 py-6 px-4 bg-white/60 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-800 text-sm">Mattís Code 2.0</span>
            <span>·</span>
            <span>Gemaakt voor nieuwsgierige jonge denkers</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Stap voor stap programmeren</span>
            <span>·</span>
            <span>Veilig & Zonder reclame</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
