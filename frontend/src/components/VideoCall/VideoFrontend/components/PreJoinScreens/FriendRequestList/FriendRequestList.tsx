import { Box, Heading, Flex, Button } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import FriendsApi, { FriendRequests } from '../../../../../../classes/FriendServiceClient';

export default function FriendRequestList(props: { playerName: string }) {
  const [sentFriendRequest, setSentFriendRequest] = useState<FriendRequests[]>([]);
  const [receivedFriendRequest, setReceivedFriendRequest] = useState<FriendRequests[]>([]);
  const friendApi = new FriendsApi();

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

  useEffect(() => {
    async function updateFriendRequests() {
      const sentFriendRequest = await friendApi.sentFriendRequests({
        fromPlayerName: props.playerName,
      });
      const receivedFriendRequest = await friendApi.receivedFriendRequests({
        toPlayerName: props.playerName,
      });
      setSentFriendRequest(sentFriendRequest);
      setReceivedFriendRequest(receivedFriendRequest);
    }
    updateFriendRequests();
  }, []);

  return (
    <Box borderWidth='1px' borderRadius='lg'>
      <Heading as='h2' size='lg'>
        Friend Requests
      </Heading>
      <Box maxH='500px' overflowY='scroll' borderWidth='1px' borderRadius='lg'>
        <Heading as='h4' size='sm'>
          Received Requests
        </Heading>
        {receivedFriendRequest.map(request => {
          return (
            <Flex alignItems='center' justifyContent='space-between' height={12}>
              <span> {request.sendingPlayerName}</span>
              <Button onClick={() => acceptFriendRequest(request.sendingPlayerName)}>
                Accept Request
              </Button>
            </Flex>
          );
        })}
      </Box>
      <Box maxH='500px' overflowY='scroll' borderWidth='1px' borderRadius='lg'>
        <Heading as='h4' size='sm'>
          Sent Requests
        </Heading>
        {sentFriendRequest.map(request => {
          return (
            <Flex alignItems='center' justifyContent='space-between' height={12}>
              <span> {request.receivingPlayerName}</span>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
}
