import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { FriendRequests, Players } from '../../../../../../classes/FriendServiceClient';
import FindFriends from '../FindFriends/FindFriends';

export default function FriendList(props: {
  playerName: string;
  allPlayers: Players[];
  friends: Players[];
  sentFriendRequests: FriendRequests[];
  receivedFriendRequests: FriendRequests[];
  sendFriendRequest: (fromPlayerName: string) => void;
  acceptFriendRequest: (fromPlayerName: string) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box borderWidth='1px' p='4' borderRadius='lg' marginBottom={5}>
      <Flex justifyContent='space-between'>
        <Heading as='h2' size='lg'>
          Your Friends
        </Heading>
        <Button onClick={onOpen} colorScheme='gray' variant='solid'>
          {' '}
          Add Friends
        </Button>
      </Flex>
      <Box maxH='250px' overflowY='auto'>
        <Table>
          <Thead>
            <Tr>
              <Th>Player Name</Th>
              <Th>Current Town ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.friends.map((eachFriend, index) => (
              <Tr key={index}>
                <Td role='cell'>{eachFriend.playerName}</Td>
                <Td role='cell'>
                  {eachFriend.currentTownId === '' ? (
                    <Text color='red'>Offline</Text>
                  ) : (
                    <Text color='green'>{eachFriend.currentTownId}</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find Other Players</ModalHeader>
          <ModalBody>
            <FindFriends
              playerName={props.playerName}
              allPlayers={props.allPlayers}
              friends={props.friends}
              receivedFriendRequests={props.receivedFriendRequests}
              sentFriendRequests={props.sentFriendRequests}
              sendFriendRequest={props.sendFriendRequest}
              acceptFriendRequest={props.acceptFriendRequest}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
