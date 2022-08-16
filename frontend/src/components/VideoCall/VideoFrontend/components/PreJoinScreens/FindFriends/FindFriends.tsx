import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';
import FriendsApi, { FriendRequests, Players } from '../../../../../../classes/FriendServiceClient';

export default function FindFriends(props: { playerName: string }) {
  const [findPlayerName, setFindPlayerName] = useState<string>('');
  const friendApi = new FriendsApi();

  enum PlayerStatus {
    none,
    self,
    friend,
    sentRequest,
    receivedRequest,
  }
  type PlayerDisplayDetails = {
    playerName: string;
    status: PlayerStatus;
  };

  const [allPlayers, setAllPlayers] = useState<PlayerDisplayDetails[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerDisplayDetails[]>([]);

  /**
   * Sends a friend request to the specified player.
   * @param toPlayerName the player to whom the request is sent
   */
  const sendFriendRequest = async (toPlayerName: string) => {
    await friendApi.sendFriendRequest({
      fromPlayerName: props.playerName,
      toPlayerName,
    });
  };

  /**
   * Accepts a friend request to the specified player.
   * @param fromPlayerName the player to whom the request is sent
   */
  const acceptFriendRequest = async (fromPlayerName: string) => {
    await friendApi.acceptFreindRequest({
      fromPlayerName,
      toPlayerName: props.playerName,
    });
  };

  /**
   * @returns true if there is a friend request sent to the player.
   */
  const sentRequest = function (toPlayerName: string, sentRequests: FriendRequests[]): boolean {
    return sentRequests.some(request => request.receivingPlayerName === toPlayerName);
  };

  /**
   * @returns true if there is a friend request received by the specified player.
   */
  const receivedRequest = function (
    fromPlayerName: string,
    receivedRequests: FriendRequests[],
  ): boolean {
    return receivedRequests.some(request => request.sendingPlayerName === fromPlayerName);
  };

  /**
   * Fetches the list of players from the database and updates the state.
   */
  useEffect(() => {
    const updatePlayerList = async () => {
      const allPlayersDetails = await friendApi.allPlayers();
      const sentRequests = await friendApi.sentFriendRequests({ fromPlayerName: props.playerName });
      const receivedRequests = await friendApi.receivedFriendRequests({
        toPlayerName: props.playerName,
      });
      const playerStatus = allPlayersDetails.map(player => {
        let playerStatus = PlayerStatus.none;
        if (player.playerName === props.playerName) {
          playerStatus = PlayerStatus.self;
        } else if (sentRequest(player.playerName, sentRequests)) {
          playerStatus = PlayerStatus.sentRequest;
        } else if (receivedRequest(player.playerName, receivedRequests)) {
          playerStatus = PlayerStatus.receivedRequest;
        }
        return {
          playerName: player.playerName,
          status: playerStatus,
        } as PlayerDisplayDetails;
      });

      setAllPlayers(playerStatus);
    };
    updatePlayerList();
    const timer = setInterval(updatePlayerList, 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  /**
   * Filters the players to display only the Players searched ignoring the friends.
   */
  useEffect(() => {
    const filteredStatus = allPlayers.filter(
      player => player.status !== PlayerStatus.self && player.status !== PlayerStatus.friend,
    );
    if (findPlayerName === '') {
      setFilteredPlayers(filteredStatus);
    } else {
      setFilteredPlayers(
        filteredStatus.filter(player =>
          player.playerName.toLowerCase().includes(findPlayerName.toLowerCase()),
        ),
      );
    }
  }, [allPlayers, findPlayerName]);

  return (
    <Box p='4' borderWidth='1px' borderRadius='lg'>
      <Heading as='h2' size='lg'>
        Find other Players
      </Heading>

      <FormControl>
        <FormLabel htmlFor='playerName'>Player Name: </FormLabel>
        <Input
          autoFocus
          name='playerName'
          placeholder='Find player'
          value={findPlayerName}
          onChange={event => setFindPlayerName(event.target.value)}
        />
        <Flex flexDirection='column'>
          {filteredPlayers.map(player => {
            return (
              <Flex alignItems='center' justifyContent='space-between' height={12}>
                <span> {player.playerName}</span>
                {player.status === PlayerStatus.none && (
                  <Button onClick={() => sendFriendRequest(player.playerName)}>Send Request</Button>
                )}
                {player.status === PlayerStatus.sentRequest && <span>Request sent</span>}
                {player.status === PlayerStatus.receivedRequest && (
                  <Button onClick={() => acceptFriendRequest(player.playerName)}>
                    Accept Request
                  </Button>
                )}
              </Flex>
            );
          })}
        </Flex>
      </FormControl>
    </Box>
  );
}
