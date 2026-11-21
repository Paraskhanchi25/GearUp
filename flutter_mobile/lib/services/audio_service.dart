import 'package:record/record.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';

/// Audio Recording & Playback Service for Rider Vehicle Stories
class AudioService {
  static final AudioService _instance = AudioService._internal();
  factory AudioService() => _instance;
  AudioService._internal();

  final AudioRecorder _recorder = AudioRecorder();
  final AudioPlayer _player = AudioPlayer();

  bool _isRecording = false;
  bool get isRecording => _isRecording;

  /// Start recording a rider audio story
  Future<bool> startRecording(String filePath) async {
    try {
      if (await _recorder.hasPermission()) {
        await _recorder.start(
          const RecordConfig(encoder: AudioEncoder.aacLc, bitRate: 128000),
          path: filePath,
        );
        _isRecording = true;
        return true;
      }
    } catch (e) {
      debugPrint('Error starting audio recording: $e');
    }
    return false;
  }

  /// Stop recording and return file path
  Future<String?> stopRecording() async {
    try {
      final path = await _recorder.stop();
      _isRecording = false;
      return path;
    } catch (e) {
      debugPrint('Error stopping audio recording: $e');
      return null;
    }
  }

  /// Play audio story from remote URL or local file
  Future<void> playAudio(String sourceUrl) async {
    try {
      await _player.stop();
      await _player.play(UrlSource(sourceUrl));
    } catch (e) {
      debugPrint('Error playing audio: $e');
    }
  }

  Future<void> pauseAudio() async {
    await _player.pause();
  }

  void dispose() {
    _recorder.dispose();
    _player.dispose();
  }
}
