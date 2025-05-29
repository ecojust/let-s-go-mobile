import 'package:flutter/material.dart';

const brandColor = Colors.deepPurple;

final theme = ThemeData.from(
  colorScheme: ColorScheme.fromSeed(
    seedColor: brandColor,
    brightness: Brightness.light,
  ),
);

final darkTheme = ThemeData.from(
  colorScheme: ColorScheme.fromSeed(
    seedColor: brandColor,
    brightness: Brightness.dark,
  ),
);
