// Every station's build, by the id used in layout.js PLAN and index.html.
// To add a station: create world/stations/<id>.js (copy one of these), add it
// here, add it to PLAN in layout.js, and add <article data-station="<id>"> to
// index.html.
import welcome from './welcome.js';
import tracks from './tracks.js';
import schedule from './schedule.js';
import prizes from './prizes.js';
import sponsors from './sponsors.js';
import team from './team.js';
import faq from './faq.js';
import venue from './venue.js';
import register from './register.js';

export const BUILDS = { welcome, tracks, schedule, prizes, sponsors, team, faq, venue, register };
