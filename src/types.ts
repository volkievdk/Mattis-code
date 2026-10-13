export type AvatarKey = 'cat' | 'robot' | 'unicorn';

export interface Avatar {
  name: string;
  icon: string;
  sound: string;
  tagline: string;
  description: string;
  color: string;
  accentBg: string;
}

export type BlockKey =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'repeatRight'
  | 'repeatDown'
  | 'talk'
  | 'dance'
  | 'openDoor'
  | 'play';

export interface Block {
  icon: string;
  label: string;
  kind?: 'smart' | 'fun' | 'play';
  code: string[];
}

export interface Coord {
  x: number;
  y: number;
}

export interface Level {
  id: number;
  icon: string;
  title: string;
  lesson: string;
  mission: string;
  size: number;
  maxBlocks: number;
  start: Coord;
  goal: Coord;
  walls: Coord[];
  lava: Coord[];
  water: Coord[];
  stars: Coord[];
  switches: Coord[];
  doors: Coord[];
  blocks: BlockKey[];
  success: string;
  requiredActions?: string[];
  mustCollectStars?: boolean;
  mustUseActions?: string[];
}

export type ScreenType = 'start' | 'learn' | 'levels' | 'game' | 'code';

export interface FeedbackState {
  type: 'success' | 'warning' | 'fail';
  title: string;
  text: string;
}
