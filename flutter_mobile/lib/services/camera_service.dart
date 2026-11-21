import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';

/// Camera Access Service for Vehicle Inspection & Cosmetic Photography
class CameraService {
  static final CameraService _instance = CameraService._internal();
  factory CameraService() => _instance;
  CameraService._internal();

  CameraController? _controller;
  CameraController? get controller => _controller;
  List<CameraDescription> _cameras = [];

  bool get isInitialized => _controller != null && _controller!.value.isInitialized;

  /// Initialize device camera
  Future<void> initializeCamera() async {
    try {
      _cameras = await availableCameras();
      if (_cameras.isNotEmpty) {
        _controller = CameraController(
          _cameras.first,
          ResolutionPreset.high,
          enableAudio: false,
        );
        await _controller!.initialize();
      }
    } catch (e) {
      debugPrint('Camera initialization error: $e');
    }
  }

  /// Take a vehicle photo for inspection
  Future<XFile?> captureInspectionPhoto() async {
    if (!isInitialized) return null;
    try {
      final photo = await _controller!.takePicture();
      return photo;
    } catch (e) {
      debugPrint('Error capturing photo: $e');
      return null;
    }
  }

  void dispose() {
    _controller?.dispose();
  }
}
