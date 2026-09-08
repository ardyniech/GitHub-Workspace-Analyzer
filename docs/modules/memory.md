# Agent Memory Module

Modul **Agent Memory & Knowledge Base** memungkinkan AI Agent mengingat konteks penting secara persisten:

## Kategori Memori yang Disimpan
1. **Progres Repo (`repo_progress`)**:
   - Secara otomatis mencatat riwayat commit, push, pembuatan file, dan audit dependensi per repositori.
2. **Tools & Skill (`tool_skill`)**:
   - Mengingat seluruh daftar modul aktif (Security Auditor, Peer Reviewer, Tester, Analytics, Live Voice, dll.) serta protokol mutlak SOP Zero Mistake.
3. **Percakapan (`conversation`)**:
   - Mengingat topik dan ringkasan insight percakapan sebelumnya untuk referensi respons di masa mendatang.
4. **Preferensi Pengguna (`user_preference`)**:
   - Catatan manual pengguna untuk preferensi arsitektur, styling, atau instruksi khusus.

## Mekanisme
- **Injeksi Otomatis ke Prompt Context**: Setiap panggilan AI Copilot (`useAi`) menyertakan memori yang relevan dengan repositori aktif dan preferensi global.
- **UI Management**: Modal interaktif untuk menelusuri, memfilter per kategori, menambahkan catatan manual, dan mereset memori.
