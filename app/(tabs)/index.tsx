import {
  Image,
  StyleSheet,
  Platform,
  FlatList,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [selectionData, setSelectionData] = useState<{
    origin: string;
    destination: string;
    date: string;
    seatType: string;
    priceMin: number;
    priceMax: number;
  } | null>(null);
  const isFocused = useIsFocused();

  const fetchSelectionData = async () => {
    try {
      const data = await AsyncStorage.getItem("selectionData");
      console.log("获取数据", data);
      if (data) {
        setSelectionData(JSON.parse(data));
      }
    } catch (error) {
      console.error("读取选择数据失败", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchSelectionData();
    }
  }, [isFocused]);

  useEffect(() => {
    const restoreSelectionData = async () => {
      try {
        const data = await AsyncStorage.getItem("selectionData");
        if (data) {
          setSelectionData(JSON.parse(data));
        }
      } catch (error) {
        console.error("恢复选择数据失败", error);
      }
    };

    restoreSelectionData();
  }, []);

  // 渲染列表项
  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <ThemedView style={styles.listItem}>
      <ThemedText>{item.title}</ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {selectionData && (
          <ThemedView style={styles.selectionContainer}>
            <ThemedText>始发地: {selectionData.origin}</ThemedText>
            <ThemedText>目的地: {selectionData.destination}</ThemedText>
            <ThemedText>日期: {selectionData.date}</ThemedText>
            <ThemedText>座位类型: {selectionData.seatType}</ThemedText>
            <ThemedText>最低票价: ¥{selectionData.priceMin}</ThemedText>
            <ThemedText>最高票价: ¥{selectionData.priceMax}</ThemedText>
          </ThemedView>
        )}
        {/* <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        /> */}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  safeArea: {
    flex: 1,
    borderColor: "#ccc",
    backgroundColor: "rgba(54, 45, 213, 1)", // 半透明背景
  },
  container: {
    backgroundColor: "rgb(141, 128, 128)", // 半透明背景

    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === "android" ? 0 : 16, // 为Android设备增加顶部内边距
  },
  header: {
    backgroundColor: "rgba(54, 45, 213, 1)", // 半透明背景
    paddingTop: 8, // 增加标题的顶部外边距
    paddingBottom: 8, // 增加标题的底部外边距
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 16,
  },
  listItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "rgba(220, 169, 16, 0.3)", // 半透明背景
  },
  selectionContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  selectionText: {
    fontSize: 16,
    color: "#ff0000",
  },
});
