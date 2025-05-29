# Flutter Notifications Demo

A comprehensive Flutter application demonstrating various notification implementations using Awesome Notifications and Firebase Cloud Messaging (FCM).

## Features

This app showcases a wide range of notification capabilities in Flutter:

### 🔔 Local Notifications
- Basic notifications with title, body, and summary
- Rich layouts (default, inbox, progress bar, messaging)
- Big picture notifications with images
- Action button notifications with custom actions
- Scheduled notifications with precise timing

### 🔥 Firebase Cloud Messaging (FCM)
- Push notification integration with Firebase
- FCM token management
- Topic subscription for broadcast messaging
- Background and foreground message handling
- Silent data message processing

## Getting Started

### Prerequisites
- Flutter SDK (3.7.2 or higher)
- Firebase Project
- Android or iOS device/emulator

### Installation

1. Clone this repository:
```bash
git clone https://github.com/javakanaya/notifications
cd notifications
```

2. Install dependencies:
```bash
flutter pub get
```

3. Setup Firebase for your project:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Register your Android/iOS app in the Firebase project
   - Download and add `google-services.json` to `android/app/` directory (for Android)
   - Download and add `GoogleService-Info.plist` to `ios/Runner/` directory (for iOS)

4. Run the application:
```bash
flutter run
```

## Project Structure

```
lib/
├── main.dart                 # Entry point with initialization
├── screens/
│   ├── home_screen.dart      # Main UI with notification examples
│   └── second_screen.dart    # Navigation destination from notifications
└── services/
    ├── notification_service.dart  # Local notification handling
    └── fcm_service.dart      # Firebase Cloud Messaging implementation
```

## Implementation Details

### Local Notifications

The app uses `awesome_notifications` to implement local notifications with various layouts:

```dart
// Create a basic notification
await NotificationService.createNotification(
  id: 1,
  title: 'Default Notification',
  body: 'This is the body of the notification',
  summary: 'Small summary',
);
```

### Firebase Cloud Messaging

FCM setup is handled by the `FcmService` class which manages:

```dart
// Get FCM token for this device
static Future<String> requestFCMToken() async {
  try {
    String token = await _fcmPlugin.requestFirebaseAppToken();
    debugPrint('FCM token: $token');
    return token;
  } catch (error) {
    debugPrint('Error getting FCM token: $error');
    return '';
  }
}
```

### Notification Channels

The app configures notification channels with specified properties:

```dart
NotificationChannel(
  channelKey: 'basic_channel',
  channelName: 'Basic notifications',
  channelDescription: 'Notification channel for basic tests',
  defaultColor: const Color(0xFF9D50DD),
  ledColor: Colors.white,
  importance: NotificationImportance.Max,
  channelShowBadge: true,
  playSound: true,
  criticalAlerts: true,
)
```

### Action Handling

Notification actions are handled through registered callbacks:

```dart
static Future<void> _onActionReceivedMethod(
  ReceivedNotification receivedNotification,
) async {
  final payload = receivedNotification.payload;
  if (payload == null) return;
  if (payload['navigate'] == 'true') {
    Navigator.push(
      MyApp.navigatorKey.currentContext!,
      MaterialPageRoute(builder: (_) => const SecondScreen()),
    );
  }
}
```

## Testing FCM with the Firebase Console

To test push notifications:

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Navigate to your project > Cloud Messaging
3. Click "Send your first message"
4. Enter notification details:
   - Title: Test Push Notification
   - Body: Hello from Firebase!
5. Target your app by selecting "Single Device" and pasting the FCM token or by using a topic
6. Send the message

## Advanced Usage

### Topic Messaging

Subscribe users to specific topics for targeted messaging:

```dart
// Subscribe to a topic
await FcmService.subscribeTopic('news');

// Send to a topic (server-side)
{
  "to": "/topics/news",
  "notification": {
    "title": "Latest News Update",
    "body": "Check out our new article about Flutter notifications!"
  }
}
```

### Silent Data Messages

Process data without showing visible notifications:

```dart
static Future<void> _onFcmSilentDataHandle(FcmSilentData silentData) async {
  // Background processing with the data
  if (silentData.createdLifeCycle == NotificationLifeCycle.Foreground) {
    // App is in foreground
  } else {
    // App is in background or terminated
  }
}
```

## Dependencies

- [flutter](https://flutter.dev/): SDK for building natively compiled applications
- [awesome_notifications](https://pub.dev/packages/awesome_notifications): Local notification manager
- [awesome_notifications_fcm](https://pub.dev/packages/awesome_notifications_fcm): Firebase Cloud Messaging extension
- [firebase_core](https://pub.dev/packages/firebase_core): Firebase Core functionality


## Acknowledgments

- [Awesome Notifications](https://github.com/rafaelsetragni/awesome_notifications) for the excellent notification library
- [Firebase](https://firebase.google.com/) for the cloud messaging infrastructure
