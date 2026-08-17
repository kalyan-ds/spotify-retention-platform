export const SPOTIFY_THEME = {
  colors: {
    spotifyGreen: '#1DB954',
    spotifyGreenHover: '#1ed760',
    spotifyDark: '#121212',
    spotifyCardDark: '#181818',
    spotifyCardHover: '#282828',
    glassBg: 'rgba(24, 24, 24, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#FFFFFF',
    textSecondary: '#B3B3B3',
    status: {
      critical: '#F87171',
      high: '#FB923C',
      medium: '#FBBF24',
      low: '#4ADE80'
    }
  },
  gradients: {
    hero: 'linear-gradient(135deg, rgba(29,185,84,0.2) 0%, rgba(18,18,12,0.9) 100%)',
    cardGlass: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
    accentGradient: 'linear-gradient(90deg, #1DB954 0%, #1ED760 100%)'
  }
} as const;
