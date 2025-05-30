import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
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
  GrowthHistoryItem,
  DiseaseHistoryItem,
  isGrowthHistoryItem,
  isDiseaseHistoryItem,
} from "../lib/utils/types/models";
import { Styles } from "../styles/Styles";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { HistoryMenu } from "../components/HistoryMenu";
import { Swipeable } from "react-native-gesture-handler";

export const HistoryScreen = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filterType, setFilterType] = useState<DetectionType | "all">("all");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        filteredHistory.length > 0 ? (
          <HistoryMenu
            isSelectMode={isSelectMode}
            selectedItemsCount={selectedItems.length}
            onSelect={toggleSelectMode}
            onDelete={deleteSelectedItems}
            onCancel={cancelSelectionMode}
            onSelectAll={selectAllItems}
          />
        ) : null,
    });
  }, [isSelectMode, selectedItems, filterType, filteredHistory.length]);

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
        if (isSelectMode) {
          cancelSelectionMode();
        }
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

  // Update renderItem di HistoryScreen.tsx untuk menampilkan informasi penyakit
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

    const renderRightActions = (id: string) => {
      return (
        <TouchableOpacity
          style={Styles.deleteAction}
          onPress={() => confirmDeleteSingle(id)}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      );
    };

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity
          onPress={() => handleItemPress(item)}
          onLongPress={() => handleLongPress(item.id)}
        >
          <View
            style={[
              Styles.historyCard,
              isSelectMode &&
                selectedItems.includes(item.id) &&
                Styles.selectedCard,
              item.isPinned && Styles.pinnedCard,
            ]}
          >
            {/* Badge untuk tipe deteksi */}
            {renderBadge()}

            <Image
              source={{ uri: item.imageUri }}
              style={Styles.historyImage}
              resizeMode="cover"
            />

            <View style={Styles.historyContent}>
              <View style={{ flex: 1 }}>
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

                {/* Tampilkan label dan tombol edit hanya untuk item dengan tipe pertumbuhan */}
                {item.detectionType === "growth" && (
                  <>
                    {editingItemId === item.id ? (
                      <View style={Styles.labelEditContainer}>
                        <TextInput
                          style={Styles.labelEditInput}
                          value={editingLabel}
                          onChangeText={setEditingLabel}
                          autoFocus
                          maxLength={50}
                        />
                        <View style={Styles.labelEditButtons}>
                          <TouchableOpacity
                            style={[
                              Styles.labelEditButton,
                              Styles.labelSaveButton,
                            ]}
                            onPress={() => saveLabel(item.id)}
                          >
                            <Text style={Styles.labelEditButtonText}>
                              Simpan
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              Styles.labelEditButton,
                              Styles.labelCancelButton,
                            ]}
                            onPress={cancelEditing}
                          >
                            <Text style={Styles.labelEditButtonText}>
                              Batal
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          !isSelectMode &&
                          startEditing(item.id, item.label || "")
                        }
                      >
                        <Text style={Styles.labelColumn}>
                          Label: {item.label || "No Label"}
                          {!isSelectMode && (
                            <Text style={Styles.editIcon}> ✏️</Text>
                          )}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>

              <View style={Styles.historyActions}>
                <TouchableOpacity
                  style={Styles.pinButton}
                  onPress={() => !isSelectMode && togglePin(item.id)}
                >
                  <Image
                    source={require("../assets/pin-icon.png")}
                    style={[Styles.pinIcon, item.isPinned && Styles.pinnedIcon]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const handleItemPress = (item: HistoryItem) => {
    if (isSelectMode) {
      toggleSelectItem(item.id);
    } else {
      // Navigate to detail screen berdasarkan tipe deteksi
      if (isGrowthHistoryItem(item)) {
        navigation.navigate("GrowthResult", {
          imageUri: item.imageUri,
          predictions: [{ class_id: item.tahapId - 1 }],
        });
      } else if (isDiseaseHistoryItem(item)) {
        navigation.navigate("DiseaseResult", {
          imageUri: item.imageUri,
          predictions: [{ class_id: item.penyakitId - 1 }],
        });
      }
    }
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedItems([]);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;

    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus ${selectedItems.length} item yang dipilih?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await historyService.deleteMultiple(selectedItems);
              await loadHistory();
              setIsSelectMode(false);
              setSelectedItems([]);
            } catch (error) {
              console.error("Error deleting items:", error);
              Alert.alert("Error", "Gagal menghapus item");
            }
          },
        },
      ]
    );
  };

  const confirmDeleteSingle = (id: string) => {
    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah Anda yakin ingin menghapus item ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await historyService.deleteHistory(id);
              await loadHistory();
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Error", "Gagal menghapus item");
            }
          },
        },
      ]
    );
  };

  const cancelSelectionMode = () => {
    setIsSelectMode(false);
    setSelectedItems([]);
  };

  const selectAllItems = () => {
    const allIds = filteredHistory.map((item) => item.id);
    setSelectedItems(allIds);
  };

  const startEditing = (id: string, currentLabel: string) => {
    setEditingItemId(id);
    setEditingLabel(currentLabel);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditingLabel("");
  };

  const saveLabel = async (id: string) => {
    if (!editingLabel.trim()) {
      Alert.alert("Label tidak valid", "Label tidak boleh kosong");
      return;
    }

    try {
      await historyService.updateLabel(id, editingLabel.trim());
      await loadHistory();
      cancelEditing();
    } catch (error) {
      console.error("Error updating label:", error);
      Alert.alert("Error", "Gagal mengupdate label");
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isSelectMode) {
          cancelSelectionMode();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isSelectMode]);

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

  const handleLongPress = (id: string) => {
    if (!isSelectMode) {
      toggleSelectMode();
      toggleSelectItem(id);
    }
  };

  const MemoizedItem = React.memo(
    ({ item }: { item: HistoryItem }) => renderItem({ item }),
    (prevProps, nextProps) => {
      // Custom comparison untuk menentukan apakah perlu re-render
      return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.isPinned === nextProps.item.isPinned &&
        prevProps.item.label === nextProps.item.label
      );
    }
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => isSelectMode && cancelSelectionMode()}
    >
      <View style={Styles.container}>
        <View
          style={[Styles.header, isSelectMode && Styles.headerSelectionMode]}
        >
          {isSelectMode ? (
            <View style={Styles.selectionHeader}>
              <Text style={Styles.selectionText}>
                {selectedItems.length} item terpilih
              </Text>
            </View>
          ) : (
            <View style={Styles.filterContainer}>
              <FilterButton type="all" title="Semua" />
              <FilterButton type="growth" title="Pertumbuhan" />
              <FilterButton type="disease" title="Penyakit" />
            </View>
          )}
        </View>

        {filteredHistory.length === 0 ? (
          <EmptyState filterType={filterType} />
        ) : (
          <FlatList
            data={filteredHistory}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingBottom: 20, // Tambahkan padding bawah
              paddingHorizontal: 2, // Tambahkan sedikit padding horizontal
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
