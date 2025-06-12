import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
  Animated,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { historyService } from "../lib/utils/services/historyService";
import {
  HistoryItem,
  DetectionType,
  isGrowthHistoryItem,
  isDiseaseHistoryItem,
} from "../lib/utils/types/models";
import { Styles } from "../styles/Styles";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const HistoryScreen = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filterType, setFilterType] = useState<DetectionType | "all">("all");
  const [editingLabel, setEditingLabel] = useState<string>("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [charCountColor, setCharCountColor] = useState("#999999");
  const [animatedItems, setAnimatedItems] = useState<{
    [key: string]: Animated.Value;
  }>({});
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    if (filterType === "all") return true;
    return item.detectionType === filterType;
  });

  const loadHistory = async () => {
    const items = await historyService.getHistory();
    setHistory(items);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const FilterButton = ({
    type,
    title,
  }: {
    type: DetectionType | "all";
    title: string;
  }) => (
    <TouchableOpacity
      style={[
        Styles.filterButton,
        filterType === type && Styles.filterButtonActive,
      ]}
      onPress={() => {
        setFilterType(type);
      }}
    >
      <Text
        style={[
          Styles.filterButtonText,
          filterType === type && Styles.filterButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const newAnimatedItems: { [key: string]: Animated.Value } = {};
    filteredHistory.forEach((item) => {
      if (!animatedItems[item.id]) {
        newAnimatedItems[item.id] = new Animated.Value(item.isPinned ? 1 : 0);
      } else {
        newAnimatedItems[item.id] = animatedItems[item.id];
      }
    });
    setAnimatedItems(newAnimatedItems);
  }, [history]); // Only depend on history changes, not filteredHistory

  const togglePin = async (id: string) => {
    try {
      const currentItem = filteredHistory.find((item) => item.id === id);
      if (!currentItem) return;

      const toValue = currentItem.isPinned ? 0 : 1;
      const animation = animatedItems[id];

      if (animation) {
        Animated.timing(animation, {
          toValue,
          duration: 300,
          useNativeDriver: true,
        }).start(async () => {
          // Only update history after animation completes
          await historyService.togglePin(id);
          await loadHistory();
        });
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      Alert.alert("Error", "Gagal mengubah status pin");
    }
  };

  // Render item dengan fitur seleksi dihapus
  const renderItem = ({ item }: { item: HistoryItem }) => {
    // Badge untuk tipe deteksi
    const renderBadge = () => (
      <View
        style={[
          Styles.typeBadge,
          item.detectionType === "growth"
            ? Styles.growthBadge
            : Styles.diseaseBadge,
        ]}
      >
        <Text style={Styles.typeBadgeText}>
          {item.detectionType === "growth" ? "Pertumbuhan" : "Penyakit"}
        </Text>
      </View>
    );

    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        // Jangan propagasi tap event ke parent jika sedang mengedit
        activeOpacity={editingItemId === item.id ? 1 : 0.7}
      >
        <View style={[Styles.historyCard, item.isPinned && Styles.pinnedCard]}>
          {/* Badge untuk tipe deteksi */}
          {renderBadge()}

          <Image
            source={{ uri: item.imageUri }}
            style={Styles.historyImage}
            resizeMode="cover"
          />

          <View style={Styles.historyContent}>
            <View style={{ flex: 1 }}>
              {/* Group title dan date bersama */}
              <View>
                <Text style={Styles.historyTitle}>
                  {isGrowthHistoryItem(item)
                    ? item.tahapNama
                    : isDiseaseHistoryItem(item)
                    ? item.penyakitNama
                    : "Unknown Type"}
                </Text>

                <Text style={Styles.historyDate}>
                  {formatDate(item.tanggalDeteksi)}
                </Text>
              </View>

              {/* Label section untuk semua tipe card (growth dan disease) */}
              {editingItemId === item.id ? (
                // Saat mengedit, gunakan TouchableWithoutFeedback untuk mencegah klik event keluar
                <TouchableWithoutFeedback
                  onPress={(e) => {
                    // Mencegah event klik sampai ke parent
                    e.stopPropagation();
                  }}
                >
                  <View style={Styles.labelEditContainer}>
                    <View style={Styles.labelEditHeader}>
                      <Text style={Styles.labelEditTitle}>
                        Label{" "}
                        {item.detectionType === "growth"
                          ? "Tanaman"
                          : "Penyakit"}
                        :
                      </Text>
                      <Text style={Styles.labelEditHint}>
                        Maksimal 15 karakter
                      </Text>
                    </View>
                    <TextInput
                      style={Styles.labelEditInput}
                      value={editingLabel}
                      onChangeText={(text) => {
                        setEditingLabel(text);
                        // Kode warna penghitung karakter tidak berubah
                        if (text.length > 12) {
                          setCharCountColor("#FF5252");
                        } else if (text.length > 9) {
                          setCharCountColor("#FFA726");
                        } else {
                          setCharCountColor("#999999");
                        }
                      }}
                      autoFocus
                      maxLength={15}
                    />
                    <Text
                      style={[Styles.charCountText, { color: charCountColor }]}
                    >
                      {editingLabel.length}/15 karakter
                    </Text>
                    
                    {/* Hanya tampilkan tombol Simpan */}
                    <View style={[Styles.labelEditButtons, Styles.singleButtonContainer]}>
                      <TouchableOpacity
                        style={[Styles.labelEditButton, Styles.labelSaveButton, Styles.fullWidthButton]}
                        onPress={(e) => {
                          e.stopPropagation();
                          saveLabel(item.id);
                        }}
                      >
                        <Text style={Styles.labelEditButtonText}>Simpan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                // Tampilan label biasa tetap sama
                <TouchableOpacity
                  style={Styles.labelCardContainer}
                  onPress={() =>
                    startEditing(item.id, item.label || "No Label")
                  }
                >
                  <Text
                    style={
                      item.label === "No Label"
                        ? Styles.labelDefaultText
                        : Styles.labelCardText
                    }
                    numberOfLines={1}
                  >
                    {item.label || "No Label"}
                  </Text>
                  <View style={Styles.editIndicator}>
                    <Ionicons name="pencil-outline" size={12} color="#4CAF50" />
                    <Text style={Styles.editIndicatorText}>Edit</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Tombol pin diposisikan di kanan bawah */}
          <TouchableOpacity
            style={Styles.pinButton}
            onPress={() => togglePin(item.id)}
          >
            <Image
              source={require("../assets/pin-icon.png")}
              style={[Styles.pinIcon, item.isPinned && Styles.pinnedIcon]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const handleItemPress = (item: HistoryItem) => {
    // Navigasi ke screen detail riwayat berdasarkan tipe deteksi
    if (isGrowthHistoryItem(item)) {
      navigation.navigate("GrowthHistoryDetail", { historyItem: item });
    } else if (isDiseaseHistoryItem(item)) {
      navigation.navigate("DiseaseHistoryDetail", { historyItem: item });
    }
  };

  const startEditing = (id: string, currentLabel: string) => {
    setEditingLabel(currentLabel === "No Label" ? "" : currentLabel);
    setEditingItemId(id);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditingLabel("");
    setCharCountColor("#999999");
  };

  const saveLabel = async (id: string) => {
    const finalLabel =
      editingLabel.trim() === "" ? "No Label" : editingLabel.trim();

    try {
      await historyService.updateLabel(id, finalLabel);
      await loadHistory();
      cancelEditing();
    } catch (error) {
      console.error("Error updating label:", error);
      Alert.alert("Error", "Gagal mengupdate label");
    }
  };

  const EmptyState = ({
    filterType,
  }: {
    filterType: DetectionType | "all";
  }) => {
    const messages = {
      all: {
        title: "Belum ada riwayat",
        description:
          "Riwayat deteksi akan muncul di sini setelah Anda melakukan deteksi pertumbuhan atau penyakit pada tanaman selada.",
      },
      growth: {
        title: "Belum ada riwayat deteksi pertumbuhan",
        description:
          "Riwayat deteksi pertumbuhan akan muncul di sini setelah Anda melakukan deteksi tahap pertumbuhan tanaman selada.",
      },
      disease: {
        title: "Belum ada riwayat deteksi penyakit",
        description:
          "Riwayat deteksi penyakit akan muncul di sini setelah Anda melakukan deteksi penyakit pada daun selada.",
      },
    };

    return (
      <View style={Styles.emptyContainer}>
        <Ionicons
          name="document-text-outline"
          size={64}
          color="#CCCCCC"
          style={Styles.emptyIcon}
        />
        <Text style={Styles.emptyTitle}>{messages[filterType].title}</Text>
        <Text style={Styles.emptyDescription}>
          {messages[filterType].description}
        </Text>
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy, HH:mm", { locale: id });
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  return (
    <TouchableWithoutFeedback onPress={cancelEditing}>
      <View style={Styles.container}>
        <View style={Styles.header}>
          <View style={Styles.filterContainer}>
            <FilterButton type="all" title="Semua" />
            <FilterButton type="growth" title="Pertumbuhan" />
            <FilterButton type="disease" title="Penyakit" />
          </View>
        </View>

        {filteredHistory.length === 0 ? (
          <EmptyState filterType={filterType} />
        ) : (
          <FlatList
            data={filteredHistory}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingHorizontal: 2,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            // Tambahkan ini untuk memastikan klik pada FlatList juga akan menutup edit
            onScrollBeginDrag={cancelEditing}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
