import axios from "./axios";
import { AxiosRequestConfig, Method, AxiosResponse } from "axios";

const baseAuthUrl: string = "https://www.fitbit.com/oauth2/authorize/";
const clientId: string = import.meta.env.VITE_FITBIT_CLIENT_ID;
const scope: string = "nutrition";
const redirectUri: string = window.location.origin;

/**
 * returns the auth url the user is redirected to for the auth code.
 * NOTE: the auth code is not the auth token! it has to be exchanged first (see below)
 */
function buildAuthUrl(): URL {
  const url = new URL(baseAuthUrl);

  const redirectState = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);

  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("scope", scope);
  url.searchParams.append("state", redirectState);
  url.searchParams.append("redirect_uri", redirectUri);
  return url;
}

/**
 * exchange auth code for a pair of access and request tokens
 */
async function exchangeFitbitTokens() {
  const authCode = extractAuthToken();
  if (authCode == null) throw new Error("no auth code in the uri");

  try {
    const res: AxiosResponse = await axios.post(
      "/oauth2/token",
      {
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
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

function extractAuthToken(): null | string {
  const params = new URLSearchParams(window.location.search);
  // TODO: compare states
  return params.get("code");
}

function callApi(
  url: string,
  method: Method | string,
  body?: Object
): Promise<AxiosResponse> {
  const authToken = extractAuthToken();
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

async function isSignedIn(): Promise<boolean> {
  const authToken = extractAuthToken();

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
    if (res.status != 200) return false;
    if (!res.data.active) return false;
    return true;
  } catch (error: any) {
    console.error(error);
    return false;
  }
}

function logout(token: string): void {
  axios.post(
    "/oauth2/revoke",
    {
      token: token,
      client_id: clientId,
    },
    {
      headers: {
        authorization: undefined, // TODO: one, but only for server auth?
        accept: "application/json",
      },
    }
  );
}
