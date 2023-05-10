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

  extractToken(): string | null {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");
    const userId = params.get("user_id");
    const expires = new Date(
      new Date().getTime() +
        1000 * parseInt(params.get("expires_in") ?? "0") -
        30 * 1000
    ); // calculates expiration timestamp (subtracts 30seconds for good measure)

    // TODO: TODO params also contains the scopes the user actually accepted. Check if nutrition is active

    // TODO: check state

    storage.set("fitbitUserId", userId);
    storage.set("fitbitAccessToken", accessToken);
    storage.set("fitbitExpires", expires);

    return params.get("code");
  }

  async authenticationStatus(): Promise<AuthenticationStatus> {
    const token = await storage.get("fitbitAccessToken");

    try {
      const status = await axios.post(
        "/1.1/oauth2/introspect",
        { token: token },
        {
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
        }
      );
      console.log(status.data);
      return status.data.active
        ? AuthenticationStatus.AUTHENTICATED
        : AuthenticationStatus.NOT_AUTHENTICATED;
    } catch (err) {
      console.error("fitbit token introspection error:\n" + err);
      return AuthenticationStatus.NOT_AUTHENTICATED;
    }
  }

  logout(): void {
    const clientId = this.clientId;

    storage.get("fitbitAccessToken").then((token) => {
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
    });
  }
}

class FitbitApi {
  constructor(private auth: IAuth) {
    console.log("fitbit auth constructor");
  }

  callApi(
    url: string,
    method: Method | string,
    body?: Object
  ): Promise<AxiosResponse> {
    const authToken = this.auth.extractToken();
    const config: AxiosRequestConfig = {
      url: url,
      method: method,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: body,
    };
    return axios(config);
  }
}

const fitbitAuth: IAuth = new FitbitAuth();
const fitbit: FitbitApi = new FitbitApi(fitbitAuth);

export { fitbitAuth, fitbit };
export default fitbit;
