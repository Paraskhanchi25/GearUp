import 'package:serverpod/serverpod.dart';
import '../generated/protocol.dart';

/// Serverpod Endpoint for User-Generated Vehicle Stories and Rider Audio Testimonials
class StoriesEndpoint extends Endpoint {
  /// Fetch stories attached to a specific vehicle listing
  Future<List<Story>> getListingStories(Session session, UuidValue listingId) async {
    session.log('Fetching rider stories for listing: $listingId');

    final stories = await Story.db.find(
      session,
      where: (t) => t.listingId.equals(listingId),
      orderBy: (t) => t.createdAt,
      orderDescending: true,
    );

    return stories;
  }

  /// Create a new story with audio and images
  Future<Story> createStory(Session session, Story story) async {
    final authInfo = await session.authenticated;
    if (authInfo == null) {
      throw EndpointException('Must be logged in to post a vehicle story');
    }

    final newStory = await Story.db.insertRow(session, story);
    session.log('Story created successfully with ID: ${newStory.id}');
    return newStory;
  }

  /// Upvote / Like a rider story
  Future<bool> likeStory(Session session, int storyId) async {
    final story = await Story.db.findById(session, storyId);
    if (story == null) return false;

    story.likeCount += 1;
    await Story.db.updateRow(session, story);
    return true;
  }
}
