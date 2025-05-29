import React, { useState } from 'react';
import { Modal, TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ModalDatePickerProps {
  label: string;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function ModalDatePicker({ label, selectedDate, onDateChange }: ModalDatePickerProps) {
  const [visible, setVisible] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      onDateChange(date);
    }
    if (Platform.OS !== 'ios') {
      setVisible(false); // Close modal for non-iOS platforms after selection
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>
      {visible && (
        <Modal transparent animationType="slide" visible={visible}>
          <TouchableOpacity style={styles.modalContainer} onPress={() => setVisible(false)}>
            <View style={styles.modalContent}>
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
                
              ) : (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
          </TouchableOpacity>
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
    color: '#FFFFFF', // Ensure the label text is visible
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#000000', // Ensure the text is dark and visible
    textAlign: 'center', // Center the text to make the date visible
  },
  optionText: {
    fontSize: 16,
    color: '#000000', // Ensure the text is visible in the modal
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '50%',
    padding: 20,
    backgroundColor: '#FFFFFF', // Ensure a bright background
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
