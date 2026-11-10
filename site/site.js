// The website layer: makes the 3D island usable by someone who has never
// played a game. It talks to the engine only through window.__home (the API
// listed in AGENTS.md), so engine updates don't touch it.
//
//   Top bar     plain links to every station; Register; "Page view" (?plain)
//   Hero        what the event is, when, a countdown; shown while the world loads
//   Name tags   a label over every station; click one to walk there and open it
//   Click       clicking a station's building does the same
//   Hint        one line on how to move, shown on the first visit
//   Prev/Next   inside each card, in tour order (layout.js PLAN)
//   #hash       an open card is in the address, so links to a station work
import * as THREE from 'three';
import { PLAN, STATIONS } from '@world/layout.js';
import { icon } from '@engine/ui/icons.js';
import { pixelText, textWidth } from '@engine/world/pixel-text.js';

const $ = s => document.querySelector(s);
const body = document.body;
const isPlain = () => body.classList.contains('plain');
const touch = matchMedia('(pointer: coarse)').matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
const ids = PLAN.map(p => p.id);
const stationOf = id => STATIONS.find(s => s.id === id);
const titleOf = id => document.querySelector(`#pages .page[data-station="${id}"] h2`)?.textContent.trim() || PLAN.find(p => p.id === id)?.en || id;

// ---------- Top bar ----------
const nav = $('#siteBar .site-nav');
for (const p of PLAN) {
  if (p.id === 'register') continue; // Register has its own button.
  const a = document.createElement('a');
  a.href = `#${p.id}`; a.dataset.go = p.id; a.textContent = p.en;
  nav.append(a);
}
const modeLink = document.createElement('a');
modeLink.className = 'site-mode-link'; modeLink.dataset.mode = ''; nav.append(modeLink);
const menu = $('#siteBar .site-menu');
menu?.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open));
});

// "Page view" and "3D view" swap with ?plain, which the engine already supports.
function syncModeLinks() {
  const url = new URL(location.href);
  if (isPlain()) url.searchParams.delete('plain'); else url.searchParams.set('plain', '');
  url.hash = '';
  for (const a of document.querySelectorAll('[data-mode]')) {
    a.href = url.pathname + url.search.replace('plain=', 'plain');
    if (!('keepText' in a.dataset)) a.textContent = isPlain() ? '3D view' : 'Page view';
  }
}

// Any [data-go] link: in 3D, jump to the station and open its card; on the
// plain page it is an ordinary anchor.
// Clicked while the world still loads: it opens as soon as the world is ready.
let queued = null;
document.addEventListener('click', e => {
  const link = e.target.closest('[data-go]');
  if (!link || isPlain()) return;
  e.preventDefault();
  nav.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false');
  if (!window.__home?.player) { queued = link.dataset.go; heroOn = false; body.classList.remove('hero-on'); return; }
  hideHero();
  window.__home.go(link.dataset.go);
});

// ---------- Hero ----------
const hero = $('#hero');
const logo = hero?.querySelector('.hero-logo');
// The title in the engine's 5×7 pixel font, with a hard drop shadow.
function drawLogo(plain) {
  if (!logo) return;
  const text = logo.dataset.text || 'LABYRINTH', scale = 8, w = textWidth(text, scale) + scale, h = 7 * scale + scale;
  logo.width = w; logo.height = h;
  const ctx = logo.getContext('2d');
  pixelText(ctx, text, scale, scale, scale, plain ? '#9fc28f' : '#1c140a');
  pixelText(ctx, text, 0, 0, scale, plain ? '#2f5b46' : '#f6e7b8');
}
drawLogo(false);

// Countdown to data-starts; live during the event; a closing line after data-ends.
const count = hero?.querySelector('.hero-count');
const starts = Date.parse(hero?.dataset.starts || ''), ends = Date.parse(hero?.dataset.ends || '');
function tick() {
  if (!count || Number.isNaN(starts)) return;
  const now = Date.now();
  if (now >= starts) {
    count.innerHTML = `<p>${!Number.isNaN(ends) && now >= ends ? 'That’s a wrap. Thanks for building with us!' : 'Hacking is live right now.'}</p>`;
    return;
  }
  const s = Math.floor((starts - now) / 1000);
  const parts = [[Math.floor(s / 86400), 'days'], [Math.floor(s / 3600) % 24, 'hours'], [Math.floor(s / 60) % 60, 'min'], [s % 60, 'sec']];
  count.innerHTML = parts.map(([n, l]) => `<div><b>${String(n).padStart(2, '0')}</b>${l}</div>`).join('');
}
tick();
setInterval(tick, 1000);

const go = hero?.querySelector('.hero-go');
let heroOn = false;
function showHero() { heroOn = true; body.classList.add('hero-on'); }
function hideHero() {
  if (!heroOn) return;
  heroOn = false; body.classList.remove('hero-on');
  window.__home?.rig.skipIntro();
  showHint();
}
go?.addEventListener('click', () => { if (isPlain()) location.href = $('[data-mode]').href; else hideHero(); });
addEventListener('keydown', e => {
  if (heroOn && window.__home && /^(Escape|Enter|Space|Key[WASD]|Arrow)/.test(e.code) && !e.target.closest?.('a, button, input, textarea')) hideHero();
});

// ---------- First-visit hint ----------
const hint = $('#siteHint');
function showHint() {
  if (!hint || store.get('labyrinth-hint') || isPlain()) return;
  hint.querySelector('span').innerHTML = touch
    ? 'Tap a building or its name to open it. Drag to look around.'
    : 'Click a building or its name to open it. Drag to look around, <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to walk.';
  hint.hidden = false;
}
function doneHint() { if (hint && !hint.hidden) { hint.hidden = true; store.set('labyrinth-hint', '1'); } }
hint?.querySelector('button').addEventListener('click', doneHint);

// ---------- Start ----------
// The hero shows at once (the page has something to read while the world
// loads), unless the address names a station: then that card opens directly.
const deepLink = ids.includes(location.hash.slice(1)) || location.hash === '#mailbox' ? location.hash.slice(1) : null;
syncModeLinks();
if (!deepLink && !isPlain()) showHero();
(function wait() {
  if (isPlain()) {
    body.classList.remove('hero-on'); syncModeLinks(); drawLogo(true);
    // Asked for the page view: the engine's "text version" notice would repeat the hero.
    if (new URLSearchParams(location.search).has('plain')) $('#startupNotice')?.setAttribute('hidden', '');
    if (go) { go.disabled = false; go.textContent = '▶ Open the 3D island'; }
    if (deepLink) document.getElementById(deepLink)?.scrollIntoView();
    return;
  }
  if (!window.__home?.player) {
    const bar = $('#loading .bar i');
    if (go && bar?.style.width) go.textContent = `Loading the island… ${parseInt(bar.style.width, 10) || 0}%`;
    requestAnimationFrame(wait);
    return;
  }
  ready(window.__home);
})();

function ready(h) {
  if (go) { go.disabled = false; go.textContent = '▶ Explore the island'; }
  const canvas = h.stage.renderer.domElement, camera = h.stage.camera, panel = $('#panel');

  // ---------- Name tags ----------
  const layer = $('#siteTags');
  const tags = PLAN.map(p => {
    const hs = h.world.hotspots.find(x => x.id === p.id);
    if (!hs) return null;
    const b = document.createElement('button');
    b.className = 'site-tag'; b.type = 'button'; b.dataset.id = p.id;
    b.title = titleOf(p.id);
    b.innerHTML = `<i style="background-image:url(${icon(p.icon).url})"></i>${p.en}`;
    b.addEventListener('click', () => visit(p.id));
    layer.append(b);
    const c = hs.box.getCenter(new THREE.Vector3());
    return { id: p.id, el: b, at: new THREE.Vector3(c.x, hs.box.max.y + 0.45, c.z), shown: true, w: 0, h: 0 };
  }).filter(Boolean);
  const v = new THREE.Vector3(), lastPos = new THREE.Vector3(Infinity), lastQ = new THREE.Quaternion();
  let W = innerWidth, H = innerHeight, force = true;
  addEventListener('resize', () => { W = innerWidth; H = innerHeight; force = true; });
  function placeTags() {
    const off = heroOn || body.classList.contains('reading') || h.rig.introActive || h.rig.firstPerson;
    if (layer.hidden !== off) layer.hidden = off;
    if (off) { force = true; return; }
    if (!force && camera.position.equals(lastPos) && camera.quaternion.equals(lastQ)) return;
    lastPos.copy(camera.position); lastQ.copy(camera.quaternion); force = false;
    for (const t of tags) {
      const d = camera.position.distanceTo(t.at);
      v.copy(t.at).project(camera);
      const show = v.z < 1 && d < 48 && Math.abs(v.x) < 1.15 && Math.abs(v.y) < 1.15;
      if (show !== t.shown) { t.el.hidden = !show; t.shown = show; }
      if (!show) continue;
      if (!t.w) { t.w = t.el.offsetWidth; t.h = t.el.offsetHeight; }
      const x = (v.x + 1) / 2 * W - t.w / 2, y = (1 - v.y) / 2 * H - t.h - 6;
      t.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      t.el.style.opacity = d < 18 ? '1' : Math.max(0.45, 1 - (d - 18) / 40).toFixed(2);
    }
  }

  // ---------- Fly there, then open ----------
  // Clicking any station button, dock slot, name tag, or 3D building flies
  // the player across the island to that station, lands on its feet, and opens the card.
  let pending = null;
  let flyingTarget = null;
  const nativeGo = h.go.bind(h);

  function flyToStation(id, instant = false) {
    if (isPlain()) return;
    hideHero();
    doneHint();

    const s = stationOf(id);
    if (!s || !h.player) {
      nativeGo(id);
      return;
    }

    const p = h.player.pos;
    const dist = Math.hypot(s.at[0] - p.x, s.at[1] - p.z);

    // If instant requested or player is already standing right at the station (< 2.2m)
    if (instant || dist < 2.2) {
      flyingTarget = null;
      nativeGo(id);
      return;
    }

    // Close any open card modal so the flight is completely unobstructed
    if (panel.open) {
      try { panel.close(); } catch { panel.removeAttribute('open'); }
      body.classList.remove('reading');
    }

    pending = null;
    flyingTarget = id;

    // Trigger autopilot flight
    const ok = h.player.flyTo(s.at[0], s.at[1]);
    if (!ok) {
      flyingTarget = null;
      nativeGo(id);
      return;
    }

    // Keep camera locked on avatar
    h.rig.recenter(h.player, true);
  }

  // Intercept h.go so all external/console and navigation calls fly to station
  h.go = function(id, instant = false) {
    if (instant) nativeGo(id);
    else flyToStation(id);
  };

  function visit(id) {
    flyToStation(id);
  }

  function arrive() {
    if (flyingTarget) {
      const s = stationOf(flyingTarget);
      const p = h.player.pos;
      const dist = s ? Math.hypot(s.at[0] - p.x, s.at[1] - p.z) : 999;

      // Keep waiting while player is cruising or descending
      if (h.player.travelling || h.player.flying || dist > 3.2) {
        return;
      }

      // Landed and arrived!
      const targetId = flyingTarget;
      flyingTarget = null;

      if (dist < 3.2 && s) {
        // Face towards the station's look point and align camera
        h.player.teleport(h.player.pos.x, h.player.pos.z, s);
        h.rig.recenter(h.player, true);
        if (s.show) {
          h.rig.showcase(...(h.stage.camera.aspect < 0.8 && s.showPortrait ? s.showPortrait : s.show));
        }
        if (s.page !== false) {
          h.openPage(targetId);
        }
      }
      return;
    }

    if (!pending) return;
    if (panel.open) { pending = null; return; }
    if (h.player.travelling) return;
    const s = stationOf(pending), p = h.player.pos;
    if (Math.hypot(s.at[0] - p.x, s.at[1] - p.z) < 2.0) h.openPage(pending);
    pending = null;
  }

  // ---------- Click or tap a building ----------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hit = new THREE.Vector3();
  function stationAt(x, y) {
    ndc.set(x / W * 2 - 1, -(y / H) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    let best = null, bestT = Infinity;
    for (const hs of h.world.hotspots) {
      if (!ray.ray.intersectBox(hs.box, hit)) continue;
      const t = hit.distanceTo(ray.ray.origin);
      if (t < bestT) { bestT = t; best = hs.id; }
    }
    return best;
  }
  let down = null;
  canvas.addEventListener('pointerdown', e => {
    down = { x: e.clientX, y: e.clientY, button: e.button };
    if (heroOn) hideHero();
    pending = null;
  });
  canvas.addEventListener('pointerup', e => {
    if (!down || down.button !== 0 || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down = null; return; }
    down = null;
    // Runs after the engine's own tap (walk to the clicked spot) and replaces it.
    const id = !h.rig.firstPerson && stationAt(e.clientX, e.clientY);
    if (id) visit(id);
  });
  // Hover: pointer cursor and a lit tag over anything that opens.
  let hoverAt = 0, hot = null;
  const world = $('#world');
  canvas.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || performance.now() - hoverAt < 80) return;
    hoverAt = performance.now();
    const id = heroOn || down ? null : stationAt(e.clientX, e.clientY);
    if (id === hot) return;
    hot = id;
    world.style.cursor = id ? 'pointer' : '';
    for (const t of tags) t.el.classList.toggle('hot', t.id === id);
  });

  // The engine closes a card on a click that misses its cards and controls,
  // which here includes plain card text. Clicks inside the card body stay in it.
  panel.addEventListener('click', e => {
    if (e.target.closest('#panel .body, #panel .tour') && !e.target.closest('a, button, form, input, textarea, select, label, [data-open]')) e.stopPropagation();
  }, true);

  // ---------- Prev / Next in the card, and the address ----------
  const tour = document.createElement('nav');
  tour.className = 'tour'; tour.setAttribute('aria-label', 'Stations');
  tour.innerHTML = '<button type="button" class="mc-button" data-step="-1"></button><span></span><button type="button" class="mc-button" data-step="1"></button>';
  panel.append(tour);
  const [prevB, label, nextB] = tour.children;
  tour.addEventListener('click', e => {
    const b = e.target.closest('[data-step]'); if (!b) return;
    const at = ids.indexOf(panel.dataset.station);
    h.go(ids[(at + Number(b.dataset.step) + ids.length) % ids.length]);
  });
  function onCard() {
    const id = panel.open ? panel.dataset.station : null, at = ids.indexOf(id);
    tour.hidden = at < 0;
    if (at >= 0) {
      const prev = ids[(at - 1 + ids.length) % ids.length], next = ids[(at + 1) % ids.length];
      prevB.textContent = `‹ ${PLAN[ids.indexOf(prev)].en}`;
      nextB.textContent = `${PLAN[ids.indexOf(next)].en} ›`;
      label.textContent = `${at + 1} / ${ids.length}`;
      doneHint();
    }
    for (const a of nav.querySelectorAll('a[data-go]')) a.setAttribute('aria-current', String(a.dataset.go === id));
    const url = new URL(location.href);
    url.hash = id && (at >= 0 || id === 'mailbox') ? id : '';
    if (url.href !== location.href) history.replaceState(history.state, '', url.hash ? url : url.pathname + url.search);
  }
  new MutationObserver(onCard).observe(panel, { attributes: true, attributeFilter: ['open', 'data-station'] });
  // Dock / Hotbar slot clicks: fly to station instead of instant teleport
  $('#hotbar')?.addEventListener('click', e => {
    const slot = e.target.closest('[data-station]');
    if (!slot) return;
    const id = slot.dataset.station;
    if (!id || id === 'portal') return;
    e.preventDefault();
    e.stopPropagation();
    flyToStation(id);
  }, true);

  if (queued || deepLink) { nativeGo(queued || deepLink); showHint(); }
  onCard();

  (function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    arrive();
    placeTags();
  })();
}
