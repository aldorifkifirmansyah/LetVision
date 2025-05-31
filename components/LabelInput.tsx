import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { Styles } from "../styles/Styles";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onLabelSubmit: (label: string) => void;
  isLocked: boolean;
  initialValue: string;
  onInputChange: (value: string) => void;
};

export const LabelInput: React.FC<Props> = ({
  onLabelSubmit,
  isLocked,
  initialValue,
  onInputChange,
}) => {
  // Tambahkan local state untuk value untuk menghindari race condition
  const [localValue, setLocalValue] = useState(initialValue || "");
  const [charCountColor, setCharCountColor] = useState("#999999");

  // Update local value ketika initialValue berubah
  useEffect(() => {
    if (!isLocked) {
      setLocalValue(initialValue || "");
      updateCharCountColor(initialValue || "");
    }
  }, [initialValue, isLocked]);

  const updateCharCountColor = (text: string) => {
    if (text.length > 12) {
      setCharCountColor("#FF5252"); // Merah saat mendekati batas
    } else if (text.length > 9) {
      setCharCountColor("#FFA726"); // Oranye untuk peringatan
    } else {
      setCharCountColor("#999999"); // Normal
    }
  };

  const handleChangeText = (text: string) => {
    setLocalValue(text);
    onInputChange(text);
    updateCharCountColor(text);
  };

  const handleSubmit = () => {
    // Jika input kosong, gunakan "No Label" sebagai nilai default
    const finalLabel =
      localValue.trim() === "" ? "No Label" : localValue.trim();
    onLabelSubmit(finalLabel);
  };

  return (
    <View style={Styles.labelContainer}>
      <View style={Styles.labelEditHeader}>
        <Text style={Styles.labelEditTitle}>Label:</Text>
        <Text style={Styles.labelEditHint}>Maksimal 15 karakter</Text>
      </View>

      <TextInput
        style={[Styles.labelInput, isLocked && Styles.labelInputDisabled]}
        value={localValue}
        onChangeText={handleChangeText}
        placeholder="Masukkan label..."
        editable={!isLocked}
        maxLength={15} // Batasi 15 karakter seperti sebelumnya
      />

      {!isLocked && (
        <Text style={[Styles.charCountText, { color: charCountColor }]}>
          {localValue.length}/15 karakter
        </Text>
      )}

      <TouchableOpacity
        style={[Styles.labelButton, isLocked && Styles.labelButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLocked}
      >
        <Text style={Styles.labelButtonText}>
          {isLocked ? "Label Tersimpan" : "Tambahkan Label"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
