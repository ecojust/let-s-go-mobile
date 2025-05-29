import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import { ThemedText } from "@/components/ThemedText";
import {
  Modal,
  View,
  StyleSheet,
  Button,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import * as Notifications from "expo-notifications";
import { NotificationService } from "../services/NotificationService";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 3000,
  fade: true,
});
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [lastFrameTime, setLastFrameTime] = useState(0);

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // 注册通知权限
    NotificationService.registerForPushNotificationsAsync().then((token) => {
      console.log("Push Notification Token:", token);
    });
    console.log("useEffect:", 999);

    // 监听收到通知
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("收到通知:", notification);
      });

    // 监听点击通知
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("点击通知:", response);
      });

    if (loaded) {
      SplashScreen.hideAsync();
    }

    return () => {
      // Notifications.removeNotificationSubscription(
      //   notificationListener.current
      // );
      // Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [loaded]);
  const handleNotify = () => {
    setTimeout(() => {
      NotificationService.scheduleLocalNotification(
        "测试通知",
        "这是一条测试通知内容",
        2 // 12秒后显示
      );
    }, 5000);
  };
  // 处理相机帧数据
  const handleCameraFrame = (frame: any) => {
    const currentTime = Date.now();

    // 每秒只处理一次帧数据
    if (currentTime - lastFrameTime >= 1000) {
      console.log("相机帧数据:", frame);
      setLastFrameTime(currentTime);
    }
  };

  if (!loaded) {
    return null;
  }

  // 处理摄像头权限和激活
  const handleCameraAccess = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert("权限被拒绝", "需要相机权限才能继续");
        return;
      }
    }

    // 激活摄像头
    setCameraActive(true);
  };

  // 处理人脸识别完成
  const handleFaceRecognitionComplete = () => {
    // 这里可以添加人脸识别成功后的逻辑
    setCameraActive(false);
    setIsLoginVisible(false);
  };

  // 获取屏幕宽度以计算圆形尺寸
  const windowWidth = Dimensions.get("window").width;
  const circleSize = windowWidth * 0.7; // 圆形区域大小为屏幕宽度的70%

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <Stack initialRouteName="login">
          <Stack.Screen name="login" options={{ headerShown: true }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isLoginVisible}
          onRequestClose={() => setIsLoginVisible(false)}
          // 移除这里的style属性，解决安卓13上的显示问题
        >
          <View
            style={[
              styles.modalContainer,
              { position: "absolute", width: "100%", height: "100%" },
            ]}
          >
            {cameraActive ? (
              <View style={styles.cameraContainer}>
                <CameraView
                  style={styles.camera}
                  facing={"front"}
                  // onFrame={handleCameraFrame}
                  // fps={30}
                />

                {/* 矩形遮罩层 - 使用四块矩形实现镂空效果 */}
                <View style={styles.maskOuterContainer}>
                  {/* 上方矩形 */}
                  <View style={[styles.maskRect, styles.topRect]} />

                  {/* 左侧矩形 */}
                  <View style={[styles.maskRect, styles.leftRect]} />

                  {/* 右侧矩形 */}
                  <View style={[styles.maskRect, styles.rightRect]} />

                  {/* 下方矩形 */}
                  <View style={[styles.maskRect, styles.bottomRect]} />

                  {/* 中间区域边框 */}
                  <View style={styles.centerBorder} />

                  <ThemedText style={styles.faceHint}>
                    请将脸部放入方框内
                  </ThemedText>
                </View>

                {/* 取消按钮 */}
                <View style={styles.buttonContainer}>
                  <Button title="取消" onPress={() => setCameraActive(false)} />
                  <Button
                    title="确认"
                    onPress={handleFaceRecognitionComplete}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.modalContent}>
                <Button title="开始人脸识别" onPress={handleCameraAccess} />
                <Button title="notify" onPress={handleNotify} />
              </View>
            )}
          </View>
        </Modal>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    marginHorizontal: 0,
    height: "100%",
    backgroundColor: "rgba(255, 0, 0, 0.0)", // 内容区域背景色
    margin: 0,
    borderRadius: 10,
    padding: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  camera: {
    flex: 1,
  },
  maskContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 0)", // 将透明度从0.5改为0.8，使背景更不透明
  },
  circleMask: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  maskOuterContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  maskRect: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 1)", // 不透明黑色背景
  },
  topRect: {
    top: 0,
    left: 0,
    right: 0,
    height: Dimensions.get("window").height / 2 - 180, // 从-150改为-180
  },
  leftRect: {
    top: Dimensions.get("window").height / 2 - 180, // 从-150改为-180
    left: 0,
    width: (Dimensions.get("window").width - 300) / 2,
    height: 300,
  },
  rightRect: {
    top: Dimensions.get("window").height / 2 - 180, // 从-150改为-180
    right: 0,
    width: (Dimensions.get("window").width - 300) / 2,
    height: 300,
  },
  bottomRect: {
    bottom: 0,
    left: 0,
    right: 0,
    height: Dimensions.get("window").height / 2 - 120, // 从-150改为-120，因为边框向上移动了30像素
  },
  centerBorder: {
    position: "absolute",
    top: Dimensions.get("window").height / 2 - 180,
    left: (Dimensions.get("window").width - 300) / 2,
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  faceHint: {
    position: "absolute",
    color: "#fff",
    bottom: Dimensions.get("window").height / 2 - 210, // 从-180改为-210
    alignSelf: "center",
    fontSize: 18,
    zIndex: 3,
  },
});
