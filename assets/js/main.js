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

// --- START: โค้ดสำหรับ Scripture Explorer (Dropdown เลือกคัมภีร์) ---
    const bookSelect = document.getElementById('bookSelect');
    const bookOutput = document.getElementById('bookOutput');

    // ตรวจสอบก่อนว่ามี element นี้ในหน้าเว็บหรือไม่
    if (bookSelect && bookOutput) {
        let allBooksData = []; // สร้างตัวแปรเพื่อเก็บข้อมูลหนังสือทั้งหมด

        // 5. โหลดข้อมูลจากไฟล์ books.json
        fetch('/assets/data/books.json')
            .then(response => response.json())
            .then(data => {
                allBooksData = data; // เก็บข้อมูลไว้ในตัวแปร
                
                // 2. สร้างตัวเลือก <option> ใน dropdown
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

        // 3. เพิ่ม Event Listener เพื่อรอรับการเลือกจากผู้ใช้
        bookSelect.addEventListener('change', function() {
            const selectedId = this.value; // ดึงค่า value ของ option ที่ถูกเลือก

            if (selectedId) {
                // ค้นหาข้อมูลหนังสือจาก id ที่เลือก
                const selectedBook = allBooksData.find(book => book.id === selectedId);
                
                if (selectedBook) {
                    // แสดงผลในกล่อง bookOutput
                    bookOutput.innerHTML = `
                        <h3>${selectedBook.title}</h3>
                        <p>${selectedBook.description}</p>
                    `;
                }
            } else {
                // ถ้าผู้ใช้เลือก "-- ค้นหาตามชื่อ --" ให้กลับเป็นข้อความเริ่มต้น
                bookOutput.innerHTML = 'กรุณาเลือกเพื่อดูรายละเอียดและคำอธิบายเบื้องต้น';
            }
        });
    }
    // --- END: โค้ดสำหรับ Scripture Explorer ---



    

});
