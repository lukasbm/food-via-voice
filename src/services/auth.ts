export enum AuthenticationStatus {
  NOT_AUTHENTICATED = 0,
  AUTHENTICATED = 1,
}

export interface IAuth {
  /**
   * returns the auth url the user is redirected to for the auth code.
   * NOTE: the auth code is not the auth token! it has to be exchanged first (see below)
   */
  buildAuthUrl(): URL;

  /**
   * fetches the auth token from the "code" query parameter (if available)
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
   * exchanging and refreshing the token using the /oauth2/token endpoint
   * is only necceccary when using the server auth, i.e. in google cloud functions.
   */
}
