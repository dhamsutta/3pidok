document.addEventListener("DOMContentLoaded", function() {

    // --- 1. ฟังก์ชันสำหรับสคริปต์ที่ไม่เกี่ยวกับเมนู (ทำงานได้เลย) ---
    function initializeIndependentScripts() {
        // ---- โค้ดสำหรับ Quote (พุทธพจน์สุ่ม) ----
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
    }

    // --- 2. ฟังก์ชันสำหรับสคริปต์ที่ต้องรอให้โหลดเมนูเสร็จก่อน ---
    function initializeMenuScripts() {
        // ---- Script สำหรับ Hamburger Menu ----
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        const sidebarMenu = document.getElementById('sidebarMenu');
        if (hamburgerIcon && sidebarMenu) {
            hamburgerIcon.addEventListener('click', () => {
                hamburgerIcon.classList.toggle('open');
                sidebarMenu.classList.toggle('open');
            });
        }

        // ---- โค้ดสำหรับ Pali Dictionary ที่อยู่ใน Sidebar ----
        let paliDict = [];
        const paliResult = document.getElementById('paliResult');
        const paliInput = document.getElementById('paliInput');
        
        if (paliResult || paliInput) {
            fetch('/assets/data/pali.json')
                .then(res => res.json())
                .then(data => { paliDict = data; })
                .catch(() => {
                    if (paliResult) {
                        paliResult.innerText = "❌ โหลดพจนานุกรมไม่สำเร็จ";
                    }
                });
        }
        
        if (paliInput) {
            paliInput.addEventListener('input', function() {
                const input = this.value.trim().toLowerCase();
                const resultBox = document.getElementById('paliResult');
                if (!resultBox) return;

                if (!input) {
                    resultBox.innerHTML = '';
                    resultBox.style.display = 'none';
                    return;
                }
                const matches = paliDict.filter(entry => entry.headword.toLowerCase().includes(input));
                resultBox.style.display = 'block';
                resultBox.innerHTML = matches.length ?
                    matches.slice(0, 10).map(entry => `<p><strong>${entry.headword}</strong>: ${entry.content}</p>`).join('') :
                    `<p class="no-match">ไม่พบคำว่า "<strong>${input}</strong>"</p>`;
            });
        }
    }

    // --- 3. ฟังก์ชันหลักสำหรับโหลด Navigation Bar ---
    function loadNavigation() {
        fetch('/templates/main-nav.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                const navPlaceholder = document.getElementById('nav-placeholder');
                if (navPlaceholder) {
                    navPlaceholder.innerHTML = data;
                }
                // *** จุดสำคัญ: เรียกใช้สคริปต์ของเมนูหลังจากที่โหลด HTML เสร็จแล้ว ***
                initializeMenuScripts();
            })
            .catch(error => {
                console.error('ไม่สามารถโหลดไฟล์เมนูได้:', error);
            });
    }
    
    // --- 4. เริ่มการทำงาน ---
    loadNavigation(); // เริ่มโหลดเมนูก่อน
    initializeIndependentScripts(); // รันสคริปต์อื่นๆ ที่ไม่ต้องรอเมนู

});
