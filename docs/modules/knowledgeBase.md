# Knowledge Base & Best Practices Manifest Module

Modul **Knowledge Base** (`modules/knowledgeBase`) menyediakan antarmuka pengembang untuk meninjau, menyunting, mematikan (*disable*), dan menambah (*override*) standar koding internal yang dipelajari AI Agent:

## Fitur Utama
1. **Developer Overrides**: Memungkinkan pengembang manusia menyunting aturan koding yang disintesis AI Agent.
2. **Custom Coding Standards Injection**: Menambahkan aturan kustom langsung ke dalam memori kerja AI Agent.
3. **Status Toggle**: Memungkinkan pengembang mengaktifkan atau menonaktifkan aturan koding tertentu secara real-time.
4. **Live Event Synchronization**: Perubahan standar koding dipublikasikan via `core/dispatcher` dan dicatat di `devConsole`.
