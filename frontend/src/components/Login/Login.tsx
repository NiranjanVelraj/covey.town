import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { TownJoinResponse } from '../../classes/TownsServiceClient';
import PreJoinScreens from '../VideoCall/VideoFrontend/components/PreJoinScreens/PreJoinScreens';
import FriendsApi from '../../classes/FriendServiceClient';

interface LoginProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>;
}

export default function Login({ doLogin }: LoginProps): JSX.Element {
  const [userName, setUserName] = useState<string>('');
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [showLoginMsg, setShowLoginMsg] = useState<boolean>(false);
  const [showSignupMsg, setShowSignupMsg] = useState<boolean>(false);

  /**
   * Logs in the user. If user details not present in the database, shows an error message.
   */
  async function handleLogin() {
    const friendApi = new FriendsApi();
    const success = await friendApi.loginUser({ userName });
    if (success.playerName === userName) {
      setUserLoggedIn(true);
    } else {
      setShowLoginMsg(true);
    }
  }

  /**
   * Signup  the user. If user details already present in the database, shows an error message.
   */
  async function handleSignup() {
    const friendApi = new FriendsApi();
    const success = await friendApi.signupUser({ userName });
    if (success.playerName === userName) {
      setUserLoggedIn(true);
    } else {
      setShowSignupMsg(true);
    }
  }

  return (
    <>
      {!userLoggedIn ? (
        <Flex height='100vh' justifyContent='center' alignItems='center' flexDirection='column'>
          <Box p='4' borderWidth='1px' borderRadius='lg' display='flex' flexDirection='column'>
            <FormControl>
              <FormLabel htmlFor='name'>Enter your User Name</FormLabel>
              <Input
                autoFocus
                name='name'
                placeholder='Your name'
                value={userName}
                onChange={event => {
                  setUserName(event.target.value);
                  setShowLoginMsg(false);
                  setShowSignupMsg(false);
                }}
              />
            </FormControl>
            <Flex justifyContent='space-between' marginTop='5'>
              <Button
                colorScheme='teal'
                variant='solid'
                disabled={userName === ''}
                onClick={() => handleLogin()}>
                Login
              </Button>

              <Button
                colorScheme='teal'
                variant='outline'
                disabled={userName === ''}
                onClick={() => handleSignup()}>
                Signup
              </Button>
            </Flex>
          </Box>
          <Flex width='600px'>
            {showLoginMsg && (
              <Alert status='warning'>
                <AlertIcon />
                User does not exist. Please sign up instead.
              </Alert>
            )}
            {showSignupMsg && (
              <Alert status='warning'>
                <AlertIcon />
                User details already exists. Cannot create a player with same user name.
              </Alert>
            )}
          </Flex>
        </Flex>
      ) : (
        <PreJoinScreens doLogin={doLogin} userName={userName} />
      )}
    </>
  );
}
