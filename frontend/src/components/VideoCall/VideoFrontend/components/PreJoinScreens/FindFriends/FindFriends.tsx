import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, FormControl, Input, Text } from '@chakra-ui/react';
import FriendsApi, { FriendRequests, Players } from '../../../../../../classes/FriendServiceClient';

export default function FindFriends(props: {
  playerName: string;
  allPlayers: Players[];
  friends: Players[];
  sentFriendRequests: FriendRequests[];
  receivedFriendRequests: FriendRequests[];
  sendFriendRequest: (fromPlayerName: string) => void;
  acceptFriendRequest: (fromPlayerName: string) => void;
}) {
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

  const [allPlayerDetails, setAllPlayerDetails] = useState<PlayerDisplayDetails[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerDisplayDetails[]>([]);
  const [findPlayerName, setFindPlayerName] = useState<string>('');

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
   * @returns true if the playerName is present in the friend list of the player.
   */
  const isFriend = function (playerName: string, friends: Players[]): boolean {
    return friends.some(friendDetails => friendDetails.playerName === playerName);
  };

  /**
   * Fetches the list of players from the database and updates the state.
   */
  useEffect(() => {
    const playerStatus = props.allPlayers.map(player => {
      let playerStatus = PlayerStatus.none;
      if (player.playerName === props.playerName) {
        playerStatus = PlayerStatus.self;
      } else if (isFriend(player.playerName, props.friends)) {
        playerStatus = PlayerStatus.friend;
      } else if (sentRequest(player.playerName, props.sentFriendRequests)) {
        playerStatus = PlayerStatus.sentRequest;
      } else if (receivedRequest(player.playerName, props.receivedFriendRequests)) {
        playerStatus = PlayerStatus.receivedRequest;
      }
      return {
        playerName: player.playerName,
        status: playerStatus,
      } as PlayerDisplayDetails;
    });
    setAllPlayerDetails(playerStatus);
  }, [props.allPlayers, props.friends, props.receivedFriendRequests, props.sentFriendRequests]);

  /**
   * Filters the players to display only the Players searched ignoring the friends.
   */
  useEffect(() => {
    const filteredStatus = allPlayerDetails.filter(
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
  }, [allPlayerDetails, findPlayerName]);

  return (
    <Box p='4' borderWidth='1px' borderRadius='lg'>
      <FormControl>
        <Input
          autoFocus
          name='playerName'
          placeholder='Search Player'
          value={findPlayerName}
          onChange={event => setFindPlayerName(event.target.value)}
        />
        <Box h='250px' overflowY='auto' p='2'>
          <Flex flexDirection='column'>
            {filteredPlayers.map(player => {
              return (
                <Flex
                  alignItems='center'
                  justifyContent='space-between'
                  height={12}
                  key={player.playerName}>
                  <Text> {player.playerName}</Text>
                  <Flex alignItems='center' justifyContent='center' width='40%'>
                    {player.status === PlayerStatus.none && (
                      <Button
                        colorScheme='teal'
                        variant='outline'
                        onClick={() => props.sendFriendRequest(player.playerName)}>
                        Send Request
                      </Button>
                    )}
                    {player.status === PlayerStatus.sentRequest && (
                      <Text color='teal.500'>Request sent</Text>
                    )}
                    {player.status === PlayerStatus.receivedRequest && (
                      <Button
                        colorScheme='blue'
                        onClick={() => props.acceptFriendRequest(player.playerName)}>
                        Accept Request
                      </Button>
                    )}
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        </Box>
      </FormControl>
    </Box>
  );
}
