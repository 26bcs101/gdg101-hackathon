// 1 block = 1 m. x east, z south, y up.
export const ISLAND = { x0: -36, x1: 38, z0: -26, z1: 31 };

// Spawn facing north towards the Welcome Outpost
export const SPAWN = { x: 0, z: 16.5, heading: Math.PI };

export const STATIONS = [
  { id: 'welcome', name: 'Welcome', en: 'Welcome', icon: 'scroll', at: [0, 14], look: [0, 12] },
  { id: 'tracks', name: 'Tracks', en: 'Tracks', icon: 'works', at: [12.5, 8], look: [15, 8] },
  { id: 'schedule', name: 'Schedule', en: 'Schedule', icon: 'camera', at: [17.5, -2], look: [20, -2] },
  { id: 'prizes', name: 'Prizes', en: 'Prizes', icon: 'honors', at: [12, -12], look: [14, -14] },
  { id: 'sponsors', name: 'Sponsors', en: 'Sponsors', icon: 'cap', at: [0, -15.5], look: [0, -18] },
  { id: 'team', name: 'Team', en: 'Team', icon: 'heart', at: [-12, -12], look: [-14, -14] },
  { id: 'faq', name: 'FAQ', en: 'FAQ', icon: 'writing', at: [-17.5, -2], look: [-20, -2] },
  { id: 'venue', name: 'Venue', en: 'Venue', icon: 'map', at: [-12.5, 8], look: [-15, 8] },
  { id: 'register', name: 'Register', en: 'Register', icon: 'seal', at: [8, 19.5], look: [8, 22] },
  { id: 'mailbox', name: 'Mailbox', en: 'Mailbox', icon: 'mail', at: [0.5, 23.9], look: [0.5, 25.5] },
];

export const MAILBOX = { x: 0.5, z: 25.5, yaw: Math.PI };
export const PORTAL = null;
export const TREES = [[30, -12], [-28, -12], [28, 18], [-28, 18]];
