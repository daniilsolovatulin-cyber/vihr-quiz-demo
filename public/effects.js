function renderSoundSettings() {
  const host = document.getElementById('soundSettings');
  const toggle = (id, label, enabled) => `<div class="sound-toggle-row"><label id="${id}Label">${label}</label><button type="button" id="${id}" class="switch ${enabled ? 'on' : ''}" role="switch" aria-labelledby="${id}Label" aria-checked="${enabled}"><span class="switch-knob"></span></button></div>`;
  host.innerHTML = toggle('allSoundSwitch', 'Звуки и музыка', !Sound.isMuted()) + toggle('effectsSwitch', 'Нажатия, победа и ошибки', Sound.isSfxEnabled()) + `
    <div class="field"><label for="settingsSfxVolume">Громкость эффектов</label><input id="settingsSfxVolume" type="range" min="0" max="100" value="${Math.round(Sound.getSfxVolume()*100)}"></div>
    <div class="field"><label for="settingsMusicVolume">Громкость музыки</label><input id="settingsMusicVolume" type="range" min="0" max="100" value="${Math.round(Sound.getMusicVolume()*100)}"></div>
    <button class="btn-secondary" id="previewVictory" type="button">Проверить звук победы</button>`;
  document.getElementById('allSoundSwitch').onclick = () => { Sound.setMuted(!Sound.isMuted()); renderSoundSettings(); };
  document.getElementById('effectsSwitch').onclick = () => { Sound.setSfxEnabled(!Sound.isSfxEnabled()); renderSoundSettings(); };
  document.getElementById('settingsSfxVolume').oninput = e => Sound.setSfxVolume(Number(e.target.value)/100);
  document.getElementById('settingsMusicVolume').oninput = e => Sound.setMusicVolume(Number(e.target.value)/100);
  document.getElementById('previewVictory').onclick = () => Sound.victory();
}

function celebrate() {
  document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#4d6bfe', '#8b7fd6', '#3f9f6f', '#e0b64f', '#d9614f'];
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.setAttribute('aria-hidden', 'true');
    Object.assign(piece.style, { left: `${Math.random()*100}%`, background: colors[i%colors.length], animationDuration: `${2.4+Math.random()*1.6}s`, animationDelay: `${Math.random()*.4}s`, transform: `rotate(${Math.random()*360}deg)` });
    piece.addEventListener('animationend', () => piece.remove(), { once: true });
    setTimeout(() => piece.remove(), 4600);
    fragment.appendChild(piece);
  }
  document.body.appendChild(fragment);
}

// Capture runs before navigation replaces the clicked element. Sound.click also
// coalesces the explicit game handlers so a single tap never produces two clicks.
document.addEventListener('click', e => {
  const button = e.target.closest('button, a, [role="button"], .chip, .mode-card, .emoji-opt, .color-opt');
  if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true' || button.getAttribute('role') === 'switch' || button.id === 'previewVictory' || button.id === 'testSoundBtn') return;
  Sound.click();
}, true);
window.addEventListener('offline', () => showToast('Нет интернета. Проверь подключение.', ICONS.wifi));
