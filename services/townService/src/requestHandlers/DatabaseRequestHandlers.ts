import {  FriendRequests, Players } from '@prisma/client';
import * as databaseController from '../database/DatabaseController';
import { FriendRequestStatus } from '../Utils';

/**
 * Envelope that wraps any response from the server
 */
export interface DatabaseResponseEnvelope<T> {
  databaseError: boolean;
  isOK: boolean;
  message?: string;
  response?: T;
}

/**
 * Logs in the user and fetches the player details.
 * 
 * @param userName the userName of the player to login
 * @returns the player details or null if player not found
 */
export async function loginUser(userName: string): Promise<DatabaseResponseEnvelope<Players>> {
  const userDetails = await databaseController.findPlayerByUserName(userName);
  if (userDetails === null) {
    return {
      databaseError: false,
      isOK: false,
      message: 'User details not available in database. Cannot login.',
      response: undefined,
    };
  }
  return {
    databaseError: false,
    isOK: true,
    response: userDetails,
  };
}

/**
 * Checks if the user is already present. If not, creates a new entry for the player.
 * 
 * @param userName the userName of the player to signup
 * @returns the details of the player created. Null if player is already present
 */
export async function signupUser(userName: string): Promise<DatabaseResponseEnvelope<Players>> {
  const userDetails = await databaseController.findPlayerByUserName(userName);
  if (userDetails !== null) {
    return {
      databaseError: false,
      isOK: false,
      message: 'User details already in database. Cannot signup with the same player name.',
      response: undefined,
    };
  } 
  const newUserDetails = await databaseController.insertPlayer({
    id: '1',
    playerName: userName,
    friendIds: [],
  });
  return {
    databaseError: false,
    isOK: false,
    response: newUserDetails,
  };
}

/**
 * Gets all the player details from the database.
 * 
 * @returns the details of all the players who has an account
 */
export async function getAllPlayers(): Promise<DatabaseResponseEnvelope<Players[]>> {
  const allPlayerDetails = await databaseController.fetchAllPlayers();
  return {
    databaseError: false,
    isOK: true,
    response: allPlayerDetails,
  };
}

/**
 * Updates the database to reflect the friend request status.
 * 
 * @param fromPlayerName the userName of the Player sending the friend request
 * @param toPlayerName the userName of the Player receiving the friend request
 * @returns true if the friend request is successful. False otherwise
 */
export async function sendFriendRequest(fromPlayerName: string, toPlayerName: string): Promise<void> {
  const fromPlayer = await databaseController.findPlayerByUserName(fromPlayerName);
  const toPlayer = await databaseController.findPlayerByUserName(toPlayerName);
  if (fromPlayerName === toPlayerName || fromPlayer === null || toPlayer === null) {
    throw new Error('Unable to fetch player details. Sending friend request failed.');
  }
  await databaseController.addFriendRequest({
    id: '1',
    sendingPlayerName: fromPlayerName,
    receivingPlayerName: toPlayerName,
    status: FriendRequestStatus.pending,
  });
}

/**
 * Updates the database to reflect the acceptance of the friend request.
 * 
 * @param fromPlayerName the userName of the Player sending the friend request
 * @param toPlayerName the userName of the Player receiving the friend request
 * @returns true if the friend request status update is successful.
 */
export async function acceptFriendRequest(fromPlayerName: string, toPlayerName: string): Promise<void> {
  const fromPlayer = await databaseController.findPlayerByUserName(fromPlayerName);
  const toPlayer = await databaseController.findPlayerByUserName(toPlayerName);
  if (fromPlayerName === toPlayerName || fromPlayer === null || toPlayer === null) {
    throw new Error('Unable to fetch player details. Accepting friend request failed.');
  }
  const friendRequestObject = await databaseController.getFriendRequest(
    fromPlayerName,
    toPlayerName,
  );
  if (friendRequestObject === null) {
    throw new Error('No friend request found between the players. Accepting request failed.');
  } 
  await Promise.all([
    databaseController.updateFriendRequestStatus(friendRequestObject, FriendRequestStatus.accepted),
    databaseController.addFriend(fromPlayer, toPlayer.id),
    databaseController.addFriend(toPlayer, fromPlayer.id),
  ],
  );
}

/**
 * Updates the database to reflect the of the friend request rejection.
 * 
 * @param fromPlayerName the userName of the Player sending the friend request
 * @param toPlayerName the userName of the Player receiving the friend request
 * @returns true if the friend request status update is successful.
 */
export async function rejectFriendRequest(fromPlayerName: string, toPlayerName: string): Promise<void> {
  const fromPlayer = await databaseController.findPlayerByUserName(fromPlayerName);
  const toPlayer = await databaseController.findPlayerByUserName(toPlayerName);
  if (fromPlayerName === toPlayerName || fromPlayer === null || toPlayer === null) {
    throw new Error('Unable to fetch player details. Rejecting friend request failed.');
  }
  const friendRequestObject = await databaseController.getFriendRequest(
    fromPlayerName,
    toPlayerName,
  );
  if (friendRequestObject === null) {
    throw new Error('No friend request found between the players. Rejecting request failed.');
  } 
  await databaseController.updateFriendRequestStatus(friendRequestObject, FriendRequestStatus.rejected);

}

/**
 * Gets all the friend requests sent by the player.
 * @param fromPlayerName the player sending the friend request
 * @returns the list of friend requests
 */
export async function getSentFriendRequests(fromPlayerName: string): Promise<FriendRequests[]> {
  const fromPlayer = await databaseController.findPlayerByUserName(fromPlayerName);
  if (fromPlayer === null) {
    throw new Error('Player details not found. Getting sent friend requests failed.');
  }
  const friendRequests = await databaseController.getSentFriendRequestsStatus(
    fromPlayer.playerName,
    FriendRequestStatus.pending,
  );
  return friendRequests;
}

/**
 * Gets all the friend requests received by the player.
 * @param toPlayerName the player receiving the friend request
 * @returns the list of friend requests
 */
export async function getReceivedFriendRequests(toPlayerName: string): Promise<FriendRequests[]> {
  const fromPlayer = await databaseController.findPlayerByUserName(toPlayerName);
  if (fromPlayer === null) {
    throw new Error('Player details not found. Getting received friend requests failed.');
  }
  const friendRequests = await databaseController.getReceivedFriendRequestsStatus(
    fromPlayer.playerName,
    FriendRequestStatus.pending,
  );
  return friendRequests;
}