import { Box, Heading, Flex, Button } from '@chakra-ui/react';
import { FriendRequests } from '../../../../../../classes/FriendServiceClient';

export default function FriendRequestList(props: {
  sentFriendRequests: FriendRequests[];
  receivedFriendRequests: FriendRequests[];
  acceptFriendRequest: (fromPlayerName: string) => void;
}) {
  return (
    <Box borderWidth='1px' borderRadius='lg'>
      <Heading as='h2' size='lg'>
        Friend Requests
      </Heading>
      <Box maxH='500px' overflowY='scroll' borderWidth='1px' borderRadius='lg'>
        <Heading as='h4' size='sm'>
          Received Requests
        </Heading>
        {props.receivedFriendRequests.map(request => {
          return (
            <Flex alignItems='center' justifyContent='space-between' height={12} key={request.id}>
              <span> {request.sendingPlayerName}</span>
              <Button onClick={() => props.acceptFriendRequest(request.sendingPlayerName)}>
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
        {props.sentFriendRequests.map(request => {
          return (
            <Flex alignItems='center' justifyContent='space-between' height={12} key={request.id}>
              <span> {request.receivingPlayerName}</span>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
}
