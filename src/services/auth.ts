export enum AuthenticationStatus {
  NOT_AUTHENTICATED = 0,
  AUTHENTICATED = 1,
}

export interface IAuth {
  /**
   * returns the auth url the user is redirected to for the auth token.
   */
  buildAuthUrl(): URL;

  /**
   * fetches the auth token from the query parameters (if available)
   */
  extractToken(): null | string;

  /**
   * current authentication status
   */
  authenticationStatus(): Promise<AuthenticationStatus>;

  /**
   * revoke active token
   */
  logout(): void;

  /**
   * return token for usage
   */
  getAccessToken(): Promise<string>;

  /**
   * exchanging and refreshing the token using the /oauth2/token endpoint
   * is only necceccary when using the server auth, i.e. in google cloud functions.
   */
}
