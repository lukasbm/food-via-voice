import { AuthenticationStatus, IAuth } from "./auth";
import axios from "./axios";
import { AxiosRequestConfig, Method, AxiosResponse } from "axios";

class FitbitAuth implements IAuth {
  private readonly baseAuthUrl: string =
    "https://www.fitbit.com/oauth2/authorize/";
  private readonly clientId: string = import.meta.env.VITE_FITBIT_CLIENT_ID;
  private readonly scope: string = "nutrition";
  private readonly redirectUri: string = window.location.origin;

  buildAuthUrl(): URL {
    const url = new URL(this.baseAuthUrl);

    const redirectState = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 5);

    url.searchParams.append("response_type", "code");
    url.searchParams.append("client_id", this.clientId);
    url.searchParams.append("scope", this.scope);
    url.searchParams.append("state", redirectState);
    url.searchParams.append("redirect_uri", this.redirectUri);
    return url;
  }

  exchangeToken(): void {
    const authCode = this.extractToken();
    if (authCode == null) throw new Error("no auth code in the uri");

    try {
      const res: AxiosResponse = await axios.post(
        "/oauth2/token",
        {
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
          code: authCode,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return res.data; // TODO: bad return
    } catch (err) {
      console.error(err);
    }
  }

  extractToken(): string | null {
    const params = new URLSearchParams(window.location.search);
    // TODO: compare states
    return params.get("code");
  }

  async authenticationStatus(): AuthenticationStatus {
    const authToken = this.extractToken();

    try {
      const res: AxiosResponse = await axios.post(
        "/1.1/oauth2/introspect",
        { token: authToken },
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            "content-type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
        }
      );
      if (res.status != 200) return AuthenticationStatus.NOT_AUTHENTICATED;
      if (!res.data.active) return AuthenticationStatus.NOT_AUTHENTICATED;
      return AuthenticationStatus.AUTHENTICATED;
    } catch (error: any) {
      console.error(error);
      return AuthenticationStatus.NOT_AUTHENTICATED;
    }
  }

  logout(): void {
    const token = this.extractToken();
    axios.post("/oauth2/revoke", {
      token: token,
    });
  }
}

export class Fitbit {
  constructor(private auth: IAuth) {}

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
