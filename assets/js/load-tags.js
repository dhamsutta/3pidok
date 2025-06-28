fetch('/assets/data/tags.json')
  .then(response => response.json())
  .then(data => {
    const tagName = 'วินัย'; // ระบุชื่อแท็กของหน้านี้
    const list = document.getElementById('tag-list');
    list.innerHTML = ''; // เคลียร์ข้อความกำลังโหลด

    const filtered = data.filter(post => post.tags.includes(tagName));
    if (filtered.length === 0) {
      list.innerHTML = '<li>ไม่พบบทความในแท็กนี้</li>';
    } else {
      filtered.forEach(post => {
        const li = document.createElement('li');
        const tagsHtml = post.tags.map(t => `<a href="/tags/${encodeURIComponent(t)}.html" class="tag">${t}</a>`).join(' ');
        li.innerHTML = `
          <a href="${post.url}">${post.title}</a><br>
          <small>${post.description}</small><br>
          <div class="tags">${tagsHtml}</div>
        `;
        list.appendChild(li);
      });
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById('tag-list').innerHTML = '<li>เกิดข้อผิดพลาดในการโหลดบทความ</li>';
  });
