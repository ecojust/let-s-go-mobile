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
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTable } from "@/components/ThemedTable";
import { ThemedButton } from "@/components/ThemedButton";

import { WebViewFetcher } from "../services/webviewFetcher";

import { queryDayListScript, queryStationScript } from "../config/script";

import {
  parseList,
  generateSearchTrainsUrl,
  generateStationUrl,
  parseStations,
} from "../services";

export default function HomeScreen() {
  const [content, setContent] = useState("");
  const [fetchUrl, setFetchUrl] = useState("");
  const [startFetch, setStartFetch] = useState(false);
  const [injectScript, setInjectScript] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [stationsDialogVisible, setStationsDialogVisible] = useState(false); // State for stations dialog
  const [stations, setStations] = useState<any[]>([]); // State for stations data

  const [tableData, setTableData] = useState([]);
  const [task, setTask] = useState("searchList");

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
    setLoading(true); // Show loading indicator
    setTableData([]);

    const url = generateSearchTrainsUrl(selectionData!);
    console.log(url);
    // if (url) {
    setTask("searchList");
    setFetchUrl(
      "https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=%E4%B8%8A%E6%B5%B7,SHH&ts=%E5%A4%A9%E6%B4%A5,TJP&date=2025-06-11&flag=N,N,Y"
    );
    setInjectScript(queryDayListScript);
    setStartFetch(true);
    // }
  };

  const handleContentFetched = async (html: string) => {
    switch (task) {
      case "searchList":
        setContent(html);
        setStartFetch(false);
        const list = await parseList(html!);
        setTableData(list as never[]);
        setLoading(false); // Hide loading indicator after setting fetch state
        break;

      case "searchStation":
        setContent(html);
        const fetchedStations = await parseStations(html);
        setStations(fetchedStations); // Set stations data
        setStationsDialogVisible(true); // Show stations dialog
        setStartFetch(false);
        setLoading(false); // Hide loading indicator

        setTimeout(() => {
          setTask("searchTimeLine");

          // await Plugin.searchTickets(
          //   currentTrain.value.trainNo,
          //   stations.value,
          //   form.from,
          //   form.date,
          //   (data) => {
          //     tickets.value[data.to] = {
          //       message: `车次【${data.trainNo}】从${data.from}到${data.to}的余票查询结束`,
          //       tickets: data.tickets,
          //     };
          //   }
          // );
        }, 1000);
        break;
      case "searchTimeLine":
        break;
    }
  };

  const handleItemClick = async (row: any, action: string) => {
    console.log(action, row);
    setDialogContent(row);
    switch (action) {
      case "more":
        setDialogVisible(true);
        break;
      case "fetchAllTickets":
        if (
          !row.raw_data.train_no ||
          !row.raw_data.from_station_telecode ||
          !row.raw_data.to_station_telecode
        ) {
          return;
        }
        const url = generateStationUrl(
          row.raw_data.train_no,
          row.raw_data.from_station_telecode,
          row.raw_data.to_station_telecode,
          selectionData?.date!
        );
        setTask("searchStation");

        console.log("url", url);
        setFetchUrl(
          "https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=5l0000G104B2&from_station_telecode=AOH&to_station_telecode=TIP&depart_date=2025-06-03"
        );
        setInjectScript(queryStationScript);
        setStartFetch(true);
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

      {loading && (
        <ThemedView>
          <ActivityIndicator size="large" color="#4466ff" />
        </ThemedView>
      )}

      {/* <ThemedText style={styles.selectionText}>{content}</ThemedText> */}
      {startFetch && (
        <WebViewFetcher
          injectedScript={injectScript}
          height={100}
          url={fetchUrl}
          onContentFetched={handleContentFetched}
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          {/* 使用 ThemedTable 组件 */}

          <ThemedTable
            data={tableData}
            columns={tableColumns}
            onPress={handleItemClick}
          />
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
              <ThemedView style={{}}>
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

      {/* Stations Dialog */}
      <Modal
        visible={stationsDialogVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStationsDialogVisible(false)}
      >
        <ThemedView style={styles.stationsDialogContainer}>
          <ThemedView style={styles.stationsDialogContent}>
            <ThemedText style={styles.dialogTitle}>
              {selectionData?.date}|{dialogContent?.trainNo}车站信息
            </ThemedText>
            <FlatList
              data={stations}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <ThemedText style={styles.stationItem}>
                  {item.station_name} ({item.arrive_time} - {item.start_time})
                </ThemedText>
              )}
            />
            <Button
              title="关闭"
              onPress={() => setStationsDialogVisible(false)}
            />
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
    // boxShadow: "0 0 10px 2px rgba(197, 87, 9, 0.32) inset",
    boxShadow: "rgba(50, 50, 93, 0.25) 0px 0px 6px 2px inset",
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
    // width: 400,

    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialogContent: {
    // width: "40%", // Set dialog width to 80%
    minWidth: 300,
    padding: 10,
    // paddingBottom: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    // backgroundColor: "rgb(207, 20, 20)",
    boxShadow: " 0px 0px 3px 3px rgba(255, 255, 255, 0.14)",
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
  stationsDialogContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  stationsDialogContent: {
    width: "90%",
    height: "80%",
    padding: 0,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  stationItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});
