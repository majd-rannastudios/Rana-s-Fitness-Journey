import './style.css';

// ── Tab switching ─────────────────────────────────────────────────────────
function switchDay(day) {
  document.querySelectorAll('.day-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('day' + day).classList.add('active');
  document.querySelectorAll('.tab')[day - 1].classList.add('active');
  localStorage.setItem('rana_active_day', day);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.switchDay = switchDay;

const saved = localStorage.getItem('rana_active_day');
if (saved && saved !== '1') switchDay(parseInt(saved));

// ── Exercise Timers ───────────────────────────────────────────────────────
const _T = {};
function _fmt(s) { return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }

function timerToggle(id, secs) {
  if (!_T[id]) _T[id] = { rem: secs, running: false };
  const t = _T[id];
  if (t.running) {
    clearInterval(t.iv); t.running = false;
    document.getElementById(id+'-s').textContent = '\u25B6 Resume';
  } else {
    t.running = true;
    document.getElementById(id+'-s').textContent = '\u23F8 Pause';
    t.iv = setInterval(() => {
      t.rem--;
      document.getElementById(id+'-d').textContent = _fmt(t.rem);
      if (t.rem <= 0) {
        clearInterval(t.iv); t.running = false;
        if (navigator.vibrate) navigator.vibrate([200,100,200]);
        document.getElementById(id+'-s').textContent = '\u25B6 Start';
        if (id === 'sidepl') {
          const sEl = document.getElementById('sidepl-side');
          if (sEl.textContent === 'LEFT SIDE') {
            sEl.textContent = 'RIGHT SIDE';
            _T.sidepl = { rem: secs, running: false };
            document.getElementById('sidepl-d').textContent = _fmt(secs);
            document.getElementById('sidepl-s').textContent = '\u25B6 Start';
          } else {
            sEl.textContent = '\u2713 DONE';
          }
        }
      }
    }, 1000);
  }
}

function timerReset(id, secs) {
  if (_T[id]) clearInterval(_T[id].iv);
  _T[id] = { rem: secs, running: false };
  document.getElementById(id+'-d').textContent = _fmt(secs);
  document.getElementById(id+'-s').textContent = '\u25B6 Start';
  if (id === 'sidepl') document.getElementById('sidepl-side').textContent = 'LEFT SIDE';
}

function hiitToggle(id, work, rest, rounds) {
  if (!_T[id]) _T[id] = { phase:'work', round:1, rem:work, running:false, work, rest, rounds };
  const t = _T[id];
  if (t.running) {
    clearInterval(t.iv); t.running = false;
    document.getElementById(id+'-s').textContent = '\u25B6 Resume';
  } else {
    t.running = true;
    document.getElementById(id+'-s').textContent = '\u23F8 Pause';
    document.getElementById(id+'-ph').textContent = t.phase === 'work' ? 'WORK' : 'REST';
    t.iv = setInterval(() => {
      t.rem--;
      document.getElementById(id+'-d').textContent = _fmt(t.rem);
      if (t.rem > 0) return;
      if (navigator.vibrate) navigator.vibrate(t.phase==='work' ? [300] : [100,80,100,80,100]);
      const dEl = document.getElementById(id+'-d');
      if (t.phase === 'work') {
        t.phase = 'rest'; t.rem = t.rest;
        dEl.classList.add('rest');
        document.getElementById(id+'-ph').textContent = 'REST';
      } else {
        t.round++;
        if (t.round > t.rounds) {
          clearInterval(t.iv); t.running = false;
          document.getElementById(id+'-ph').textContent = 'DONE!';
          document.getElementById(id+'-r').textContent = 'All '+t.rounds+' rounds complete';
          document.getElementById(id+'-s').textContent = '\u25B6 Start';
          return;
        }
        t.phase = 'work'; t.rem = t.work;
        dEl.classList.remove('rest');
        document.getElementById(id+'-ph').textContent = 'WORK';
        document.getElementById(id+'-r').textContent = 'Round '+t.round+' / '+t.rounds;
      }
      dEl.textContent = _fmt(t.rem);
    }, 1000);
  }
}

function hiitReset(id, work, rest, rounds) {
  if (_T[id]) clearInterval(_T[id].iv);
  _T[id] = { phase:'work', round:1, rem:work, running:false, work, rest, rounds };
  const d = document.getElementById(id+'-d');
  d.textContent = _fmt(work); d.classList.remove('rest');
  document.getElementById(id+'-ph').textContent = 'READY';
  document.getElementById(id+'-r').textContent = 'Round 1 / '+rounds;
  document.getElementById(id+'-s').textContent = '\u25B6 Start';
}

document.getElementById('plank-s').addEventListener('click', () => timerToggle('plank', 45));
document.getElementById('plank-r').addEventListener('click', () => timerReset('plank', 45));
document.getElementById('sidepl-s').addEventListener('click', () => timerToggle('sidepl', 30));
document.getElementById('sidepl-r').addEventListener('click', () => timerReset('sidepl', 30));
document.getElementById('hiit1-s').addEventListener('click', () => hiitToggle('hiit1', 40, 20, 3));
document.getElementById('hiit1-rst').addEventListener('click', () => hiitReset('hiit1', 40, 20, 3));
document.getElementById('hiit2-s').addEventListener('click', () => hiitToggle('hiit2', 30, 30, 3));
document.getElementById('hiit2-rst').addEventListener('click', () => hiitReset('hiit2', 30, 30, 3));
