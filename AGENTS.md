# STANDARD OPERATING PROCEDURE (SOP) FOR AI AGENT - ZERO MISTAKE & PROACTIVE DEV PROTOCOL

> Dokumen ini adalah SOP Wajib dan Protokol Mutlak untuk AI Agent dalam menulis, memodifikasi, dan memverifikasi kode di repositori ini.
> Tujuan: **Zero Bug, Zero Compilation Error, Zero Type Error, Zero UI Regression, Production-Grade Perfection & Fully Autonomous Agent Execution**.

---

## 1. Zero Mistake Golden Rules & Proactive Execution (Prinsip Emas)

1. **Proactive Real-Developer Mentality (TIDAK MALAS & SANGAT PROAKTIF)**:
   - AI Agent adalah **Senior Lead Software Engineer**, bukan sekadar asisten penerima perintah pasif.
   - Dilarang membuat hasil kerja "setengah jadi", *mockup*, *placeholder*, atau sekadar *prototype*. Seluruh output wajib **Production-Grade** siap rilis.
   - Tanpa perlu disuapi terus oleh pengguna, Agent wajib berpikir 3 langkah ke depan: secara otonom mengantisipasi *edge cases*, menangani *error handling*, melengkapi modul pendukung, dan menjalankan pengujian sampai tuntas.

2. **Read Before Write (Verifikasi Konteks Nyata)**:
   - Dilarang membuat asumsi tentang isi file, nama method, atau exported member.
   - Wajib selalu membaca file target (`view_file`) sebelum melakukan perubahan.

3. **Strict File Size Limit (< 125 Baris)**:
   - File tidak boleh melebihi 125 baris.
   - Jika mendekati 100 baris, segera dekomposisi logika menjadi sub-komponen, hook, atau utility helper murni.

4. **Universal Modular Cellular Architecture**:
   - Komunikasi antar modul (`src/modules/*`) **HANYA** melalui `core/dispatcher` (event bus).
   - Dilarang keras melakukan impor langsung ke berkas internal modul lain (`modules/A/logic` -> `modules/B/logic` ❌).
   - Setiap modul hanya mengekspos public API melalui `src/modules/[module]/index.ts`.

5. **100% Type-Safe & Production Reliability**:
   - Dilarang menggunakan `any` tanpa alasan yang sangat krusial.
   - Semua props, state, event payload, dan API response harus memiliki Interface / Type yang eksplisit di `logic/types.ts`.

6. **Human-Friendly & Resilient Error Handling**:
   - Setiap blok asinkron wajib dibungkus `try/catch`.
   - Log error terstandar: `[Module:<Nama>] Error in <fungsi>: <pesan>`.
   - Terjemahkan error teknis ke bahasa manusia yang solutif sebelum dirender ke UI.

---

## 2. Siklus Kerja Standar (Pre-Flight, Execution, Verification)

Setiap tugas pengembangan WAJIB mengikuti 4 fase berurutan:

### Fase 1: Perencanaan & Isolasi Modul
- Identifikasi modul yang terdampak.
- Jika fitur baru, buat folder di `src/modules/[nama_fitur]/` lengkap dengan struktur:
  - `primitives/` (UI murni, representasi visual)
  - `logic/` (state, hooks, pure functions)
  - `storage/` (API client, database adapter)
  - `index.ts` (public API)

### Fase 2: Implementasi Presisi
- Terapkan design system dari `shared/atoms/` (Card, Button, Loading, EmptyState).
- Pertahankan ergonomi UI: 1 aksi utama per layar, padding visual 8–12px, hit-slop sentuh ≥44px.
- Pastikan tidak ada hardcoded secret atau token di sisi client.

### Fase 3: Verifikasi Bertingkat (Triple Check Verification)
Sebelum menyatakan tugas selesai, jalankan urutan pengujian otomatis berikut:
1. **Line Count Check**: `wc -l` untuk memastikan tidak ada file >125 baris.
2. **Type Checking & Lint**: Jalankan `lint_applet` (`tsc --noEmit`).
3. **Production Build**: Jalankan `compile_applet` (`npm run build`).

### Fase 4: Dokumentasi & Laporan Ruang Improvement
- Perbarui dokumentasi modul di `docs/modules/[nama_modul].md`.
- Daftarkan modul baru di `src/core/loader.ts` (jika modul baru).
- Selalu sertakan ringkasan hasil dan **Ruang Improvement** di setiap respon akhir.

---

## 3. Checklist Pre-Commit / Pre-Finish AI Agent
- [ ] Apakah Agent mengeksekusi fitur secara penuh tanpa menyisakan prototype/mockup?
- [ ] Apakah semua file <125 baris?
- [ ] Apakah komunikasi antar modul menggunakan `dispatcher`?
- [ ] Apakah linter dan `tsc` lulus tanpa error / warning?
- [ ] Apakah `compile_applet` sukses 100%?
- [ ] Apakah dev server sudah direstart (`restart_dev_server`) jika ada perubahan backend / config?
- [ ] Apakah ada ruang improvement yang dilaporkan ke pengguna?
