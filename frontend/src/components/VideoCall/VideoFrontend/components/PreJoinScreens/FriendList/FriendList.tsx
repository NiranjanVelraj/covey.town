import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Players } from '../../../../../../classes/FriendServiceClient';

export default function FriendList(props: { friendList: Players[] }) {
  return (
    <>
      <Heading as='h2' size='lg'>
        You have the following friends
      </Heading>
      <Box maxH='500px' overflowY='scroll'>
        <Table>
          <Thead>
            <Tr>
              <Th>Friend Name</Th>
              <Th>Town ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.friendList.map((eachFriend, index) => (
              <Tr key={index}>
                <Td role='cell'>{eachFriend.playerName}</Td>
                <Td role='cell'>{eachFriend.currentTownId}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
