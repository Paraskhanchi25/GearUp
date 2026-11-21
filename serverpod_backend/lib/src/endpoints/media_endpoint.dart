import 'package:serverpod/serverpod.dart';
import '../generated/protocol.dart';

/// Serverpod Media Endpoint for Secure Object Storage Pointers & Pre-Signed URLs
class MediaEndpoint extends Endpoint {
  /// Generate a pre-signed upload URL for secure client uploads to S3/GCS
  Future<Map<String, String>> getUploadUrl(
    Session session, {
    required String fileName,
    required String mimeType,
    required bool isSensitive,
  }) async {
    final authInfo = await session.authenticated;
    if (authInfo == null && isSensitive) {
      throw EndpointException('Authentication required for sensitive document uploads (e.g. RC)');
    }

    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final fileKey = 'uploads/${authInfo?.userId ?? 'guest'}/$timestamp-$fileName';

    // In production, sign with AWS S3 / Google Cloud Storage SDK
    final uploadUrl = 'https://storage.gearup.in/signed-put/$fileKey?token=mock_secure_token';
    final publicUrl = 'https://storage.gearup.in/$fileKey';

    return {
      'fileKey': fileKey,
      'uploadUrl': uploadUrl,
      'publicUrl': publicUrl,
    };
  }

  /// Register media metadata after successful file upload
  Future<MediaMetadata> registerMediaMetadata(
    Session session,
    MediaMetadata metadata,
  ) async {
    return await MediaMetadata.db.insertRow(session, metadata);
  }
}
