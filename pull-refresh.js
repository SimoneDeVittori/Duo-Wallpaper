/* One-finger refresh from the top, including installed mobile web apps. */
(() => {
  if (!matchMedia('(pointer: coarse)').matches || !('ontouchstart' in window)) return;
  const indicator = document.createElement('div');
  indicator.className = 'pull-refresh';
  indicator.setAttribute('role', 'status');
  indicator.setAttribute('aria-live', 'polite');
  indicator.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 17.9 17"/></svg><span>' + duoT('Tira per aggiornare') + '</span>';
  document.body.append(indicator);
  document.documentElement.classList.add('touch-refresh-enabled');
  const label = indicator.querySelector('span');
  const threshold = 68;
  let start = null, distance = 0, pulling = false, refreshing = false;
  window.addEventListener('duo-language-change',()=>{label.textContent=duoT(refreshing?'Aggiornamento…':distance>=threshold?'Rilascia per aggiornare':'Tira per aggiornare')});
  const atTop = () => (document.scrollingElement?.scrollTop ?? window.scrollY) <= 0;
  const modalOpen = () => !!document.querySelector('dialog[open]');
  function reset() {
    start = null; distance = 0; pulling = false;
    indicator.classList.remove('visible', 'ready');
    indicator.style.setProperty('--pull', '0px');
    label.textContent = duoT('Tira per aggiornare');
  }
  document.addEventListener('touchstart', event => {
    if (refreshing) return;
    reset();
    if (event.touches.length !== 1 || !atTop() || modalOpen() || event.target.closest('input, textarea, select, button, a, [contenteditable]')) return;
    start = {x: event.touches[0].clientX, y: event.touches[0].clientY};
  }, {passive: true});
  document.addEventListener('touchmove', event => {
    if (!start || refreshing) return;
    if (event.touches.length !== 1 || modalOpen() || !atTop()) { reset(); return; }
    const dy = event.touches[0].clientY - start.y;
    const dx = Math.abs(event.touches[0].clientX - start.x);
    if (!pulling && dx > 10 && dx > Math.abs(dy)) { reset(); return; }
    if (dy <= 0) { reset(); return; }
    if (!pulling && dy < 10) return;
    if (!event.cancelable) { reset(); return; }
    event.preventDefault();
    pulling = true;
    distance = Math.min(100, dy * 0.48);
    indicator.style.setProperty('--pull', distance + 'px');
    indicator.classList.add('visible');
    indicator.classList.toggle('ready', distance >= threshold);
    const message = duoT(distance >= threshold ? 'Rilascia per aggiornare' : 'Tira per aggiornare');
    if (label.textContent !== message) label.textContent = message;
  }, {passive: false});
  document.addEventListener('touchend', event => {
    if (!start || refreshing) return;
    if (event.touches.length) { reset(); return; }
    if (!pulling || distance < threshold || modalOpen()) { reset(); return; }
    refreshing = true; start = null;
    indicator.classList.add('refreshing');
    label.textContent = duoT('Aggiornamento…');
    window.setTimeout(() => window.location.reload(), 180);
  }, {passive: true});
  document.addEventListener('touchcancel', () => { if (!refreshing) reset(); }, {passive: true});
})();
