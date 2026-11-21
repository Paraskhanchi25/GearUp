import 'package:serverpod/serverpod.dart';
import '../generated/protocol.dart';

/// Serverpod Endpoint for Places (Inspection Hubs, Service Centers & Rider Pitstops)
class PlacesEndpoint extends Endpoint {
  /// Fetch places within a radius using PostGIS coordinates
  Future<List<Place>> getNearbyPlaces(
    Session session, {
    required double lat,
    required double lng,
    required double radiusKm,
  }) async {
    session.log('Querying nearby places around ($lat, $lng) within $radiusKm km');

    // PostGIS query execution via Serverpod database connection
    final results = await session.db.query(
      '''
      SELECT id, name, place_type, city, address, latitude, longitude, rating, cover_image_url, is_verified_partner, created_at
      FROM places
      WHERE ST_DWithin(
        geom::geography,
        ST_SetSRID(ST_MakePoint(@lng, @lat), 4326)::geography,
        @radiusMeters
      )
      ORDER BY rating DESC;
      ''',
      parameters: {
        'lat': lat,
        'lng': lng,
        'radiusMeters': radiusKm * 1000.0,
      },
    );

    return results.map((row) {
      return Place(
        name: row[1] as String,
        placeType: row[2] as String,
        city: row[3] as String,
        address: row[4] as String,
        latitude: (row[5] as num).toDouble(),
        longitude: (row[6] as num).toDouble(),
        rating: (row[7] as num?)?.toDouble(),
        coverImageUrl: row[8] as String?,
        isVerifiedPartner: row[9] as bool,
        createdAt: row[10] as DateTime,
      );
    }).toList();
  }

  /// Create a new rider place or partner hub
  Future<Place> createPlace(Session session, Place place) async {
    // Requires authenticated user with partner or dealer role
    final authInfo = await session.authenticated;
    if (authInfo == null) {
      throw EndpointException('Authentication required to create a new place hub');
    }

    // Insert into DB with geometry Point
    await session.db.query(
      '''
      INSERT INTO places (name, place_type, city, address, latitude, longitude, geom, is_verified_partner)
      VALUES (@name, @placeType, @city, @address, @lat, @lng, ST_SetSRID(ST_MakePoint(@lng, @lat), 4326), @isVerified);
      ''',
      parameters: {
        'name': place.name,
        'placeType': place.placeType,
        'city': place.city,
        'address': place.address,
        'lat': place.latitude,
        'lng': place.longitude,
        'isVerified': place.isVerifiedPartner,
      },
    );

    return place;
  }
}

class EndpointException implements Exception {
  final String message;
  EndpointException(this.message);
  @override
  String toString() => message;
}
