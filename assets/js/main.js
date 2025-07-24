document.addEventListener("DOMContentLoaded", function() {

    // =================================================================
    //  1. Helper Functions (ฟังก์ชันตัวช่วย)
    // =================================================================

    // ฟังก์ชันแปลงเลขอารบิกเป็นเลขไทย
    function toThaiNumber(num) {
        const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
        return String(num).split('').map(d => thaiDigits[d] || d).join('');
    }

    // ฟังก์ชันแปลงทุก <ol> ให้ใช้เลขไทย
    function convertAllOlToThai() {
        const allOl = document.querySelectorAll("ol");
        allOl.forEach(ol => {
            const items = ol.querySelectorAll("li");
            items.forEach((li, idx) => {
                // ป้องกันการใส่เลขซ้ำ
                if (li.querySelector('.thai-list-number')) return;

                li.style.listStyleType = "none";
                const thaiNum = toThaiNumber(idx + 1);
                li.insertAdjacentHTML("afterbegin", `<span class="thai-list-number" style="margin-right: 0.5em;">${thaiNum}.</span>`);
            });
        });
    }


    // =================================================================
    //  2. Main Logic Functions (ฟังก์ชันหลัก)
    // =================================================================

    // --- ฟังก์ชันสำหรับสคริปต์ที่ไม่เกี่ยวกับเมนู (ทำงานได้เลย) ---
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
                        `;
                    }
                } else {
                    bookOutput.innerHTML = 'กรุณาเลือกเพื่อดูรายละเอียดและคำอธิบายเบื้องต้น';
                }
            });
        }
    }

    // --- ฟังก์ชันสำหรับสคริปต์ที่ต้องรอให้โหลดเมนูเสร็จก่อน ---
    function initializeMenuScripts() {
        // ---- Script สำหรับ Hamburger Menu ----
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        const sidebarMenu = document.getElementById('sidebarMenu');
        if (hamburgerIcon && sidebarMenu) {
            hamburgerIcon.addEventListener('click', () => {
                hamburgerIcon.classList.toggle('open');
                sidebarMenu.classList.toggle('open');
            });

            document.addEventListener('click', function(event) {
                const isMenuOpen = sidebarMenu.classList.contains('open');
                const isClickInsideIcon = hamburgerIcon.contains(event.target);
                const isClickInsideMenu = sidebarMenu.contains(event.target);
                if (isMenuOpen && !isClickInsideIcon && !isClickInsideMenu) {
                    sidebarMenu.classList.remove('open');
                    hamburgerIcon.classList.remove('open');
                }
            });
        }

        // ---- โค้ดสำหรับ Pali Dictionary ที่อยู่ใน Sidebar ----
        let paliDict = [];
        const paliResult = document.getElementById('paliResult');
        const paliInput = document.getElementById('paliInput');
        if (paliInput) { // เช็คแค่ Input ก็พอ
            fetch('/assets/data/pali.json')
                .then(res => res.json())
                .then(data => { paliDict = data; })
                .catch(error => {
                    console.error('Pali Dictionary Error:', error);
                    if (paliResult) {
                        paliResult.innerText = "❌ โหลดพจนานุกรมไม่สำเร็จ";
                    }
                });
            
            paliInput.addEventListener('input', function() {
                const input = this.value.trim().toLowerCase();
                if (!paliResult) return;
                if (!input) {
                    paliResult.innerHTML = '';
                    paliResult.style.display = 'none';
                    return;
                }
                const matches = paliDict.filter(entry => entry.headword.toLowerCase().includes(input));
                paliResult.style.display = 'block';
                resultBox.innerHTML = matches.length ?
                    matches.slice(0, 10).map(entry => `<p><strong>${entry.headword}</strong>: ${entry.content}</p>`).join('') :
                    `<p class="no-match">ไม่พบคำว่า "<strong>${input}</strong>"</p>`;
            });
        }
    }

    // --- ฟังก์ชันสำหรับโหลด Navigation Bar ---
    function loadNavigation() {
        fetch('/templates/main-nav.html')
            .then(response => { if (!response.ok) throw new Error('Nav Load Error'); return response.text(); })
            .then(data => {
                const navPlaceholder = document.getElementById('nav-placeholder');
                if (navPlaceholder) {
                    navPlaceholder.innerHTML = data;
                }
                initializeMenuScripts(); // <-- เรียกใช้สคริปต์เมนูหลังโหลดเสร็จ
            })
            .catch(error => {
                console.error('ไม่สามารถโหลดไฟล์เมนูได้:', error);
            });
    }
    
    // --- ฟังก์ชันสำหรับโหลด Footer ---
    function loadFooter() {
        fetch('/templates/main-footer.html')
            .then(response => { if (!response.ok) throw new Error('Footer Load Error'); return response.text(); })
            .then(data => {
                const footerPlaceholder = document.getElementById('footer-placeholder');
                if (footerPlaceholder) {
                    footerPlaceholder.innerHTML = data;
                    const yearSpan = document.getElementById('current-year');
                    if (yearSpan) {
                        yearSpan.textContent = new Date().getFullYear() + 543; // พ.ศ.
                    }
                }
            })
            .catch(error => {
                console.error('ไม่สามารถโหลดไฟล์ footer ได้:', error);
            });
    }


    // =================================================================
    //  3. Start Execution (เริ่มการทำงานทั้งหมด)
    // =================================================================
    
    loadNavigation();
    loadFooter();
    initializeIndependentScripts();
    convertAllOlToThai();

});


// --- Back to Top Button Logic ---
const backToTopButton = document.getElementById("back-to-top");

if (backToTopButton) {
    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) { // แสดงปุ่มเมื่อเลื่อนลงมา 300px
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });

    backToTopButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

