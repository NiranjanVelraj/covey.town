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
 *
 */
export type Players = {
  id: string;
  playerName: string;
  friendIds: string[];
};

export type UserCheckDetails = {
  userName: string;
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
}
