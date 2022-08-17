import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { TownJoinResponse } from '../../../../../classes/TownsServiceClient';
import { Heading, Text } from '@chakra-ui/react';
import TownSelection from '../../../../Login/TownSelection';
import FriendList from './FriendList/FriendList';
import FindFriends from './FindFriends/FindFriends';
import FriendRequestList from './FriendRequestList/FriendRequestList';
import FriendsApi, { FriendRequests, Players } from '../../../../../classes/FriendServiceClient';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens(props: {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>;
  userName: string;
}) {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();

  const [mediaError, setMediaError] = useState<Error>();

  const [allPlayers, setAllPlayers] = useState<Players[]>([]);
  const [friends, setFriends] = useState<Players[]>([]);
  const [sentFriendRequest, setSentFriendRequest] = useState<FriendRequests[]>([]);
  const [receivedFriendRequest, setReceivedFriendRequest] = useState<FriendRequests[]>([]);
  const friendApi = new FriendsApi();

  /**
   * Read all details from the api and update the corresponding properties.
   */
  useEffect(() => {
    async function syncWithServer() {
      async function updateAllPlayerDetails() {
        const allPlayersDetails = await friendApi.allPlayers();
        setAllPlayers(allPlayersDetails);
      }
      async function updateFriends() {
        const friends = await friendApi.friends({ userName: props.userName });
        setFriends(friends);
      }
      async function updateSentRequests() {
        const sentFriendRequest = await friendApi.sentFriendRequests({
          fromPlayerName: props.userName,
        });
        setSentFriendRequest(sentFriendRequest);
      }
      async function updateReceivedRequests() {
        const receivedFriendRequest = await friendApi.receivedFriendRequests({
          toPlayerName: props.userName,
        });
        setReceivedFriendRequest(receivedFriendRequest);
      }
      await Promise.all([
        updateAllPlayerDetails(),
        updateFriends(),
        updateSentRequests(),
        updateReceivedRequests(),
      ]);
    }
    syncWithServer();
    const timer = setInterval(syncWithServer, 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  /**
   * Sends a friend request to the specified player.
   * @param toPlayerName the player to whom the request is sent
   */
  const sendFriendRequest = async (toPlayerName: string) => {
    await friendApi.sendFriendRequest({
      fromPlayerName: props.userName,
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
      toPlayerName: props.userName,
    });
  };

  /**
   * Accepts a friend request to the specified player.
   * @param fromPlayerName the player to whom the request is sent
   */
  const rejectFreindRequest = async (fromPlayerName: string) => {
    await friendApi.rejectFreindRequest({
      fromPlayerName,
      toPlayerName: props.userName,
    });
  };

  useEffect(() => {
    if (!mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      <Heading as='h2' size='xl'>
        Welcome to Covey.Town! {props.userName}
      </Heading>
      <Text p='4'>
        Covey.Town is a social platform that integrates a 2D game-like metaphor with video chat. To
        get started, setup your camera and microphone, choose a username, and then create a new town
        to hang out in, or join an existing one.
      </Text>
      <DeviceSelectionScreen />
      <FriendList
        playerName={props.userName}
        allPlayers={allPlayers}
        friends={friends}
        receivedFriendRequests={receivedFriendRequest}
        sentFriendRequests={sentFriendRequest}
        sendFriendRequest={sendFriendRequest}
        acceptFriendRequest={acceptFriendRequest}
      />
      <TownSelection doLogin={props.doLogin} userName={props.userName} friendList={friends} />
      <FriendRequestList
        sentFriendRequests={sentFriendRequest}
        receivedFriendRequests={receivedFriendRequest}
        acceptFriendRequest={acceptFriendRequest}
        rejectFriendRequest={rejectFreindRequest}
      />
    </IntroContainer>
  );
}
