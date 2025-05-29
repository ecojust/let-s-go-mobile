import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'notification_form.dart';
import 'notification_service.dart';
import 'theme.dart';

void main() async {
  final notification = NotificationService();
  await notification.initialize();
  runApp(
    Provider<NotificationService>.value(
      value: notification,
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final title = 'Local Notifications Demo';

  @override
  void initState() {
    super.initState();
    context.read<NotificationService>().setupCallbacks();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: MyApp.navigatorKey,
      title: title,
      color: brandColor,
      theme: theme,
      darkTheme: theme,
      home: Scaffold(
        appBar: AppBar(title: Text(title), centerTitle: true),
        body: const NotificationForm(),
      ),
    );
  }
}
