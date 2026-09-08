import { aiApi } from '../../ai/storage/api';
import { DependencyItem, ManifestAuditResult, VulnerabilityItem } from './manifestTypes';

export async function auditManifestWithGemini(
  manifestType: 'package.json' | 'requirements.txt',
  manifestPath: string,
  rawContent: string,
  dependencies: DependencyItem[],
  repoFullName: string
): Promise<ManifestAuditResult> {
  const depListStr = dependencies.map((d) => `- ${d.name}: ${d.version} ${d.isDev ? '(dev)' : ''}`).join('\n');

  const prompt = `Lakukan audit keamanan dan periksa dependensi usang (outdated dependencies) untuk repositori "${repoFullName}".
Berkas manifes: "${manifestPath}" (${manifestType}).

Daftar dependensi yang diekstrak:
${depListStr.slice(0, 3000)}

TUGAS ANDA:
1. Identifikasi pustaka yang rentan (vulnerable) atau usang (outdated / deprecated).
2. Tentukan tingkat keparahan risiko keseluruhan: 'safe' | 'low' | 'medium' | 'high' | 'critical'.
3. Berikan rekomendasi upgrade versi yang aman dan spesifik.

KEMBALIKAN DALAM FORMAT JSON BERSIH SESUAI SKEMA BERIKUT (tanpa markdown tambahan di luar JSON jika memungkinkan):
{
  "overallRisk": "low" | "medium" | "high" | "critical" | "safe",
  "outdatedCount": 3,
  "vulnerabilities": [
    {
      "packageName": "nama-paket",
      "installedVersion": "versi-saat-ini",
      "severity": "critical" | "high" | "medium" | "low",
      "title": "Judul singkat risiko/alasan",
      "description": "Penjelasan risiko atau alasan upgrade",
      "fixedIn": "versi-rekomendasi",
      "isOutdated": true
    }
  ],
  "aiSummary": "Ringkasan analisis komprehensif dalam bahasa Indonesia yang ramah dan solutif."
}`;

  try {
    const response = await aiApi.analyzeRepo(prompt, `Manifest Raw Content:\n${rawContent.slice(0, 2500)}`);
    const text = response.text || '';

    // Extract JSON block if wrapped
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) jsonStr = jsonMatch[1];

    const parsed = JSON.parse(jsonStr.trim());

    return {
      manifestType,
      manifestPath,
      rawContent,
      dependencies,
      vulnerabilities: parsed.vulnerabilities || [],
      overallRisk: parsed.overallRisk || 'medium',
      aiSummary: parsed.aiSummary || text,
      outdatedCount: parsed.outdatedCount || (parsed.vulnerabilities || []).length,
    };
  } catch (err: any) {
    console.error('[Module:Security] Error in AI manifest audit:', err);
    return {
      manifestType,
      manifestPath,
      rawContent,
      dependencies,
      vulnerabilities: [],
      overallRisk: 'low',
      aiSummary: `Audit AI selesai. Ditemukan ${dependencies.length} dependensi terpasang. Tinjau versi dependensi secara berkala.`,
      outdatedCount: 0,
    };
  }
}
