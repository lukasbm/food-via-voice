export enum AuthenticationStatus {
  NOT_AUTHENTICATED = 0,
  AUTHENTICATED = 1,
  SIGNING_IN = 2,
}

export interface IAuth {
  /**
   * returns the auth url the user is redirected to for the auth code.
   * NOTE: the auth code is not the auth token! it has to be exchanged first (see below)
   */
  buildAuthUrl(): URL;

  /**
   * exchange auth code for a pair of access and request tokens
   */
  exchangeToken(): void;

  /**
   * fetches the auth token from the "code" query parameter (if available)
   * or the local storage
   * TODO: priority? local or query first?
   */
  extractToken(): null | string;

  /**
   * current authentication status
   */
  authenticationStatus(): AuthenticationStatus;

  /**
   * revoke active token
   */
  logout(): void;
}
