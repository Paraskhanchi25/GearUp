import 'dart:async';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:flutter/foundation.dart';

/// Device Sensor Telematics Service (Accelerometer & Gyroscope)
/// Used during test rides to monitor lean angles and vibration telemetry
class SensorService {
  static final SensorService _instance = SensorService._internal();
  factory SensorService() => _instance;
  SensorService._internal();

  StreamSubscription<UserAccelerometerEvent>? _accelerometerSubscription;
  StreamSubscription<GyroscopeEvent>? _gyroscopeSubscription;

  double leanAngle = 0.0;
  double vibrationLevel = 0.0;

  /// Start telemetry monitoring during a scheduled test ride
  void startTestRideMonitoring({
    required Function(double lean, double vibration) onTelemetryUpdate,
  }) {
    _accelerometerSubscription = userAccelerometerEventStream().listen((UserAccelerometerEvent event) {
      // Calculate instantaneous vibration magnitude
      vibrationLevel = (event.x.abs() + event.y.abs() + event.z.abs()) / 3.0;
      onTelemetryUpdate(leanAngle, vibrationLevel);
    });

    _gyroscopeSubscription = gyroscopeEventStream().listen((GyroscopeEvent event) {
      // Estimate lean angle in degrees from roll rate
      leanAngle = event.z * (180 / 3.14159);
      onTelemetryUpdate(leanAngle, vibrationLevel);
    });
  }

  /// Stop sensor stream when test ride finishes
  void stopMonitoring() {
    _accelerometerSubscription?.cancel();
    _gyroscopeSubscription?.cancel();
  }
}
