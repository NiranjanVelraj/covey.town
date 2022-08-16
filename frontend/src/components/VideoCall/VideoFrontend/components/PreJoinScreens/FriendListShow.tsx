import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import FriendsApi, { Players } from '../../../../../classes/FriendServiceClient';

export default function FriendListShow(props: { playerName: string }) {
  const [friendList, setFriendList] = useState<Players[]>([]);

  useEffect(() => {
    async function getFriendList() {
      const friendApi = new FriendsApi();
      const friendDetails = await friendApi.friends({ userName: props.playerName });
      setFriendList(friendDetails);
    }
    getFriendList();
  }, []);

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
              <Th>Details</Th>
            </Tr>
          </Thead>
          <Tbody>
            {friendList.map((eachFriend, index) => (
              <Tr key={index}>
                <Td role='cell'>{eachFriend.playerName}</Td>
                <Td role='cell'></Td>
                <Td role='cell'></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
