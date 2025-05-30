import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { Styles } from "../styles/Styles";

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

  // Update local value ketika initialValue berubah
  useEffect(() => {
    if (!isLocked) {
      setLocalValue(initialValue || "");
    }
  }, [initialValue, isLocked]);

  const handleChangeText = (text: string) => {
    setLocalValue(text);
    onInputChange(text);
  };

  const handleSubmit = () => {
    if (localValue.trim()) {
      onLabelSubmit(localValue);
    }
  };

  return (
    <View style={Styles.labelContainer}>
      <TextInput
        style={[Styles.labelInput, isLocked && Styles.labelInputDisabled]}
        value={localValue}
        onChangeText={handleChangeText}
        placeholder="Tambahkan label..."
        editable={!isLocked}
        maxLength={50}
      />
      <TouchableOpacity
        style={[Styles.labelButton, isLocked && Styles.labelButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLocked || !localValue.trim()}
      >
        <Text style={Styles.labelButtonText}>
          {isLocked ? "Label Tersimpan" : "Tambahkan Label"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
