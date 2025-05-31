import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ModalPickerProps {
  options: {
    label: string;
    value: string;
    name?: string;
    code?: string;
    pinyin?: string;
  }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  label: string;
  placeholder?: string;
  showSearch?: boolean;
  autoClose?: boolean;
}

export default function ModalPicker({
  options,
  selectedValue,
  onValueChange,
  label,
  placeholder = "查询...",
  showSearch = false,
  autoClose = false,
}: ModalPickerProps) {
  const [visible, setVisible] = useState(false);
  const [filterText, setFilterText] = useState("");

  const color = useThemeColor({ light: "black", dark: "black" }, "text");

  const filteredOptions = options.filter((option) =>
    option.label.includes(filterText)
  );

  const handleSelect = (value: string) => {
    console.log("handleSelect", value);
    onValueChange(value);
    autoClose && setVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TouchableOpacity
        style={[styles.button]}
        onPress={() => setVisible(true)}
      >
        <ThemedText
          style={[
            styles.buttonText,
            {
              color,
            },
          ]}
        >
          {options.find((option) => option.value === selectedValue)?.label ||
            "请选择"}
        </ThemedText>
      </TouchableOpacity>
      {visible && (
        <Modal
          transparent
          animationType="slide"
          visible={visible}
          onRequestClose={() => setVisible(false)} // Handle back button press on Android
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setVisible(false)} // Close modal when clicking on the mask
          >
            <ThemedView style={styles.modalContent}>
              {showSearch && (
                <ThemedTextInput
                  style={styles.filterInput}
                  placeholder={placeholder}
                  clearable
                  value={filterText}
                  onChangeText={setFilterText}
                />
              )}
              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(item.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        {
                          color,
                        },
                      ]}
                    >
                      {item.label}
                    </ThemedText>
                    {item.value === selectedValue && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color="#4CAF50"
                        style={styles.checkIcon}
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </ThemedView>
          </TouchableOpacity>
        </Modal>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Align modal content to the bottom
    backgroundColor: "rgba(0,0,0,0.0)", // Make the overlay fully transparent
  },
  modalContent: {
    height: "50%", // Occupy half of the screen
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10, // Rounded corners for the top
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensure the icon floats to the right
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 0,
    padding: 10,
    backgroundColor: "#CCCCCC",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
    justifyContent: "flex-end", // Align modal content to the bottom
  },
  filterInput: {
    // marginBottom: 10,
    // padding: 30,
    // borderWidth: 1,
    // borderColor: "#CCCCCC",
    // borderRadius: 5,
    // backgroundColor: "#FFFFFF",
  },
  checkIcon: {
    marginLeft: "auto", // Float the icon to the right
  },
});
