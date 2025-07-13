document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audioPlayer');
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

        const left = document.createElement('div');
        left.className = 'pali';
        left.textContent = item.pali;

        const right = document.createElement('div');
        right.className = 'thai';
        // ✅ แปลง \n เป็น <br> เพื่อให้แสดงบรรทัด
        right.innerHTML = item.thai.replace(/\n/g, "<br>");

        row.appendChild(left);
        row.appendChild(right);
        container.appendChild(row);
      });
    });

  audio.addEventListener('timeupdate', () => {
    const current = audio.currentTime;
    lines.forEach((line, index) => {
      const el = document.getElementById('line-' + index);
      if (!el) return;
      if (current >= line.start && current <= line.end) {
        el.classList.add('highlight');
      } else {
        el.classList.remove('highlight');
      }
    });
  });
});
