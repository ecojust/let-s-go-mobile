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
import { ThemedTable } from "@/components/ThemedTable";
import { ThemedButton } from "@/components/ThemedButton";

import { WebViewFetcher } from "../services/webviewFetcher";

import { queryDayListScript } from "../config/script";

import { parseList, generateSearchTrainsUrl } from "../services";

export default function HomeScreen() {
  const [content, setContent] = useState("");
  const [fetchUrl, setFetchUrl] = useState("");
  const [startFetch, setStartFetch] = useState(false);
  const [injectScript, setInjectScript] = useState("");

  const [tableData, setTableData] = useState([]);

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

  const handleSearch = async () => {
    const url = generateSearchTrainsUrl(selectionData!);
    console.log(url);
    if (url) {
      setFetchUrl(
        "https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=%E4%B8%8A%E6%B5%B7,SHH&ts=%E5%A4%A9%E6%B4%A5,TJP&date=2025-06-11&flag=N,N,Y"
      );
      setInjectScript(queryDayListScript);
      setStartFetch(true);
    }
  };

  const handleContentFetched = async (html: string) => {
    setContent(html);
    setStartFetch(false);
    const list = await parseList(html!);
    setTableData(list as never[]);
    // trainNo: no,
    // from: from_to.eq(0).text(),
    // to: from_to.eq(1).text(),
    // departureTime: start_end.eq(0).text(),
    // arrivalTime: start_end.eq(1).text(),
    // duration: ls.eq(0).text(),
    // tickets: tickets,
    // raw_data: {
    //   train_no: format_raw_data[1],
    //   from_station_telecode: format_raw_data[2],
    //   to_station_telecode: format_raw_data[3],
    // },
    // priceCode: yp_info_new,
    // bedCode: bed_level_info,
    // seats: seats,
    // seatsStr: seats.toString(),
  };

  const tableColumns = [
    {
      key: "trainNo",
      label: "车次",
      width: 80,
    },
    {
      key: "seatsStr",
      label: "lie2",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {selectionData && (
          <ThemedView style={styles.selectionContainer}>
            <ThemedView style={styles.selectionRow}>
              <ThemedText style={styles.selectionText}>
                始发地: {selectionData.origin}
              </ThemedText>
              <ThemedText style={styles.selectionText}>
                目的地: {selectionData.destination}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.selectionRow}>
              <ThemedText style={styles.selectionText}>
                最低票价: ¥{selectionData.priceMin}
              </ThemedText>
              <ThemedText style={styles.selectionText}>
                最高票价: ¥{selectionData.priceMax}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.selectionRow}>
              <ThemedText style={styles.selectionText}>
                座位: {selectionData.seatType}
              </ThemedText>
              <ThemedText style={styles.selectionText}>
                日期: {selectionData.date}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}

        {/* Search Button */}
        <ThemedButton
          title="Search"
          onPress={handleSearch}
          style={styles.searchButton}
        />

        {/* 使用 ThemedTable 组件 */}
        <ThemedTable data={tableData} columns={tableColumns} />
        <ThemedText style={styles.selectionText}>{content}</ThemedText>
        {startFetch && (
          <WebViewFetcher
            injectedScript={injectScript}
            height={200}
            url={fetchUrl}
            onContentFetched={handleContentFetched}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    borderColor: "#ccc",
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === "android" ? 0 : 16, // 为Android设备增加顶部内边距
  },

  selectionContainer: {
    padding: 10,
    gap: 2,
    borderRadius: 4,
    boxShadow: "0 0 10px 2px rgb(255, 106, 0) inset",
  },

  selectionRow: {
    flexDirection: "row", // Ensure items are laid out horizontally
    justifyContent: "space-between", // Space items evenly
    alignItems: "center", // Align items vertically
  },
  selectionText: {
    fontSize: 16,
  },

  searchButton: {
    marginVertical: 8,
  },

  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "red",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  tableCell: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
});
