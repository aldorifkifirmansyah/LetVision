import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  growthBadge: {
    backgroundColor: "#4CAF50",
  },
  diseaseBadge: {
    backgroundColor: "#FF5252",
  },
  detectionTypeText: {
    color: "#FFFFFF",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  // Common styles
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },

  // Button styles
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Loading styles
  loadingContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },

  // Growth Result styles
  resultContainer: {
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  estimationContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    alignItems: "center",
  },
  estimationText: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 8,
  },
  estimationValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50",
    textAlign: "center",
    minWidth: "80%",
  },
  nutrientContainer: {
    width: "100%",
    marginTop: 24,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  nutrientItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  nutrientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  nutrientDescription: {
    fontSize: 14,
    color: "#34495E",
    lineHeight: 20,
  },

  // History styles
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "visible", // Pastikan tidak memotong shadow
  },
  historyImage: {
    width: 81,
    height: 108,
    borderRadius: 8,
  },
  historyContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    flex: 1, // Add flex to allow text wrapping
    flexWrap: "wrap", // Enable text wrapping
  },
  historyDate: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 4,
  },
  historyEstimation: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 4,
  },
  historyList: {
    padding: 10, // Tingkatkan padding sedikit
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },

  // Filter styles
  filterContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  filterButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  filterButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerSelectionMode: {
    backgroundColor: "#E3F2FD",
    borderBottomColor: "#1976D2",
  },
  selectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  selectionText: {
    fontSize: 16,
    color: "#1976D2",
    fontWeight: "500",
  },
  selectionActions: {
    flexDirection: "row",
    gap: 12,
  },
  deleteButton: {
    backgroundColor: "#FF5252",
  },
  selectedCard: {
    backgroundColor: "#E3F2FD",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  menuOption: {
    padding: 12,
    fontSize: 16,
    color: "#2C3E50",
  },
  deleteText: {
    color: "#FF5252",
  },
  harvestDateContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  harvestDateTitle: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 8,
  },
  harvestDateValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50",
    textAlign: "center",
  },
  harvestDaysText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 4,
  },
  disabledText: {
    color: "#CCCCCC",
  },
  labelContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 16, // Add bottom margin
  },
  labelInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
  },
  labelButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  labelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  labelInputDisabled: {
    backgroundColor: "#F5F5F5",
    color: "#757575",
  },
  labelButtonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  labelBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  labelText: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "500",
  },
  labelColumn: {
    fontSize: 12,
    color: "#1976D2",
    marginTop: 8,
    fontStyle: "italic",
  },
  editLabelContainer: {
    marginTop: 8,
  },
  editLabelInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#4CAF50",
    padding: 8,
    fontSize: 12,
  },
  editLabelActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
    gap: 8,
  },
  editLabelButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#757575",
  },
  editLabelButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  editIcon: {
    fontSize: 16,
    marginLeft: 4,
  },
  pinnedCard: {
    backgroundColor: "#E8F5E9", // Warna hijau muda yang lebih soft
    borderLeftWidth: 3, // Tetap gunakan border left sebagai aksen
    borderLeftColor: "#4CAF50",
  },
  pinnedCardElevated: {
    // Shadow iOS yang lebih alami
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,

    // Elevation Android
    elevation: 8,

    // Pastikan tidak ada clipping
    overflow: "visible",
    marginHorizontal: 2,
    marginVertical: 2,
  },
  pinButton: {
    padding: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  pinIcon: {
    width: 20,
    height: 20,
    tintColor: "#1B5E20",
  },
  pinnedIcon: {
    tintColor: "#4CAF50",
  },
  pinnedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 6,
    zIndex: 1,
  },
  pinnedTitle: {
    fontWeight: "bold",
    color: "#2E7D32", // Text hijau yang lebih gelap untuk judul
  },

  // Styles untuk DiseaseInstruction
  instructionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333333",
  },
  instructionText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
    lineHeight: 20,
  },
  instructionList: {
    marginTop: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 6,
    lineHeight: 20,
    paddingLeft: 4,
  },

  // Styles untuk DiseaseResultImage
  diseaseImageContainer: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#F5F5F5",
  },
  diseaseResultImage: {
    width: "100%",
    height: "100%",
  },

  // Styles untuk DiseaseInfo
  infoContainer: {
    marginTop: 16,
    backgroundColor: "#F9FFF9",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0F2E0",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#336633",
  },
  infoContent: {
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
  },

  // Styles untuk PreventionList
  preventionContainer: {
    marginTop: 16,
    backgroundColor: "#FFF9F9",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F2E0E0",
  },
  preventionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#663333",
  },
  preventionContent: {
    marginTop: 4,
  },
  preventionItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  preventionNumber: {
    width: 20,
    height: 20,
    backgroundColor: "#EE6C4D",
    borderRadius: 10,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 20,
    marginRight: 8,
    fontWeight: "bold",
    fontSize: 12,
  },
  preventionText: {
    flex: 1,
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
  },

  // Styles untuk TreatmentGuide
  guideContainer: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#F9F9FF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0F2",
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333366",
  },
  guideText: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
    marginBottom: 12,
  },
  guideButton: {
    backgroundColor: "#4C9AFF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  guideButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Update historyCard untuk mendukung tipe deteksi
  historyType: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
    fontStyle: "italic",
  },

  // Badge untuk tipe deteksi
  typeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  // Swipe action untuk delete
  deleteAction: {
    backgroundColor: "#FF5252",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },

  labelEditContainer: {
    marginTop: 8,
  },
  labelEditInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  labelEditButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  labelEditButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  labelSaveButton: {
    backgroundColor: "#4CAF50",
  },
  labelCancelButton: {
    backgroundColor: "#CCCCCC",
  },
  labelEditButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  // Selection mode styles

  // History list

  historyActions: {
    justifyContent: "center",
  },
});
