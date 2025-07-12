
const audio = document.getElementById('player');
const container = document.getElementById('text-container');
let lines = [];

fetch('data/data.json')
  .then(res => res.json())
  .then(data => {
    lines = data;
    data.forEach((item, index) => {
      const row = document.createElement('div');
      row.classList.add('verse-row');
      row.id = 'line-' + index;

      const left = document.createElement('div');
      left.classList.add('pali');
      left.textContent = item.pali;

      const right = document.createElement('div');
      right.classList.add('thai');
      right.textContent = item.thai;

      row.appendChild(left);
      row.appendChild(right);
      container.appendChild(row);
    });
  });

audio.addEventListener('timeupdate', () => {
  const current = audio.currentTime;
  lines.forEach((line, index) => {
    const el = document.getElementById('line-' + index);
    if (current >= line.start && current <= line.end) {
      el.classList.add('highlight');
    } else {
      el.classList.remove('highlight');
    }
  });
});
