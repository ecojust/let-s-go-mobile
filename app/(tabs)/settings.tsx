import {
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  TextInput,
  View,
  Text,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import ModalPicker from "../components/ModalPicker";
import { ThemedTextInput } from "@/components/ThemedTextInput";

import STATIONS from "../config/station_name";
import { SITE_TYPE } from "../config/const";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  // 用户信息
  const productInfo = {
    nameZh: "上车，走吧",
    nameEn: "Let's Go",
    logo: require("@/assets/images/logo.png"), // 使用现有图片作为示例头像
    // 可以添加更多用户信息
  };

  // 配置选项状态
  const [origin, setOrigin] = useState("上海");
  const [destination, setDestination] = useState("南京");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [seatType, setSeatType] = useState("二等座");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const saveSelectionToStorage = async () => {
    const selection = {
      origin,
      destination,
      seatType,
      priceMin,
      priceMax,
      date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
    };
    try {
      await AsyncStorage.setItem("selectionData", JSON.stringify(selection));
    } catch (error) {
      console.error("保存选择失败", error);
    }
  };

  useEffect(() => {
    if (origin || destination || date || seatType || priceMin || priceMax) {
      saveSelectionToStorage();
    }
  }, [origin, destination, date, seatType, priceMin, priceMax]);

  useEffect(() => {
    const restoreSelectionFromStorage = async () => {
      try {
        const data = await AsyncStorage.getItem("selectionData");
        if (data) {
          const parsedData = JSON.parse(data);
          setOrigin(parsedData.origin || "上海");
          setDestination(parsedData.destination || "南京");
          setSeatType(parsedData.seatType || "二等座");
          setPriceMin(parsedData.priceMin || 0);
          setPriceMax(parsedData.priceMax || 350);
          setDate(
            new Date(parsedData.date || new Date().getTime() + 1000 * 60 * 24)
          ); // Parse date from YYYY-MM-DD format
        }
      } catch (error) {
        console.error("恢复选择失败", error);
      }
    };

    restoreSelectionFromStorage();
  }, []);

  // const handleConfirmSelection = () => {
  //   navigation.navigate('Home', {
  //     origin,
  //     destination,
  //     date: date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
  //   });
  // };

  return (
    <ParallaxScrollView
      headerHeight={180}
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <ThemedView style={styles.headerImageContainer}>
          <Image
            source={productInfo.logo}
            style={[
              styles.avatarImage,
              colorScheme == "dark" ? styles.darkShadow : styles.lightShadow,
            ]}
          />
        </ThemedView>
      }
    >
      <ThemedView style={styles.container}>
        {/* Example usage of themedStyles */}
        <ThemedText style={[styles.title]}>{productInfo.nameZh}</ThemedText>
        <ThemedText style={[styles.subTitle]}>{productInfo.nameEn}</ThemedText>

        {/* 始发地选择框 */}
        <ThemedView style={styles.inputContainer}>
          <ModalPicker
            showSearch
            autoClose
            label="始发地"
            options={STATIONS}
            selectedValue={origin}
            onValueChange={(value) => {
              setOrigin(value); // Save selection after state update
            }}
          />
        </ThemedView>

        {/* 目的地选择框 */}
        <ThemedView style={styles.inputContainer}>
          <ModalPicker
            showSearch
            autoClose
            label="目的地"
            options={STATIONS}
            selectedValue={destination}
            onValueChange={(value) => {
              setDestination(value); // Save selection after state update
            }}
          />
        </ThemedView>

        {/* 座位类型选择框 */}
        <ThemedView style={styles.inputContainer}>
          <ModalPicker
            label="座位类型"
            options={SITE_TYPE}
            selectedValue={seatType}
            onValueChange={(value) => {
              setSeatType(value); // Save selection after state update
            }}
          />
        </ThemedView>

        {/* 票价区间选择框 */}
        {/* <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>票价区间</ThemedText>
          <ThemedView style={styles.priceRangeContainer}>
            <ThemedTextInput
              width="45%"
              prefix="¥"
              style={styles.priceInput}
              placeholder="最低价"
              keyboardType="numeric"
              value={priceMin}
              onChangeText={(value) => setPriceMin(value)}
            />
            <ThemedText style={styles.priceSeparator}>—</ThemedText>
            <ThemedTextInput
              width="45%"
              prefix="¥"
              style={styles.priceInput}
              placeholder="最高价"
              keyboardType="numeric"
              value={priceMax}
              onChangeText={(value) => setPriceMax(value)}
            />
          </ThemedView>
        </ThemedView> */}

        {/* 日期选择框 */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>选择日期</ThemedText>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {date.toISOString().split("T")[0]}{" "}
              {/* Display date as YYYY-MM-DD */}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingTop: 28,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 4, // Ensure the image is circular
    borderWidth: 2,
    borderColor: "#FFFFFF", // Add a white border for better visibility
    overflow: "hidden", // Ensure the image doesn't exceed the border
  },
  darkShadow: {
    boxShadow: "0 0 6px 2px rgba(255,255,255,0.3)",
  },
  lightShadow: {
    boxShadow: "0 0 6px 2px rgba(0,0,0,0.3)",
  },

  userInfoContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userDesc: {
    fontSize: 16,
    color: "#808080",
  },
  settingsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: "#808080",
  },
  container: {
    // backgroundColor: "red",
    flex: 1,
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: Platform.OS === "ios" ? 0 : 8,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "normal",
    // marginBottom: 20,
    textAlign: "center",
    opacity: 0.2,
  },
  inputContainer: {
    marginBottom: 10,
    // backgroundColor: "blue",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  pickerWrapper: {
    height: 50, // Ensure the Picker has a fixed height
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
  },
  picker: {
    height: "100%", // Ensure the Picker fills its container
  },
  datePicker: {
    color: "#ff0000",
    fontSize: 90,
    //backgroundColor: '#FFFFFF', // Custom background color
    borderRadius: 5, // Rounded corners
    padding: 0, // Add padding
    borderColor: "#ff0000",
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    alignItems: "center", // Center the content horizontally
  },
  dateText: {
    fontSize: 16,
    color: "#000000", // Ensure the text is black and visible
  },
  confirmButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  priceRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  priceInput: {
    // flex: 1,
    // padding: 10,
    // borderWidth: 1,
    // borderColor: "#CCCCCC",
    // borderRadius: 5,
    // backgroundColor: "#FFFFFF",
  },
  priceSeparator: {
    fontSize: 16,
  },
});
