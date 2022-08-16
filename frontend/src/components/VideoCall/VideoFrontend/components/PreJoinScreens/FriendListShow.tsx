import { Box, FormControl, FormLabel, Heading, Input, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, {useState, useEffect } from 'react';

export default function FriendListShow(props:{playerName: string})  {
  
  const [friendList, setFriendList] = useState([]);

  useEffect(()=>{
    async function getFriendList() {
      const res = await fetch(`http://localhost:8081/friends/${props.playerName}`);
      const data = await res.json();
      setFriendList(data);
    }
    getFriendList();
  }, [])

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
                <Td role='cell'>{eachFriend}</Td>
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