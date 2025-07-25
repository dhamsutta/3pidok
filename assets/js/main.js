// รอให้โครงสร้าง HTML ทั้งหมดของหน้าเว็บโหลดเสร็จก่อน จึงจะเริ่มทำงาน
document.addEventListener("DOMContentLoaded", function() {

    // =================================================================
    //  1. Helper Functions (ฟังก์ชันตัวช่วย)
    // =================================================================

    // ฟังก์ชันแปลงเลขอารบิกเป็นเลขไทย
    function toThaiNumber(num) {
        const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
        return String(num).toString().split('').map(d => thaiDigits[d] || d).join('');
    }

    // ฟังก์ชันแปลงทุก <ol> ในหน้าให้ใช้เลขไทย (จะถูกเรียกใช้ตอนท้าย)
    function convertAllOlToThai() {
        const allOlElements = document.querySelectorAll("ol.thai, .main-content ol"); // เลือก ol ที่มีคลาส thai หรืออยู่ใน main-content
        allOlElements.forEach(ol => {
            const listItems = ol.querySelectorAll("li");
            const startValue = ol.hasAttribute('start') ? parseInt(ol.getAttribute('start')) : 1;
            
            listItems.forEach((li, index) => {
                // ป้องกันการใส่เลขซ้ำซ้อน
                if (li.querySelector('.thai-list-number')) return;

                li.style.listStyleType = "none";
                const itemNumber = toThaiNumber(startValue + index);
                li.insertAdjacentHTML("afterbegin", `<span class="thai-list-number" style="margin-right: 0.5em; display: inline-block; min-width: 2em;">${itemNumber}.</span>`);
            });
        });
    }


    // =================================================================
    //  2. Main Logic Functions (ฟังก์ชันหลัก)
    // =================================================================

    // --- ฟังก์ชันสำหรับสคริปต์ที่ไม่ขึ้นกับเมนู (ทำงานได้ทันที) ---
    function initializeIndependentScripts() {
        
        // ---- โค้ดสำหรับ Quote (พุทธพจน์สุ่ม) ----
        const quoteElement = document.getElementById('random-quote');
        if (quoteElement) {
            fetch('/assets/data/quotes.json')
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then(data => {
                    const quote = data[Math.floor(Math.random() * data.length)];
                    quoteElement.innerHTML = `“${quote.quote}” <br><small>— ${quote.source}</small>`;
                })
                .catch(error => {
                    console.error('Quote Error:', error);
                    quoteElement.innerText = "ไม่สามารถโหลดพุทธพจน์ได้";
                });
        }

        // --- โค้ดสำหรับ Scripture Explorer ---
        const bookSelect = document.getElementById('bookSelect');
        const bookOutput = document.getElementById('bookOutput');
        if (bookSelect && bookOutput) {
            let allBooksData = [];
            fetch('/assets/data/books.json')
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
                            <a href="${selectedBook.link}" class="read-more-btn">อ่านเพิ่มเติม →</a>
                        `;
                    }
                } else {
                    bookOutput.innerHTML = '<p>กรุณาเลือกเพื่อดูรายละเอียดและคำอธิบายเบื้องต้น</p>';
                }
            });
        }

        // --- Back to Top Button Logic ---
        const backToTopButton = document.getElementById("backToTopBtn");
        if (backToTopButton) {
            window.addEventListener("scroll", () => {
                if (window.pageYOffset > 300) {
                    backToTopButton.style.display = "block";
                } else {
                    backToTopButton.style.display = "none";
                }
            });

            backToTopButton.addEventListener("click", (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    }

    // --- ฟังก์ชันสำหรับสคริปต์ที่ต้องรอให้โหลดเมนู/Footer เสร็จก่อน ---
    function initializeDependentScripts() {
        
        // ---- Script สำหรับ Hamburger Menu ----
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        const sidebarMenu = document.getElementById('sidebarMenu');
        if (hamburgerIcon && sidebarMenu) {
            hamburgerIcon.addEventListener('click', (e) => {
                e.stopPropagation(); // หยุดไม่ให้ event click ลามไปถึง document
                hamburgerIcon.classList.toggle('open');
                sidebarMenu.classList.toggle('open');
            });

            document.addEventListener('click', function(event) {
                const isClickInsideMenu = sidebarMenu.contains(event.target);
                const isClickOnIcon = hamburgerIcon.contains(event.target);
                if (sidebarMenu.classList.contains('open') && !isClickInsideMenu && !isClickOnIcon) {
                    sidebarMenu.classList.remove('open');
                    hamburgerIcon.classList.remove('open');
                }
            });
        }

        // ---- โค้ดสำหรับ Pali Dictionary ที่อยู่ใน Footer ----
        let paliDict = [];
        const paliInput = document.getElementById('paliInput');
        const paliResult = document.getElementById('paliResult');
        if (paliInput && paliResult) {
            fetch('/assets/data/pali.json')
                .then(res => res.json())
                .then(data => { paliDict = data; })
                .catch(error => {
                    console.error('Pali Dictionary Error:', error);
                    paliResult.innerText = "❌ โหลดพจนานุกรมไม่สำเร็จ";
                });
            
            paliInput.addEventListener('input', function() {
                const input = this.value.trim().toLowerCase();
                if (!input) {
                    paliResult.innerHTML = '';
                    paliResult.style.display = 'none';
                    return;
                }
                const matches = paliDict.filter(entry => entry.headword.toLowerCase().includes(input));
                paliResult.style.display = 'block';
                paliResult.innerHTML = matches.length ?
                    matches.slice(0, 10).map(entry => `<p><strong>${entry.headword}</strong>: ${entry.content}</p>`).join('') :
                    `<p class="no-match">ไม่พบคำว่า "<strong>${input}</strong>"</p>`;
            });
        }
    }

    // --- ฟังก์ชันสำหรับโหลด Navigation และ Footer (Templates) ---
    function loadTemplates() {
        // โหลด Nav
        fetch('/templates/main-nav.html')
            .then(response => response.ok ? response.text() : Promise.reject('Nav Load Error'))
            .then(data => {
                const navPlaceholder = document.getElementById('nav-placeholder');
                if (navPlaceholder) navPlaceholder.innerHTML = data;
                // ไม่มีสคริปต์ที่ต้องรอ Nav โดยตรงแล้ว จึงเอาออกจากตรงนี้
            })
            .catch(error => console.error('ไม่สามารถโหลดไฟล์เมนูได้:', error));

        // โหลด Footer
        fetch('/templates/main-footer.html')
            .then(response => response.ok ? response.text() : Promise.reject('Footer Load Error'))
            .then(data => {
                const footerPlaceholder = document.getElementById('footer-placeholder');
                if (footerPlaceholder) {
                    footerPlaceholder.innerHTML = data;
                    const yearSpan = document.getElementById('current-year');
                    if (yearSpan) yearSpan.textContent = new Date().getFullYear() + 543; // พ.ศ.
                }
                // สคริปต์ที่ต้องรอให้ Nav และ Footer โหลดเสร็จจะถูกเรียกใช้จากที่นี่
                initializeDependentScripts();
            })
            .catch(error => console.error('ไม่สามารถโหลดไฟล์ footer ได้:', error));
    }


    // =================================================================
    //  3. Start Execution (เริ่มการทำงานทั้งหมด)
    // =================================================================
    
    loadTemplates(); // เริ่มจากโหลด Templates (Nav, Footer) ก่อน
    initializeIndependentScripts(); // เรียกใช้สคริปต์ที่ไม่เกี่ยวข้องกับ Templates ได้เลย
    convertAllOlToThai(); // แปลง list เป็นเลขไทย

});
