// /abhidhamma/js/sync.js  (หลังแก้)
document.addEventListener('DOMContentLoaded', () => {
  const audio   = document.getElementById('audioPlayer');   // หรือ 'player' ให้ตรงกัน
  const container = document.getElementById('text-container');
  let lines = [];

  fetch('/abhidhamma/data/data.json')
    .then(res => res.json())
    .then(data => {
      lines = data;
      data.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'verse-row';
        row.id = 'line-' + index;

        row.innerHTML = `
          <div class="pali">${item.pali}</div>
          <div class="thai">${item.thai}</div>
        `;
        container.appendChild(row);
      });
    })
    .catch(err => console.error('โหลด JSON ไม่ได้:', err));

  if (audio) {
    audio.addEventListener('timeupdate', () => {
      const current = audio.currentTime;
      lines.forEach((line, i) => {
        const el = document.getElementById('line-' + i);
        if (!el) return;
        el.classList.toggle('highlight', current >= line.start && current <= line.end);
      });
    });
  }
});
