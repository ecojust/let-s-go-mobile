import {
  Image,
  StyleSheet,
  Platform,
  FlatList,
  SafeAreaView,
  ScrollView,
  Modal,
  View,
  Button,
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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState<any>(null);
  const isFocused = useIsFocused();

  const fetchSelectionData = async () => {
    try {
      const data = await AsyncStorage.getItem("selectionData");
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
    // if (url) {
    setFetchUrl(
      "https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=%E4%B8%8A%E6%B5%B7,SHH&ts=%E5%A4%A9%E6%B4%A5,TJP&date=2025-06-11&flag=N,N,Y"
    );
    setInjectScript(queryDayListScript);
    setStartFetch(true);
    // }
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

  const handleItemClick = (row: any, action: string) => {
    console.log(action, row);
    switch (action) {
      case "more":
        setDialogContent(row);
        setDialogVisible(true);
        break;
      case "fetchAllTickets":
        break;
    }
  };

  const tableColumns = [
    {
      key: "trainNo",
      label: "车次",
      width: 60,
      useButton: true,
      action: "more",
    },
    {
      key: "departureTime",
      label: "出发 ",
      width: 45,
    },
    {
      key: "arrivalTime",
      label: "抵达 ",
      width: 45,
    },
    {
      key: "seatsStr",
      label: "票价",
      width: 60,
    },

    {
      key: "priceRate",
      label: "Rank",
      width: 50,
      useRank: true,
    },
    {
      key: "ticketsStr",
      label: "余票",
      width: 40,
    },
    {
      key: "operation",
      label: "操作",
      // width: 80,
      useButton: true,
      action: "fetchAllTickets",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
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

          {/* <ThemedView style={styles.selectionRow}>
            <ThemedText style={styles.selectionText}>
              最低票价: ¥{selectionData.priceMin}
            </ThemedText>
            <ThemedText style={styles.selectionText}>
              最高票价: ¥{selectionData.priceMax}
            </ThemedText>
          </ThemedView> */}

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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          {/* 使用 ThemedTable 组件 */}

          <ThemedTable
            data={tableData}
            columns={tableColumns}
            onPress={handleItemClick}
          />
          {/* <ThemedText style={styles.selectionText}>{content}</ThemedText> */}
          {startFetch && (
            <WebViewFetcher
              injectedScript={injectScript}
              height={200}
              url={fetchUrl}
              onContentFetched={handleContentFetched}
            />
          )}
        </ThemedView>
      </ScrollView>

      {/* Dialog */}
      <Modal
        visible={dialogVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDialogVisible(false)}
      >
        <ThemedView style={styles.dialogContainer}>
          <ThemedView style={styles.dialogContent}>
            <ThemedText style={styles.dialogTitle}>详细信息</ThemedText>
            {dialogContent && (
              <ThemedView>
                <ThemedText style={styles.selectionText}>
                  车次: {dialogContent.trainNo}
                </ThemedText>
                <ThemedText style={styles.selectionText}>
                  始发站: {dialogContent.from}
                </ThemedText>
                <ThemedText style={styles.selectionText}>
                  终点站: {dialogContent.to}
                </ThemedText>
                <ThemedText style={styles.selectionText}>
                  出发时间: {dialogContent.departureTime}
                </ThemedText>
                <ThemedText style={styles.selectionText}>
                  抵达时间: {dialogContent.arrivalTime}
                </ThemedText>

                <ThemedText style={styles.selectionText}>
                  历时: {dialogContent.duration}
                </ThemedText>
                <ThemedText style={styles.selectionText}>
                  余票详情: {dialogContent.ticketsDetailStr}
                </ThemedText>
              </ThemedView>
            )}
            <Button title="关闭" onPress={() => setDialogVisible(false)} />
          </ThemedView>
        </ThemedView>
      </Modal>
    </SafeAreaView>
  );
}

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    borderColor: "#ccc",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 0 : 8, // 为Android设备增加顶部内边距
    paddingBottom: 50,
    padding: 10,
  },

  selectionContainer: {
    padding: 10,
    gap: 2,
    borderRadius: 4,
    boxShadow: "0 0 10px 2px rgb(197, 87, 9) inset",
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
    margin: 10,
  },
  dialogContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialogContent: {
    // width: "40%", // Set dialog width to 80%
    padding: 20,
    // paddingBottom: 10,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 1)",
    boxShadow: " 0px 0px 3px 3px rgba(255, 255, 255, 0.24)",
  },
  dialogTitle: {
    fontSize: 18,
    alignItems: "center",
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 5,
    padding: 5,
  },
});
