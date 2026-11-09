export default {
  name: 'Labyrinth',
  // 64×64 PNG, 4px arms, ≤ 18000 bytes. docs/avatar.md
  skin: '',
  languages: ['en'],
  weather: {
    city: 'Bengaluru',
    cityEn: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 'Asia/Kolkata',
  },
  // The top bar links every station; the Dock keeps five so it fits beside the radar on phones.
  dock: ['welcome', 'tracks', 'schedule', 'prizes', 'register'],
  mailbox: { endpoint: '', email: 'prashant@labyrinth.dev', turnstileSitekey: '' },
  badge: false,
};
