document.addEventListener("DOMContentLoaded", function () {
  fetch('/assets/data/quotes.json')
    .then(res => res.json())
    .then(data => {
      const quote = data[Math.floor(Math.random() * data.length)];
      const box = document.getElementById('random-quote');
      box.innerHTML = `
        <blockquote>
          <p>${quote.quote}</p>
          <footer>— ${quote.source}</footer>
        </blockquote>
      `;
    })
    .catch(err => {
      document.getElementById('random-quote').innerText = "เกิดข้อผิดพลาดในการโหลดพุทธพจน์";
    });
});
