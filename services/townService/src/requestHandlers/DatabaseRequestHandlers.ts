import {  Players } from '@prisma/client';
import * as databaseController from '../database/DatabaseController';
import { FriendRequestStatus } from '../Utils';

/**
 * Logs in the user and fetches the player details.
 * 
 * @param userName the userName of the player to login
 * @returns the player details or null if player not found
 */
export async function loginUser(userName: string): Promise<Players | null> {
  const userDetails = await databaseController.findPlayerByUserName(userName);
  return userDetails;
}

/**
 * Checks if the user is already present. If not, creates a new entry for the player.
 * 
 * @param userName the userName of the player to signup
 * @returns the details of the player created. Null if player is already present
 */
export async function signupUser(userName: string): Promise<Players | null> {
  const checkUserDetails = await databaseController.findPlayerByUserName(userName);
  if (checkUserDetails === null) {
    return null;
  } 
  const newUserDetails: Players = {
    id: '1',
    playerName: userName,
    friendIds: [],
  };
  return databaseController.insertPlayer(newUserDetails);
}

/**
 * Gets all the player details from the database.
 * 
 * @returns the details of all the players who has an account
 */
export async function getAllPlayers(): Promise<Players[]> {
  const allPlayerDetails = await databaseController.fetchAllPlayers();
  return allPlayerDetails;
}

/**
 * Updates the database to reflect the friend request status.
 * 
 * @param fromPlayerName the userName of the Player sending the friend request
 * @param toPlayerName the userName of the Player receiving the friend request
 * @returns true if the friend request is successful. False otherwise
 */
export async function sendFriendRequest(fromPlayerName: string, toPlayerName: string): Promise<boolean> {
  const fromPlayer = await databaseController.findPlayerByUserName(fromPlayerName);
  const toPlayer = await databaseController.findPlayerByUserName(toPlayerName);
  if (fromPlayerName === toPlayerName || fromPlayer === null || toPlayer === null) {
    return false;
  }
  const friendRequest = databaseController.addFriendRequest({
    id: '1',
    sendingPlayerName: fromPlayerName,
    receivingPlayerName: toPlayerName,
    status: FriendRequestStatus.pending,
  });
  return friendRequest !== null;
}

/**
 * Updates the database to reflect the acceptance of the friend request.
 * 
 * @param fromPlayerName the userName of the Player sending the friend request
 * @param toPlayerName the userName of the Player receiving the friend request
 * @returns true if the friend request status update is successful.
 */
export async function acceptFriendRequest(fromPlayerName: string, toPlayerName: string): Promise<boolean> {
  const fromPlayer = await databaseController.findPlayerByUserName(fromPlayerName);
  const toPlayer = await databaseController.findPlayerByUserName(toPlayerName);
  if (fromPlayerName === toPlayerName || fromPlayer === null || toPlayer === null) {
    return false;
  }
  const friendRequestObject = await databaseController.getFriendRequest(
    fromPlayerName,
    toPlayerName,
  );
  if (friendRequestObject !== null) {
    await Promise.all([
      databaseController.updateFriendRequestStatus(friendRequestObject, FriendRequestStatus.accepted),
      databaseController.addFriend(fromPlayer, toPlayer.id),
      databaseController.addFriend(toPlayer, fromPlayer.id),
    ],
    );
    return true;
  } 
  return false;
}

/**
 * Updates the database to reflect the of the friend request rejection.
 * 
 * @param fromPlayerName the userName of the Player sending the friend request
 * @param toPlayerName the userName of the Player receiving the friend request
 * @returns true if the friend request status update is successful.
 */
export async function rejectFriendRequest(fromPlayerName: string, toPlayerName: string): Promise<boolean> {
  const fromPlayer = await databaseController.findPlayerByUserName(fromPlayerName);
  const toPlayer = await databaseController.findPlayerByUserName(toPlayerName);
  if (fromPlayerName === toPlayerName || fromPlayer === null || toPlayer === null) {
    return false;
  }
  const friendRequestObject = await databaseController.getFriendRequest(
    fromPlayerName,
    toPlayerName,
  );
  if (friendRequestObject !== null) {
    await databaseController.updateFriendRequestStatus(friendRequestObject, FriendRequestStatus.rejected);
    return true;
  } 
  return false;
}