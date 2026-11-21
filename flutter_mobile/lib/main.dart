import 'package:flutter/material.dart';
import 'services/location_service.dart';
import 'services/camera_service.dart';
import 'services/audio_service.dart';
import 'services/sensor_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const GearUpMobileApp());
}

class GearUpMobileApp extends StatelessWidget {
  const GearUpMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GEAR UP Mobile',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0A1411),
        primaryColor: const Color(0xFF176B50),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF176B50),
          secondary: Color(0xFFD6AD62),
          surface: Color(0xFF101D19),
        ),
        fontFamily: 'Plus Jakarta Sans',
      ),
      home: const MobileHomeScreen(),
    );
  }
}

class MobileHomeScreen extends StatefulWidget {
  const MobileHomeScreen({super.key});

  @override
  State<MobileHomeScreen> createState() => _MobileHomeScreenState();
}

class _MobileHomeScreenState extends State<MobileHomeScreen> {
  final LocationService _locationService = LocationService();
  final SensorService _sensorService = SensorService();
  String _statusText = 'Ready';
  double _currentLean = 0.0;
  double _currentVibration = 0.0;

  @override
  void initState() {
    super.initState();
    // Transparently request location only when screen loads
    _locationService.determinePosition(
      onPermissionDenied: (reason) {
        setState(() => _statusText = reason);
      },
    );
  }

  void _toggleTelemetry() {
    _sensorService.startTestRideMonitoring(
      onTelemetryUpdate: (lean, vibration) {
        setState(() {
          _currentLean = lean;
          _currentVibration = vibration;
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GEAR UP India', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0E1A16),
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF101D19),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF1A332B)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Device Capabilities Status', style: TextStyle(color: Color(0xFF2A9D79), fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('GPS Origin: ${_locationService.currentPosition?.latitude ?? 30.7333}, ${_locationService.currentPosition?.longitude ?? 76.7794} (Chandigarh Hub)'),
                  const SizedBox(height: 4),
                  Text('Status: $_statusText', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Telematics Sensor Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF101D19),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF1A332B)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Test Ride Telemetry (Sensors Plus)', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('Lean Angle: ${_currentLean.toStringAsFixed(1)}°'),
                  Text('Chassis Vibration: ${_currentVibration.toStringAsFixed(2)} g'),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: _toggleTelemetry,
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF176B50)),
                    child: const Text('Start Telematics Stream'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
