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

// Interface untuk rekomendasi nutrisi
export interface NutrisiRekomendasi {
  id: number;
  nama: string;
  deskripsi: string;
}

// Interface untuk data pupuk
export interface PupukDosis {
  nama_pupuk: string;
  dosis_ml: number;
}

// Interface untuk growth history yang menggunakan struktur baru
export interface GrowthHistoryItem extends BaseHistoryItem {
  detectionType: "growth";
  tahapId?: number;
  tahapNama?: string;
  estimasiPanen?: string;
  harvestDate?: string;
  daysUntilHarvest?: number;
  nutrisiRekomendasi?: NutrisiRekomendasi[];
  pupukDosis?: PupukDosis[]; // Struktur baru untuk pupuk dinamis
  ecMin?: number;
  ecMax?: number;
  phMin?: number;
  phMax?: number;
  keterangan?: string;
}

// Interface untuk penanganan penyakit
export interface PenangananItem {
  id: number;
  langkah: string;
}

// Interface untuk disease history
export interface DiseaseHistoryItem extends BaseHistoryItem {
  detectionType: "disease";
  penyakitId: number;
  penyakitNama: string;
  deskripsi: string;
  penanganan?: PenangananItem[];
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

// Interface untuk data tahap pertumbuhan
export interface TahapPertumbuhan {
  id: number;
  nama: string;
  estimasi_waktu_panen: string;
  ec_min: number;
  ec_max: number;
  ph_min: number;
  ph_max: number;
  keterangan?: string;
}

// Interface untuk data pupuk
export interface Pupuk {
  id: number;
  nama_pupuk: string;
}

// Interface untuk dosis pupuk
export interface DosisPupuk {
  id: number;
  tahap_id: number;
  pupuk_id: number;
  dosis_ml: number;
  pupuk?: Pupuk;
}

// Interface untuk data penyakit
export interface PenyakitInfo {
  id: number;
  nama: string;
  deskripsi: string;
}
