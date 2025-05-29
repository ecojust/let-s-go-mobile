import {
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  TextInput,
  View,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import ModalPicker from "../components/ModalPicker";

export default function ProfileScreen() {
  const navigation = useNavigation();

  // 用户信息
  const userInfo = {
    name: "张三",
    avatar: require("@/assets/images/logo.png"), // 使用现有图片作为示例头像
    // 可以添加更多用户信息
  };

  // 设置选项列表
  const settingOptions = [
    { id: "1", title: "个人资料", icon: "person.fill" },
    { id: "2", title: "账号安全", icon: "lock.fill" },
    { id: "3", title: "通知设置", icon: "bell.fill" },
    { id: "4", title: "隐私设置", icon: "hand.raised.fill" },
    { id: "5", title: "主题设置", icon: "paintbrush.fill" },
    { id: "6", title: "关于我们", icon: "info.circle.fill" },
    { id: "7", title: "退出登录", icon: "arrow.right.square.fill" },
  ];

  // 配置选项状态
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [seatType, setSeatType] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const saveSelectionToStorage = async () => {
    const selection = {
      origin,
      destination,
      seatType,
      priceMin,
      priceMax,
      date: date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
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
          setOrigin(parsedData.origin || "");
          setDestination(parsedData.destination || "");
          setSeatType(parsedData.seatType || "");
          setPriceMin(parsedData.priceMin || "");
          setPriceMax(parsedData.priceMax || "");
          //setDate(new Date(parsedData.date || new Date()));
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

  // 渲染设置选项
  const renderSettingItem = (item: {
    id: string;
    title: string;
    icon: string;
  }) => (
    <TouchableOpacity key={item.id} style={styles.settingItem}>
      <ThemedText style={styles.settingText}>{item.title}</ThemedText>
      <IconSymbol
        name="chevron.right"
        size={20}
        color="#808080"
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <ThemedView style={styles.headerImageContainer}>
          <Image source={userInfo.avatar} style={styles.avatarImage} />
        </ThemedView>
      }
    >
      <ThemedView style={styles.container}>
        {/* 始发地选择框 */}
        <ThemedView style={styles.inputContainer}>
          <ModalPicker
            label="始发地"
            options={[
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
            ]}
            selectedValue={origin}
            onValueChange={(value) => {
              setOrigin(value); // Save selection after state update
            }}
          />
        </ThemedView>

        {/* 目的地选择框 */}
        <ThemedView style={styles.inputContainer}>
          <ModalPicker
            label="目的地"
            options={[
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
            ]}
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
            options={[
              { label: "经济舱", value: "economy" },
              { label: "商务舱", value: "business" },
              { label: "头等舱", value: "first" },
            ]}
            selectedValue={seatType}
            onValueChange={(value) => {
              setSeatType(value); // Save selection after state update
            }}
          />
        </ThemedView>

        {/* 票价区间选择框 */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>票价区间</ThemedText>
          <View style={styles.priceRangeContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="最低价"
              keyboardType="numeric"
              value={priceMin}
              onChangeText={(value) => setPriceMin(value)}
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="最高价"
              keyboardType="numeric"
              value={priceMax}
              onChangeText={(value) => setPriceMax(value)}
            />
          </View>
        </ThemedView>

        {/* 日期选择框 */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>日期</ThemedText>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <ThemedText style={styles.dateText}>
              {date.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate); // Save selection after state update
              }}
              style={styles.datePicker} // Apply custom styles
            />
          )}
        </ThemedView>

        {/* <ModalDatePicker
            label="日期"
            selectedDate={date}
            onDateChange={(selectedDate) => setDate(selectedDate)}
          /> */}

        {/* <TouchableOpacity style={styles.confirmButton} onPress={saveSelectionToStorage}>
          <ThemedText style={styles.confirmButtonText}>保存选择</ThemedText>
        </TouchableOpacity> */}
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
    backgroundColor: "rgba(255, 0, 221, 0.2)", // 内容区域背景色
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(157, 255, 0, 0.2)", // 内容区域背景色
  },
  userInfoContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(255, 0, 0, 0.2)", // 内容区域背景色
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "rgba(172, 14, 14, 0.2)", // 内容区域背景色
  },
  userDesc: {
    fontSize: 16,
    color: "#808080",

    backgroundColor: "rgba(4, 255, 0, 0.2)", // 内容区域背景色
  },
  settingsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,

    backgroundColor: "rgba(47, 0, 255, 0.2)", // 内容区域背景色
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
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
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
    gap: 10,
  },
  priceInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  priceSeparator: {
    fontSize: 16,
    color: "#ffffff",
  },
});
