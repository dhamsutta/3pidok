// สคริปต์นี้จะทำงานเมื่อโครงสร้าง HTML ของหน้าโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('alphabetical-tag-container');
    
    // ถ้าไม่เจอ element นี้ในหน้า ให้หยุดทำงานทันที (เพื่อไม่ให้เกิด error ในหน้าอื่น)
    if (!container) return; 

    const dataUrl = '../assets/data/tags.json';

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
            // 1. รวบรวม Tag ทั้งหมดที่ไม่ซ้ำกัน
            const allTags = new Set();
            posts.forEach(post => {
                if (post.tags && Array.isArray(post.tags)) {
                    post.tags.forEach(tag => allTags.add(tag.trim()));
                }
            });

            // 2. แปลง Set เป็น Array และเรียงลำดับตามตัวอักษรไทย
            const sortedTags = Array.from(allTags).sort((a, b) => a.localeCompare(b, 'th'));

            if (sortedTags.length === 0) {
                container.innerHTML = '<p class="loading-message">ยังไม่มีป้ายกำกับในระบบ</p>';
                return;
            }
            
            // 3. จัดกลุ่ม Tag ตามพยัญชนะตัวแรก
            const groupedTags = sortedTags.reduce((acc, tag) => {
                const firstLetter = tag[0];
                if (!acc[firstLetter]) {
                    acc[firstLetter] = [];
                }
                acc[firstLetter].push(tag);
                return acc;
            }, {});

            // 4. สร้าง HTML แล้วนำไปแสดงผล
            container.innerHTML = ''; // เคลียร์ข้อความ "กำลังโหลด..." ออก
            
            for (const letter in groupedTags) {
                const groupSection = document.createElement('section');
                groupSection.className = 'tag-group';

                const header = document.createElement('h2');
                header.className = 'tag-group-header';
                header.textContent = letter;
                groupSection.appendChild(header);

                const linksDiv = document.createElement('div');
                linksDiv.className = 'tag-links';
                
                groupedTags[letter].forEach(tag => {
                    const link = document.createElement('a');
                    link.className = 'tag-item';
                    // สร้าง URL สำหรับหน้าของแต่ละ tag
                    link.href = `/tags/${encodeURIComponent(tag)}.html`; 
                    link.textContent = tag;
                    linksDiv.appendChild(link);
                });

                groupSection.appendChild(linksDiv);
                container.appendChild(groupSection);
            }
        })
        .catch(error => {
            console.error('Error fetching or processing tags:', error);
            container.innerHTML = '<p class="error-message">เกิดข้อผิดพลาดในการโหลดข้อมูลป้ายกำกับ</p>';
        });
});
