import { AuthenticationStatus, IAuth } from "./auth";
import axios from "./axios";
import { AxiosRequestConfig, Method, AxiosResponse } from "axios";
import storage from "./storage";

class FitbitAuth implements IAuth {
  private readonly baseAuthUrl: string =
    "https://www.fitbit.com/oauth2/authorize/";
  private readonly clientId: string = import.meta.env.VITE_FITBIT_CLIENT_ID;
  private readonly scope: string = "nutrition";
  private readonly redirectUri: string = window.location.origin;

  constructor() {
    this.authenticationStatus().then((status: AuthenticationStatus) => {
      if (status == AuthenticationStatus.NOT_AUTHENTICATED) {
        this.cleanUp();
        this.extractToken();
      }
    });
  }

  /**
   * removes all stored information regarding the authentication
   * AKA: reset refs and storage
   */
  private cleanUp() {
    // should clear: fitbitState, fitbitUserId, fitbitAccessToken
    storage.clear();
  }

  /**
   * generate and saves state
   */
  private generateState(): string {
    const redirectState = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 5);

    storage
      .set("fitbitState", redirectState)
      .catch((err) => console.error(err));

    return redirectState;
  }

  buildAuthUrl(): URL {
    const url = new URL(this.baseAuthUrl);
    const redirectState = this.generateState();
    const expires: number = 2592000;

    url.searchParams.append("response_type", "token");
    url.searchParams.append("client_id", this.clientId);
    url.searchParams.append("scope", this.scope);
    url.searchParams.append("state", redirectState);
    url.searchParams.append("expirese", expires.toString());
    url.searchParams.append("expires_in", expires.toString());
    url.searchParams.append("redirect_uri", this.redirectUri);
    return url;
  }

  extractToken(): string {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");
    if (!accessToken) throw new Error("extractToken: no token found in URL");
    const userId = params.get("user_id");
    if (!userId) throw new Error("extractToken: no userId found in URL");

    // params also contains the scopes the user actually accepted. Check if nutrition is active.
    if (params.get("scope") != this.scope)
      throw new Error("invalid scopes granted");

    // TODO: check state

    storage.set("fitbitUserId", userId);
    storage.set("fitbitAccessToken", accessToken);

    return accessToken;
  }

  async authenticationStatus(): Promise<AuthenticationStatus> {
    const token = await this.getAccessToken();

    try {
      const status = await axios.post(
        "/1.1/oauth2/introspect",
        { token: token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );
      return status.data.active
        ? AuthenticationStatus.AUTHENTICATED
        : AuthenticationStatus.NOT_AUTHENTICATED;
    } catch (err) {
      return AuthenticationStatus.NOT_AUTHENTICATED;
    }
  }

  logout(): void {
    const clientId = this.clientId;

    this.getAccessToken()
      .then((token) => {
        axios
          .post(
            "/oauth2/revoke",
            {
              token: token,
              client_id: clientId,
            },
            {
              headers: {
                "content-type": "application/x-www-form-urlencoded",
              },
            }
          )
          .catch((err) => console.error("fitbit logout error:\n" + err));
      })
      .finally(() => this.cleanUp());
  }

  public async getAccessToken(): Promise<string | undefined> {
    try {
      return await storage.get("fitbitAccessToken");
    } catch (err) {
      return undefined;
    }
  }

  public async getActiveUser(): Promise<string | undefined> {
    try {
      return await storage.get("fitbitUserId");
    } catch (err) {
      return undefined;
    }
  }
}

class FitbitApi {
  constructor(private auth: IAuth) {}

  public async searchFoods(query: string) {
    return this.callApiConfig({
      method: "POST",
      url: "/1/foods/search.json",
      params: {
        query: query,
      },
    });
  }

  private async callApiConfig(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    const authToken = await this.auth.getAccessToken();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authToken}`,
    };
    return axios(config);
  }

  private callApi(
    url: string,
    method: Method | string,
    body?: any
  ): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      url: url,
      method: method,
      data: body,
    };
    return this.callApiConfig(config);
  }

  // TODO: or more specific methods
}

const fitbitAuth: IAuth = new FitbitAuth();
const fitbit: FitbitApi = new FitbitApi(fitbitAuth);

export { fitbitAuth, fitbit };
export default fitbit;
