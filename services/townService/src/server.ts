import Express from 'express';
import * as http from 'http';
import CORS from 'cors';
import { AddressInfo } from 'net';
import addTownRoutes from './router/towns';
import CoveyTownsStore from './lib/CoveyTownsStore';
import { PrismaClient } from '@prisma/client';
import { FriendRequest, Player } from './types/SampleTypes';



const app = Express();
app.use(CORS());
const server = http.createServer(app);

const prisma = new PrismaClient();

//insert a new player
async function insertPlayer(player: Player) {
  const players = await prisma.players.create({
    data: {
      playerName: player.userName,
      friendIds: player.friendIds,
      sentFriendRequests: JSON.stringify(player.sentFriendRequests),
      receivedFriendRequests: JSON.stringify(player.receivedFriendRequests),
    },
    }
  );
}

//find a player by id
async function findPlayerById(id: string): Promise<any> {
  const player = await prisma.players.findUnique({
    where: {
      id: id,
    },
    }
  );
  return player;
 }
 
 //find a player by userName
 async function findPlayerByUserName(userName: string): Promise<any> {
  const players = await prisma.players.findMany({
    where: {
      playerName: userName,
    },
    }
  );
  return players[0];
 }

 // add to the list of friend Ids
 async function addFriendIds(player: Player, newFriend: string) {
  const addFriendIds = await prisma.players.update({
    where: {
      id: player.id,
    },
    data: {
      friendIds: {
        push: newFriend,
      },
    },
  })
 }

// add to the list of sent Friend requests
async function addSentFriendRequests(player: Player, newSentRequest: FriendRequest ) {
  const addSentFriendReuqests = await prisma.players.update({
    where: {
      id: player.id,
    },
    data: {
      sentFriendRequests: JSON.stringify(player.sentFriendRequests.push(newSentRequest)), 
      },
    })
}

//add to the list of Received Friend requests
async function addReceivedFriendRequests(player: Player, newReceivedRequest: FriendRequest ) {
  const addReceivedFriendReuqests = await prisma.players.update({
    where: {
      id: player.id,
    },
    data: {
      receivedFriendRequests: JSON.stringify(player.receivedFriendRequests.push(newReceivedRequest)), 
      },
    })
}

//remove from list of sent Friend requests
async function removeSentFriendRequests(player: Player, removeSentRequest: FriendRequest ) {
  const removeSentFriendReuqests = await prisma.players.update({
    where: {
      id: player.id,
    },
    data: {
      sentFriendRequests: JSON.stringify(player.sentFriendRequests.filter((request)=>{request !== removeSentRequest})), 
      },
    })
}

//remove from list of Received Friend requests
async function removeReceivedFriendRequests(player: Player, removeReceivedRequest: FriendRequest ) {
  const removeReceivedFriendReuqests = await prisma.players.update({
    where: {
      id: player.id,
    },
    data: {
      receivedFriendRequests: JSON.stringify(player.receivedFriendRequests.filter((request)=>{request !== removeReceivedRequest})), 
      },
    })
}

// insertPlayer();
addTownRoutes(server, app);

server.listen(process.env.PORT || 8081, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${address.port}`);
  if (process.env.DEMO_TOWN_ID) {
    CoveyTownsStore.getInstance().createTown(process.env.DEMO_TOWN_ID, false);
  }
});
