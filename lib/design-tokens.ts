// Design tokens for Authentic Self Platform
// Color-coded dimensions for visual consistency

export const dimensionColors = {
  openness: {
    light: '#8B5CF6', // Purple
    dark: '#A78BFA',
    name: 'Openness',
  },
  conscientiousness: {
    light: '#3B82F6', // Blue
    dark: '#60A5FA',
    name: 'Conscientiousness',
  },
  extraversion: {
    light: '#F59E0B', // Amber
    dark: '#FBBF24',
    name: 'Extraversion',
  },
  agreeableness: {
    light: '#10B981', // Green
    dark: '#34D399',
    name: 'Agreeableness',
  },
  emotionalResilience: {
    light: '#EF4444', // Red
    dark: '#F87171',
    name: 'Emotional Resilience',
  },
  honestyHumility: {
    light: '#06B6D4', // Cyan
    dark: '#22D3EE',
    name: 'Honesty-Humility',
  },
  adaptability: {
    light: '#EC4899', // Pink
    dark: '#F472B6',
    name: 'Adaptability',
  },
} as const;

export const dimensions = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'emotionalResilience',
  'honestyHumility',
  'adaptability',
] as const;

export type Dimension = (typeof dimensions)[number];

