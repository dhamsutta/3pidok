#!/usr/bin/env python3
import os
import datetime

# ✏️ เปลี่ยนเป็น URL หลักของคุณ (ต้องมี / ข้างท้าย)
BASE_URL   = "https://www.dhamma-sutta.com/"

# ชื่อไฟล์ sitemap ที่จะสร้าง
OUTPUT_FILE = "sitemap.xml"

# ถ้ามีหน้าอยากไม่รวมให้ใส่ชื่อไฟล์ลงในนี้ ( เช่น 404.html )
EXCLUDE = {"404.html", "draft.html"}

# กำหนดเวลาปัจจุบันให้ lastmod
now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

urls = []
# เดินหาไฟล์ .html ทั้งหมดในโฟลเดอร์เว็บ
for root, dirs, files in os.walk("."):
    for f in files:
        if f.endswith(".html") and f not in EXCLUDE:
            # สร้าง URL จาก path
            rel_path = os.path.relpath(os.path.join(root, f), ".")
            url = BASE_URL + rel_path.replace(os.path.sep, "/")
            urls.append(url)

# เขียน sitemap.xml
with open(OUTPUT_FILE, "w", encoding="utf-8") as fp:
    fp.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    fp.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u in sorted(urls):
        fp.write("  <url>\n")
        fp.write(f"    <loc>{u}</loc>\n")
        fp.write(f"    <lastmod>{now}</lastmod>\n")
        fp.write("  </url>\n")
    fp.write("</urlset>\n")

print(f"✓ Generated {OUTPUT_FILE} with {len(urls)} URLs")
