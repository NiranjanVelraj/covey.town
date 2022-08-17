import { Box, Heading, Flex, Button, Text } from '@chakra-ui/react';
import { FriendRequests } from '../../../../../../classes/FriendServiceClient';

export default function FriendRequestList(props: {
  sentFriendRequests: FriendRequests[];
  receivedFriendRequests: FriendRequests[];
  acceptFriendRequest: (fromPlayerName: string) => void;
  rejectFriendRequest: (fromPlayerName: string) => void;
}) {
  return (
    <Box borderWidth='1px' borderRadius='lg' marginBottom={5} marginTop={10}>
      <Heading as='h2' size='lg' p='4'>
        Pending Friend Requests
      </Heading>
      <Flex justifyContent='space-between'>
        <Box maxH='200px' overflowY='auto' borderWidth='1px' width='60%' p='2'>
          <Heading as='h4' size='sm'>
            Received Requests
          </Heading>
          {props.receivedFriendRequests.length === 0 ? (
            <Text>-</Text>
          ) : (
            props.receivedFriendRequests.map(request => {
              return (
                <Flex
                  alignItems='center'
                  justifyContent='space-between'
                  height={12}
                  key={request.id}>
                  <Text> {request.sendingPlayerName}</Text>
                  <Flex width='60%' justifyContent='space-between'>
                    <Button
                      colorScheme='green'
                      onClick={() => props.acceptFriendRequest(request.sendingPlayerName)}>
                      Accept
                    </Button>
                    <Button
                      colorScheme='red'
                      onClick={() => props.rejectFriendRequest(request.sendingPlayerName)}>
                      Reject
                    </Button>
                  </Flex>
                </Flex>
              );
            })
          )}
        </Box>
        <Box h='200px' overflowY='auto' borderWidth='1px' width='35%' p='2'>
          <Heading as='h4' size='sm'>
            Requests Sent to
          </Heading>
          {props.sentFriendRequests.length === 0 ? (
            <Text>-</Text>
          ) : (
            props.sentFriendRequests.map(request => {
              return (
                <Flex
                  alignItems='center'
                  justifyContent='space-between'
                  height={12}
                  key={request.id}>
                  <Text> {request.receivingPlayerName}</Text>
                </Flex>
              );
            })
          )}
        </Box>
      </Flex>
    </Box>
  );
}
