// main.js

document.addEventListener("DOMContentLoaded", function () {
    // ---- Script สำหรับ Hamburger Menu ----
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const sidebarMenu = document.getElementById('sidebarMenu');

    if (hamburgerIcon && sidebarMenu) {
        hamburgerIcon.addEventListener('click', () => {
            hamburgerIcon.classList.toggle('open');
            sidebarMenu.classList.toggle('open');
        });
    }

    // ---- โค้ดสำหรับ Quote (พุทธพจน์สุ่ม) ----
    // ส่วนนี้จะทำงานก็ต่อเมื่อมี element ที่มี id="random-quote" ในหน้านั้นๆ
    const quoteElement = document.getElementById('random-quote');
    if (quoteElement) {
        fetch('/assets/data/quotes.json')
            .then(res => res.json())
            .then(data => {
                const quote = data[Math.floor(Math.random() * data.length)];
                quoteElement.innerHTML = `“${quote.quote}” <br><small>— ${quote.source}</small>`;
            })
            .catch(() => {
                quoteElement.innerText = "ไม่สามารถโหลดพุทธพจน์ได้";
            });
    }

    // ---- โค้ดสำหรับ Pali Dictionary (พจนานุกรมบาลี) ----
    let paliDict = [];
    const paliResult = document.getElementById('paliResult');
    const paliInput = document.getElementById('paliInput');

    // โหลดข้อมูลพจนานุกรม
    // ส่วนนี้จะทำงานเมื่อมี element ที่มี id="paliResult" หรือ id="paliInput"
    if (paliResult || paliInput) {
        fetch('/assets/data/pali.json')
            .then(res => res.json())
            .then(data => { paliDict = data; })
            .catch(() => {
                if(paliResult) {
                    paliResult.innerText = "❌ โหลดพจนานุกรมไม่สำเร็จ";
                }
            });
    }

    // จัดการการค้นหาในพจนานุกรม
    if (paliInput) {
        paliInput.addEventListener('input', function () {
            const input = this.value.trim().toLowerCase();
            const resultBox = document.getElementById('paliResult');
            if (!resultBox) return; // ออกถ้าไม่มีกล่องแสดงผล

            if (!input) {
                resultBox.innerHTML = '';
                resultBox.style.display = 'none';
                return;
            }

            const matches = paliDict.filter(entry => entry.headword.toLowerCase().includes(input));
            resultBox.style.display = 'block';
            resultBox.innerHTML = matches.length
                ? matches.slice(0, 10).map(entry => `<p><strong>${entry.headword}</strong>: ${entry.content}</p>`).join('')
                : `<p class="no-match">ไม่พบคำว่า "<strong>${input}</strong>"</p>`;
        });
    }

    // ---- โค้ดสำหรับเลื่อนหน้าจอไปยัง Section พจนานุกรมเมื่อพิมพ์ ----
    const dictionarySection = document.querySelector(".dictionary-section");
    if (paliInput && dictionarySection) {
        paliInput.addEventListener("input", function () {
            dictionarySection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }
});
