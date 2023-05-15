export enum AuthenticationStatus {
  NOT_AUTHENTICATED = 0,
  AUTHENTICATED = 1,
}

/**
 * This interface can be used for oauth2 implicit flow
 *
 * NOTE:
 * exchanging and refreshing the token using the /oauth2/token endpoint
 * is only necceccary when using the server auth, i.e. in google cloud functions.
 */
export interface IAuth {
  /**
   * returns the auth url the user is redirected to for the auth token.
   */
  buildAuthUrl(): URL;

  /**
   * fetches the auth token from the query parameters (if available)
   * throws errors otherwise
   * Also compares the state/nonce for security
   */
  extractToken(): Promise<string>;

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
  getAccessToken(): Promise<string | undefined>;

  /**
   * get active user (if active)
   */
  getActiveUser(): Promise<string | undefined>;
}
