export type DetectionType = "growth" | "disease";

// Interface dasar untuk semua item history
export interface BaseHistoryItem {
  id: string;
  imageUri: string;
  tanggalDeteksi: string;
  detectionType: DetectionType;
  label?: string;
  isPinned?: boolean;
  pinnedAt?: string;
}

// Pastikan interface NutrisiRekomendasi memiliki definisi yang tepat
export interface NutrisiRekomendasi {
  id: number;
  nama: string;
  deskripsi: string;
}

// Interface untuk growth history (dari history.ts)
export interface GrowthHistoryItem extends BaseHistoryItem {
  detectionType: "growth";
  tahapId?: number;
  tahapNama?: string;
  estimasiPanen?: string; // Format: "±X hari" where X is a number
  harvestDate?: string;
  // Tambahkan properti baru yang dibutuhkan
  nutrisiRekomendasi?: NutrisiRekomendasi[]; // Array rekomendasi nutrisi
  daysUntilHarvest?: number; // Jumlah hari hingga panen
  ecMin?: number; // Nilai EC minimum
  ecMax?: number; // Nilai EC maksimum
  phMin?: number; // Nilai pH minimum
  phMax?: number; // Nilai pH maksimum
  abMix?: number; // Komposisi AB
  poc?: number; // POC (Pupuk Organik Cair) dosis
}

// Interface untuk data penyakit (dari disease.ts)
export interface PenyakitInfo {
  id: number;
  nama: string;
  deskripsi: string;
}

export interface PenangananItem {
  id: number;
  langkah: string;
}

// Interface untuk disease history (dari disease.ts)
export interface DiseaseHistoryItem extends BaseHistoryItem {
  detectionType: "disease";
  penyakitId: number;
  penyakitNama: string;
  deskripsi: string;
}

// Union type untuk item history
export type HistoryItem = GrowthHistoryItem | DiseaseHistoryItem;

// Type guard untuk membedakan tipe history
export function isGrowthHistoryItem(
  item: HistoryItem
): item is GrowthHistoryItem {
  return item.detectionType === "growth";
}

export function isDiseaseHistoryItem(
  item: HistoryItem
): item is DiseaseHistoryItem {
  return item.detectionType === "disease";
}
