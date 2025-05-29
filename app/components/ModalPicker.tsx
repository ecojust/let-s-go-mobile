import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";

interface ModalPickerProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  label: string;
}

export default function ModalPicker({
  options,
  selectedValue,
  onValueChange,
  label,
}: ModalPickerProps) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value: string) => {
    console.log("handleSelect", value);
    onValueChange(value);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>
          {options.find((option) => option.value === selectedValue)?.label ||
            "请选择"}
        </Text>
      </TouchableOpacity>
      {visible && (
        <Modal transparent animationType="slide" visible={visible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.closeButtonText}>关闭</Text>
              </TouchableOpacity>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#FFFFFF", // Ensure the label text is visible
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
    color: "#FFFFFF",
  },
});
