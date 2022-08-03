import { PrismaClient, Players, FriendRequests } from '@prisma/client';
import { FriendRequestStatus } from '../Utils';

const prisma = new PrismaClient();

/**
 * Get all players from the database.
 * 
 * @returns all the player details from the databasea
 */
export async function fetchAllPlayers(): Promise<Players[]> {
  const allPlayers = await prisma.players.findMany();
  return allPlayers;
}

/**
 * Insert a new player to the databse.
 * 
 * @param player the player object to insert
 * @returns the inserted player as a promise object
 */
export async function insertPlayer(player: Players): Promise<Players> {
  const newPlayer = await prisma.players.create({
    data: {
      playerName: player.playerName,
      friendIds: player.friendIds,
    },
  },
  );
  return newPlayer;
}

/**
 * Delete a player the databse.
 * 
 * @param id the player id to delete the details
 * @returns the deleted player as a promise object
 */
export async function deletePlayer(id: string): Promise<Players> {
  const deletedPlayer = await prisma.players.delete({
    where: {
      id,
    },
  },
  );
  return deletedPlayer;
}

/**
 * Finds the player from the database based on the id.
 * 
 * @param id the id of the player to find
 * @returns the Player from the database or null if not found
 */
export async function findPlayerById(id: string): Promise<Players | null> {
  const foundPlayer = await prisma.players.findUnique({
    where: {
      id,
    },
  },
  );
  return foundPlayer;
}
 
/**
 * Finds the player from the database based on the player name.
 * 
 * @param playerName the playerName of the player to find
 * @returns the Player from the database or null if not found
 */
export async function findPlayerByUserName(playerName: string): Promise<Players | null> {
  const foundPlayer = await prisma.players.findFirst({
    where: {
      playerName,
    },
  },
  );
  return foundPlayer;
}

/**
 * Adds a new friend to the Player.
 * 
 * @param player the player whose friend has to be added
 * @param newFriendId the id of the new friend
 * @returns the updated player details or null if player not found
 */
export async function addFriend(player: Players, newFriendId: string): Promise <Players | null> {
  const updatedPlayer = await prisma.players.update({
    where: {
      id: player.id,
    },
    data: {
      friendIds: {
        push: newFriendId,
      },
    },
  });
  return updatedPlayer;
}

/**
 * Creates a new Friend Request object.
 * 
 * @param newRequest the friend request to be added
 * @returns the friend request details or null if addition failed
 */
export async function addFriendRequest(newRequest: FriendRequests ): Promise <FriendRequests | null> {
  const newFriendRequest = await prisma.friendRequests.create({
    data: {
      sendingPlayerName: newRequest.sendingPlayerName,
      receivingPlayerName: newRequest.receivingPlayerName,
      status: FriendRequestStatus.pending,
    },
  });
  return newFriendRequest;
}

/**
 * Gets the friend request object from the database.
 * 
 * @param fromPlayer the player sending the friend request
 * @param toPlayer the player receiving the friend request
 * @returns the friend request details
 */
export async function getFriendRequest(fromPlayer: string, toPlayer: string ): Promise <FriendRequests | null> {
  const friendRequest = await prisma.friendRequests.findFirst({
    where: {
      sendingPlayerName: fromPlayer,
      receivingPlayerName: toPlayer,
    },
  });
  return friendRequest;
}

/**
 * Deletes an entry form the friend request table.
 * 
 * @param friendRequest the friend request to be removed
 * @returns the removed friend request details or null if not found
 */
export async function removeFriendRequest(friendRequest: FriendRequests ): Promise <FriendRequests | null> {
  const deletedRequest = await prisma.friendRequests.delete({
    where: {
      id: friendRequest.id,
    },
  });
  return deletedRequest;
}

/**
 * Updates the status of the friend request.
 * 
 * @param friendRequest the friend request to be updated
 * @param status the status of the request to be updated
 * @returns the updated friend request details
 */
export async function updateFriendRequestStatus(friendRequest: FriendRequests, status: string ): Promise <FriendRequests | null> {
  const updatedRequest = await prisma.friendRequests.update({
    where: {
      id: friendRequest.id,
    },
    data: {
      status,
    },
  });
  return updatedRequest;
}

/**
 * Fetches the Friend Request details of the players who had sent it and the status.
 * 
 * @param playerName the player whose sent friend requests has to be fetched
 * @param status the status of the friend request to be fetched
 * @returns the list of friend requests or null otherwise
 */
export async function getSentFriendRequestsStatus(playerName: string, status: string ): Promise <FriendRequests[] | null> {
  const sentFriendRequests = await prisma.friendRequests.findMany({
    where: {
      sendingPlayerName: playerName,
      status,
    },
  });
  return sentFriendRequests;
}

/**
 * Fetches the Friend Request details of the players who had received it and the status.
 * 
 * @param playerName the player whose sent friend requests has to be fetched
 * @param status the status of the friend request to be fetched
 * @returns the list of friend requests or null otherwise
 */
export async function getReceivedFriendRequestsStatus(playerName: string, status: string ): Promise <FriendRequests[] | null> {
  const sentFriendRequests = await prisma.friendRequests.findMany({
    where: {
      receivingPlayerName: playerName,
      status,
    },
  });
  return sentFriendRequests;
}

