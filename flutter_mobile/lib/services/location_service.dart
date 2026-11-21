import 'package:geolocator/geolocator.dart';
import 'package:flutter/foundation.dart';

/// Transparent GPS & Location Tracking Service for Flutter Client
class LocationService {
  static final LocationService _instance = LocationService._internal();
  factory LocationService() => _instance;
  LocationService._internal();

  Position? _currentPosition;
  Position? get currentPosition => _currentPosition;

  /// Default fallback origin: Chandigarh Sector 17
  final double defaultLat = 30.7333;
  final double defaultLng = 76.7794;

  /// Request Location Permission only when user triggers nearby discovery
  Future<Position?> determinePosition({required Function(String reason) onPermissionDenied}) async {
    bool serviceEnabled;
    LocationPermission permission;

    // Test if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      onPermissionDenied('Device location services are disabled. Using fallback city center.');
      return null;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        onPermissionDenied('Location permissions were denied by user.');
        return null;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      onPermissionDenied('Location permissions are permanently denied. Please enable in App Settings.');
      return null;
    }

    // High accuracy GPS position
    try {
      _currentPosition = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 10),
      );
      return _currentPosition;
    } catch (e) {
      debugPrint('Error getting GPS: $e');
      return null;
    }
  }

  /// Haversine distance in kilometers
  double getDistanceBetween(double startLat, double startLng, double endLat, double endLng) {
    return Geolocator.distanceBetween(startLat, startLng, endLat, endLng) / 1000.0;
  }
}
