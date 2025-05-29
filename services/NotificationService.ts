import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { Audio } from "expo-av"; // 导入Audio模块

export class NotificationService {
  static sound: Audio.Sound;
  static deviceChannelMapping: { [key: string]: string } = {
    xiaomi: "xiaomi_high_priority",
  };
  static device: string = ""; // 添加静态成员变量存储设备类型

  // 添加检测小米设备的静态方法
  static detectDevice() {
    if (
      Device.manufacturer?.toLowerCase().includes("xiaomi") ||
      Device.modelName?.toLowerCase().includes("mi") ||
      Device.modelName?.toLowerCase().includes("redmi")
    ) {
      this.device = "xiaomi";
    }
  }

  static async loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/notification.mp3")
    );
    this.sound = sound;
  }

  static async registerForPushNotificationsAsync() {
    this.loadSound();
    this.detectDevice();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
          android: {
            // 对于Android 13+，确保请求POST_NOTIFICATIONS权限
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        // alert("无法获取推送通知权限！");
        return;
      }

      // 获取Expo推送令牌
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      console.log("获取token开始：", projectId);

      const res = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      })
        .then((res) => {
          console.log("获取token开始：", res);
          return res;
        })
        .catch((err) => {
          console.log("获取token开始：", err);
          return err;
        });
      console.log("获取token结束：", res);
    } else {
      alert("必须使用真机设备才能使用推送通知功能");
      console.log("注册通知:else", Device.isDevice);
    }

    if (Platform.OS === "android") {
      // 为Android创建通知通道，确保声音设置正确
      await Notifications.setNotificationChannelAsync("default", {
        name: "默认通知",
        description: "接收应用的默认通知",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        enableVibrate: true,
        enableLights: true,
        sound: "default", // 明确设置为默认系统声音
        bypassDnd: true,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        showBadge: true,
      });

      await Notifications.setNotificationChannelAsync("xiaomi_high_priority", {
        name: "重要通知",
        description: "高优先级通知（适用于小米设备）",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        enableVibrate: true,
        enableLights: true,
        sound: "default",
        bypassDnd: true,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        showBadge: true,
      });
    }

    return token;
  }

  static async scheduleLocalNotification(
    title: string,
    body: string,
    seconds: number = 2
  ) {
    const schedule = await Notifications.getAllScheduledNotificationsAsync();
    console.log("Agendadas: ", schedule);

    if (schedule.length > 0) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    const trigger = new Date(Date.now());
    trigger.setHours(trigger.getHours() + 5);
    trigger.setSeconds(0);

    const channelId = this.deviceChannelMapping[this.device] || "default";

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        priority: Notifications.AndroidNotificationPriority.MAX, // Android 优先级
        badge: 1, // iOS badge 数字
        sound: "default", // 明确设置为默认系统声音
        autoDismiss: false, // 防止自动消失
      },
      trigger: {
        seconds: seconds,
        channelId: channelId, // 使用适合设备的通道ID
      },
    });

    // 如果是Android系统，手动播放通知声音
    if (Platform.OS === "android") {
      try {
        await this.sound.setVolumeAsync(1.0); // 确保音量最大
        await this.sound.playAsync();
      } catch (error) {
        console.error("播放通知声音失败:", error);
      }
    }
  }
}
