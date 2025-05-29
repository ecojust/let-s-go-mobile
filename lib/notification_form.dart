import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'notification_service.dart';

class NotificationForm extends StatefulWidget {
  const NotificationForm({super.key});

  @override
  State<NotificationForm> createState() => _NotificationFormState();
}

class _NotificationFormState extends State<NotificationForm> {
  final _titleController = TextEditingController();
  final _bodyController = TextEditingController();
  final _payloadController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    _bodyController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        children: [
          OutlinedButton(
            onPressed: () {
              context.read<NotificationService>().requestPermission();
            },
            child: Text("Request permission"),
          ),
          TextFormField(
            controller: _titleController,
            decoration: const InputDecoration(label: Text("Title")),
          ),
          spacer,
          TextFormField(
            controller: _bodyController,
            decoration: const InputDecoration(label: Text("Body")),
          ),
          spacer,
          TextFormField(
            controller: _payloadController,
            decoration: const InputDecoration(label: Text("Payload")),
          ),
          spacer,
          ElevatedButton(
            onPressed: () async {
              // 先确保有权限
              bool hasPermission = await context.read<NotificationService>().requestPermission();
              
              if (hasPermission) {
                // 显示对话框
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                      title: const Text("Alert Dialog Box"),
                      content: const Text("You have raised an Alert Dialog Box"),
                      actions: <Widget>[
                        TextButton(
                          onPressed: () {
                            Navigator.of(ctx).pop();
                          },
                          child: const Text("Okay"),
                        ),
                      ],
                  ),
                );
                
                // 发送通知
                bool success = await context.read<NotificationService>().show(
                  title: _titleController.text,
                  body: _bodyController.text,
                  payload: {"text": _payloadController.text},
                );
                
                if (!success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("通知发送失败")),
                  );
                }
              } else {
                // 提示用户需要权限
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("需要通知权限才能发送通知")),
                );
              }
            },
            child: const Text("Show notification"),
          ),
        ],
      ),
    );
  }
}

const spacer = SizedBox(height: 8);
