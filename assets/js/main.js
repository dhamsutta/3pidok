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

        // --- START: โค้ดสำหรับ Scripture Explorer (ย้ายมาไว้ในนี้) ---
        const bookSelect = document.getElementById('bookSelect');
        const bookOutput = document.getElementById('bookOutput');

        if (bookSelect && bookOutput) {
            let allBooksData = []; 
            fetch('assets/data/books.json')
                .then(response => response.json())
                .then(data => {
                    allBooksData = data;
                    allBooksData.forEach(book => {
                        const option = document.createElement('option');
                        option.value = book.id;
                        option.textContent = book.title;
                        bookSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('ไม่สามารถโหลดข้อมูลคัมภีร์ได้:', error);
                    bookOutput.innerHTML = '<p style="color:red;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
                });

            bookSelect.addEventListener('change', function() {
                const selectedId = this.value;
                if (selectedId) {
                    const selectedBook = allBooksData.find(book => book.id === selectedId);
                    if (selectedBook) {
                        bookOutput.innerHTML = `
                            <h3>${selectedBook.title}</h3>
                            <p>${selectedBook.description}</p>
                        `;
                    }
                } else {
                    bookOutput.innerHTML = 'กรุณาเลือกเพื่อดูรายละเอียดและคำอธิบายเบื้องต้น';
                }
            });
        }
        // --- END: โค้ดสำหรับ Scripture Explorer ---
    }

    // --- 2. ฟังก์ชันสำหรับสคริปต์ที่ต้องรอให้โหลดเมนูเสร็จก่อน ---
function initializeMenuScripts() {
    // ---- Script สำหรับ Hamburger Menu ----
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const sidebarMenu = document.getElementById('sidebarMenu');
    
    if (hamburgerIcon && sidebarMenu) {
        // โค้ดเดิมสำหรับกดที่ไอคอนเพื่อเปิด/ปิด
        hamburgerIcon.addEventListener('click', () => {
            hamburgerIcon.classList.toggle('open');
            sidebarMenu.classList.toggle('open');
        });

        // --- START: เพิ่มโค้ดสำหรับปิดเมนูเมื่อคลิกข้างนอก ---
        document.addEventListener('click', function(event) {
            const isMenuOpen = sidebarMenu.classList.contains('open');
            const isClickInsideIcon = hamburgerIcon.contains(event.target);
            const isClickInsideMenu = sidebarMenu.contains(event.target);

            if (isMenuOpen && !isClickInsideIcon && !isClickInsideMenu) {
                sidebarMenu.classList.remove('open');
                hamburgerIcon.classList.remove('open');
            }
        });
        // --- END: สิ้นสุดโค้ดที่เพิ่ม ---
    }

    // ---- โค้ดสำหรับ Pali Dictionary ที่อยู่ใน Sidebar ----
    // ... (โค้ดส่วนนี้เหมือนเดิมทุกอย่าง) ...
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
                initializeMenuScripts();
            })
            .catch(error => {
                console.error('ไม่สามารถโหลดไฟล์เมนูได้:', error);
            });
    }
    
    // --- 4. เริ่มการทำงาน ---
    loadNavigation();
    initializeIndependentScripts();

});
