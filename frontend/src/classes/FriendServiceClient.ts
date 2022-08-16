import axios, { AxiosInstance, AxiosResponse } from 'axios';
import assert from 'assert';

/**
 * Envelope that wraps any response from the server
 */
export interface DatabaseResponseEnvelope<T> {
  databaseError: boolean;
  isOK: boolean;
  message?: string;
  response?: T;
}

/**
 * Model Players
 */
export type Players = {
  id: string;
  playerName: string;
  friendIds: string[];
};

/**
 * Model FriendRequests
 *
 */
export type FriendRequests = {
  id: string;
  sendingPlayerName: string;
  receivingPlayerName: string;
  status: string;
};

export type UserCheckDetails = {
  userName: string;
};

export type FriendDetailInfo = {
  fromPlayerName: string;
  toPlayerName: string;
};

export type SentFriendRequestInfo = {
  fromPlayerName: string;
};

export type ReceivedFriendRequestInfo = {
  toPlayerName: string;
};

export default class FriendServiceClient {
  private _axios: AxiosInstance;

  /**
   * Construct a new Friend Service API client. Specify a serviceURL for testing, or otherwise
   * defaults to the URL at the environmental variable REACT_APP_TOWNS_SERVICE_URL
   * @param serviceURL
   */
  constructor(serviceURL?: string) {
    const baseURL = serviceURL || process.env.REACT_APP_TOWNS_SERVICE_URL;
    assert(baseURL);
    this._axios = axios.create({ baseURL });
  }

  static unwrapOrThrowError<T>(
    response: AxiosResponse<DatabaseResponseEnvelope<T>>,
    ignoreResponse = false,
  ): T {
    if (!response.data.databaseError) {
      if (ignoreResponse) {
        return {} as T;
      }
      if (response.data.isOK) {
        assert(response.data.response);
        return response.data.response;
      }
      return {} as T;
    }
    throw new Error(`Error processing request: ${response.data.message}`);
  }

  /**
   *
   * @returns list of all players registered with Covey town present in the databse
   */
  async allPlayers(): Promise<Players[]> {
    const responseWrapper = await this._axios.get<DatabaseResponseEnvelope<Players[]>>('/players');
    return FriendServiceClient.unwrapOrThrowError(responseWrapper);
  }

  /**
   * Logs in the user. Returns the user details if already present.
   */
  async loginUser(requestData: UserCheckDetails): Promise<Players> {
    const responseWrapper = await this._axios.post<DatabaseResponseEnvelope<Players>>(
      `/login/${requestData.userName}`,
    );
    return FriendServiceClient.unwrapOrThrowError(responseWrapper);
  }

  /**
   * Signs up the user. Returns the new user details if not present. If present, returns undefined response.
   */
  async signupUser(requestData: UserCheckDetails): Promise<Players> {
    const responseWrapper = await this._axios.post<DatabaseResponseEnvelope<Players>>(
      `/signup/${requestData.userName}`,
    );
    return FriendServiceClient.unwrapOrThrowError(responseWrapper);
  }

  /**
   * Fetch the list of friends for the player.
   */
  async friends(requestData: UserCheckDetails): Promise<Players[]> {
    const responseWrapper = await this._axios.get<DatabaseResponseEnvelope<Players[]>>(
      `/friends/${requestData.userName}`,
    );
    return FriendServiceClient.unwrapOrThrowError(responseWrapper);
  }

  /**
   * Sends a friend request to the user from one player to another player.
   */
  async sendFriendRequest(requestData: FriendDetailInfo): Promise<Players> {
    const responseWrapper = await this._axios.post<DatabaseResponseEnvelope<Players>>(
      `/friends/friendRequest`,
      requestData,
    );
    return FriendServiceClient.unwrapOrThrowError(responseWrapper);
  }

  /**
   * Fetch the list of sent friend requests from a player.
   */
  async sentFriendRequests(requestData: SentFriendRequestInfo): Promise<FriendRequests[]> {
    const responseWrapper = await this._axios.get<DatabaseResponseEnvelope<FriendRequests[]>>(
      `/friendRequest/sent/${requestData.fromPlayerName}`,
    );
    return FriendServiceClient.unwrapOrThrowError(responseWrapper);
  }

  /**
   * Fetch the list of received friend requests to a player.
   */
  async receivedFriendRequests(requestData: ReceivedFriendRequestInfo): Promise<FriendRequests[]> {
    const responseWrapper = await this._axios.get<DatabaseResponseEnvelope<FriendRequests[]>>(
      `/friendRequest/received/${requestData.toPlayerName}`,
    );
    return FriendServiceClient.unwrapOrThrowError(responseWrapper);
  }

  /**
   * Fetch the list of received friend requests to a player.
   */
  async acceptFreindRequest(requestData: FriendDetailInfo): Promise<boolean> {
    const responseWrapper = await this._axios.put<DatabaseResponseEnvelope<boolean>>(
      `/friends/friendRequest/accept`,
      requestData,
    );
    return FriendServiceClient.unwrapOrThrowError(responseWrapper);
  }
}
