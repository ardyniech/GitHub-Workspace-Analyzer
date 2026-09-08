# Modul: AI Agent Executor (sebelumnya AI Chat)

## Deskripsi
Modul ini bertindak sebagai otak komputasi untuk menjalankan analisis otonom (Agentic Execution), mem-parsing perintah secara langsung dan memberikan output *Markdown* lengkap tanpa riwayat chat "basa-basi".

## Komponen & Fitur
1. **Agent Executor UI**: Menggantikan tampilan chat tradisional dengan antarmuka terminal/komando eksekusi langsung.
2. **Context Injector**: Secara cerdas menarik metadata repositori (README, struktur, commit) untuk disertakan ke dalam prompt sistem sebelum dieksekusi.
3. **Agent Modals**: Isolasi sub-fitur AI (seperti Memory, Proactive Linter, Security Scan) yang dirangkum menjadi satu modul komponen untuk mematuhi batas ukuran baris.
4. **Offline Pr Draft**: Fitur luring yang tersambung ke `agentTaskQueue`.

## Aturan Arsitektur
- Harus mengikuti batasan `< 125 lines` (seperti yang dilakukan pada dekomposisi `AgentModals`).
- Antarmuka berfokus pada eksekusi perintah tunggal (Single Execution Goal), menghindari penumpukan status riwayat chat (chat list/bubbles).
- *Strict Type Checking*.

## Ruang Improvement
- Menambah kapabilitas eksekusi multithreading di sisi klien menggunakan Web Worker jika agen memproses konteks repositori masif (contoh >1000 berkas).
