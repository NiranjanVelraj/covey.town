import express, { Express } from 'express';
import io from 'socket.io';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import { logError } from '../Utils';
import * as databaseController from '../requestHandlers/DatabaseRequestHandlers';

export default function addFriendRoutes(http: Server, app: Express): io.Server {
  /**
   * List all Players.
   */
  app.get('/players', express.json(), async (_req, res) => {
    try {
      const result = await databaseController.getAllPlayers();
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /**
   * Fetches the player details from the database.
   */
  app.post('/login/:playerName', express.json(), async (_req, res) => {
    try {
      const result = await databaseController.loginUser(_req.params.playerName);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /**
   * Fetches the friends lists from the database.
   */
  app.get('/friends/:playerName', express.json(), async (_req, res) => {
    try {
      const result = await databaseController.getFriendLists(_req.params.playerName);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });


 

  /**
   * Sign up the player and returns the details of the user.
   */
  app.post('/signup/:playerName', express.json(), async (_req, res) => {
    try {
      const result = await databaseController.signupUser(_req.params.playerName);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });


  /**
   * Create a new friend request.
   */
  app.post('/friends/friendRequest', express.json(), async (req, res) => {
    try {
      const result = await databaseController.sendFriendRequest(req.body.fromPlayerName, req.body.toPlayerName);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /**
   * Accept the friend request.
   */
  app.put('/friends/friendRequest/accept', express.json(), async (req, res) => {
    try {
      const result = await databaseController.acceptFriendRequest(req.body.fromPlayerName, req.body.toPlayerName);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /**
   * Reject the friend request.
   */
  app.put('/friends/friendRequest/reject', express.json(), async (req, res) => {
    try {
      const result = await databaseController.rejectFriendRequest(req.body.fromPlayerName, req.body.toPlayerName);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /**
   * Get list of sent friend requests by the player.
   */
  app.get('/friendRequest/sent/:fromPlayerName', express.json(), async (req, res) => {
    try {
      const result = await databaseController.getSentFriendRequests(req.params.fromPlayerName);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /**
   * Get list of received friend requests by the player.
   */
  app.get('/friendRequest/received/:toPlayerName', express.json(), async (req, res) => {
    try {
      const result = await databaseController.getReceivedFriendRequests(req.params.toPlayerName);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /**
   * Update the town of the player.
   */
  app.put('/player/town', express.json(), async (req, res) => {
    try {
      const result = await databaseController.updateTownDetailsOfPlayer(req.body.playerName, req.body.townId);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  const socketServer = new io.Server(http, { cors: { origin: '*' } });
  return socketServer;
}