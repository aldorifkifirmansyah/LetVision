import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Styles } from "../styles/Styles";

interface HistoryMenuProps {
  isSelectMode: boolean;
  selectedItemsCount: number; // Add this new prop
  onSelect: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onSelectAll: () => void;
}

export const HistoryMenu: React.FC<HistoryMenuProps> = ({
  isSelectMode,
  selectedItemsCount,
  onSelect,
  onDelete,
  onCancel,
  onSelectAll,
}) => {
  return (
    <Menu>
      <MenuTrigger>
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color="#2C3E50"
          style={{ marginRight: 16 }}
        />
      </MenuTrigger>
      <MenuOptions>
        {isSelectMode ? (
          <>
            <MenuOption onSelect={onSelectAll}>
              <Text style={Styles.menuOption}>Pilih Semua</Text>
            </MenuOption>
            <MenuOption
              onSelect={selectedItemsCount > 0 ? onDelete : undefined}
              disabled={selectedItemsCount === 0}
            >
              <Text
                style={[
                  Styles.menuOption,
                  selectedItemsCount > 0
                    ? Styles.deleteText
                    : Styles.disabledText,
                ]}
              >
                Hapus
              </Text>
            </MenuOption>
            <MenuOption onSelect={onCancel}>
              <Text style={Styles.menuOption}>Batal</Text>
            </MenuOption>
          </>
        ) : (
          <MenuOption onSelect={onSelect}>
            <Text style={Styles.menuOption}>Pilih...</Text>
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  );
};
