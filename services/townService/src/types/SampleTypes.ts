import { ServerConversationArea } from '../client/TownsServiceClient';
import { UserLocation } from '../CoveyTypes';

enum FriendRequestStatus {
  pending,
  accepted,
  rejected,
}

interface FriendRequest {
  playerId: string,
  status: FriendRequestStatus
}


export interface Player {
  id: string,
  userName: string,
  location: UserLocation,
  activeConversationArea: ServerConversationArea,
  friendIds: string[],
  sentFriendRequests: FriendRequest[],
  receivedFriendRequests: FriendRequest[]
}

// [Player]

// Database tables required:
/**
 * Player
 * 
 * Mongo DB - UserName - NiranjanVelraj - pwd - cduu8pV8PJGBNz7Y
 */