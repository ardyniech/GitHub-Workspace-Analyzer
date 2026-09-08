# AI Agent Performance Dashboard Module

Modul **AI Agent Performance Dashboard** (`modules/agentPerformance`) menyediakan visualisasi grafik garis interaktif (*Line Chart*) untuk memantau performa agent dari waktu ke waktu:

## Indikator Kunci yang Diukur
1. **Auto-Improvement Success Rate (%)**: Persentase keberhasilan perbaikan kode dan auto-fix yang diterapkan secara otomatis.
2. **Peer Review Score (0-100)**: Tren nilai kualitas kode rata-rata dari modul **AI Peer Reviewer**.
3. **Total Auto-Fixes**: Jumlah perbaikan otomatis yang berhasil di-commit.
4. **Total Peer Reviews**: Jumlah sesi ulasan kode yang diselesaikan.

## Komponen
- `PerformanceChart.tsx`: Line chart berbasis `recharts`.
- `PerformanceStatCards.tsx`: Kartu ringkasan KPI.
- `AgentPerformanceModal.tsx`: Modal interaktif dashboard.
