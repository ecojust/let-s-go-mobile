import 'package:awesome_notifications/awesome_notifications.dart';

import 'notification_controller.dart';
import 'theme.dart';

class NotificationService {
  /// Invoke before `runApp`
  Future<bool> initialize() {
    return AwesomeNotifications().initialize(
      // set the icon to null if you want to use the default app icon
      'resource://drawable/app_icon',
      [
        NotificationChannel(
          channelGroupKey: 'basic_channel_group',
          channelKey: 'basic_channel',
          channelName: 'Basic notifications',
          channelDescription: 'Notification channel for basic tests',
          defaultColor: brandColor,
          importance: NotificationImportance.High,
          playSound: true,
          enableVibration: true,
          enableLights: true,
        ),
      ],
      // Channel groups are only visual and are not required
      // channelGroups: [
      //   NotificationChannelGroup(
      //     channelGroupKey: 'basic_channel_group',
      //     channelGroupName: 'Basic group',
      //   ),
      // ],
      debug: true,
    );
  }

  /// Register callbacks for the notification.
  Future<bool> setupCallbacks() async {
    // Only after at least the action method is set, the notification events are delivered
    final success = await AwesomeNotifications().setListeners(
      onActionReceivedMethod: NotificationController.onActionReceivedMethod,
      onNotificationCreatedMethod:
          NotificationController.onNotificationCreatedMethod,
      onNotificationDisplayedMethod:
          NotificationController.onNotificationDisplayedMethod,
      onDismissActionReceivedMethod:
          NotificationController.onDismissActionReceivedMethod,
    );
    return success;
  }

  /// Request permission from OS to show notifications, if it isn't allowed already
  Future<bool> requestPermission() async {
    bool isAllowed = await AwesomeNotifications().isNotificationAllowed();
    if (!isAllowed) {
      isAllowed = await AwesomeNotifications().requestPermissionToSendNotifications(
        permissions: [
          NotificationPermission.Alert,
          NotificationPermission.Sound,
          NotificationPermission.Badge,
          NotificationPermission.Vibration,
          NotificationPermission.Light,
          NotificationPermission.CriticalAlert,
        ]
      );
    }
    return isAllowed;
  }

  int _lastId = 0;

  /// Create a notification
  Future<bool> show({String? title, String? body, Map<String, String?>? payload}) async {
    try {
      // 确保有权限
      bool hasPermission = await requestPermission();
      if (!hasPermission) {
        print("通知权限未获取，无法显示通知");
        return false;
      }
      
      // 创建通知
      return await AwesomeNotifications().createNotification(
        content: NotificationContent(
          id: _lastId++,
          channelKey: 'basic_channel',
          actionType: ActionType.Default,
          title: title ?? "默认标题",  // 提供默认值
          body: body ?? "默认内容",    // 提供默认值
          payload: payload,
          notificationLayout: NotificationLayout.Default,
          // 添加小图标和大图标
          // smallIcon: 'resource://drawable/app_icon',  // 小图标
          // largeIcon: 'resource://drawable/app_icon',         // 大图标
        ),
      );
    } catch (e) {
      print("创建通知时出错: $e");
      return false;
    }
  }
}
