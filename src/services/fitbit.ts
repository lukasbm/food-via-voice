import { AuthenticationStatus, IAuth } from "./auth";
import axios from "./axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import storage from "./storage";
import { FoodChoice, FoodItem, IFood } from "./food";
import { isPlatform } from "@ionic/vue";

class FitbitAuth implements IAuth {
  private readonly baseAuthUrl: string =
    "https://www.fitbit.com/oauth2/authorize/";
  private readonly clientId: string = import.meta.env.VITE_FITBIT_CLIENT_ID;
  private readonly scope: string = "nutrition";
  private readonly redirectUri: string;

  // TODO: add authentication status vue ref to dynamically use in the app

  constructor() {
    // get redirectUri
    if (isPlatform("android"))
      this.redirectUri = "mypplication://logincallback";
    else this.redirectUri = window.location.origin;

    // token extraction
    // TODO: move this initial token extractions stuff into own method.
    this.extractToken()
      .catch((err: Error) => {
        // token maybe in storage then
        console.log(err);
      })
      .then(() => {
        // check if token in storage (if available) is valid
        this.authenticationStatus().then((status: AuthenticationStatus) => {
          if (status == AuthenticationStatus.NOT_AUTHENTICATED) {
            console.log("no token available, cleaning up now...");
            this.cleanUp(); // TODO: sometimes the clean up creates issues...
          } else {
            console.log("token available");
          }
        });
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
   * generates a random nonce to be used as oauth authentication state,
   * especially in implicit flow
   */
  private generateState(): string {
    const redirectState = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 5);

    return redirectState;
  }

  buildAuthUrl(): URL {
    const url = new URL(this.baseAuthUrl);
    const expires: number = 2592000;
    const redirectState = this.generateState();
    storage.set("fitbitState", redirectState);

    url.searchParams.append("response_type", "token");
    url.searchParams.append("client_id", this.clientId);
    url.searchParams.append("scope", this.scope);
    url.searchParams.append("state", redirectState);
    url.searchParams.append("expirese", expires.toString());
    url.searchParams.append("expires_in", expires.toString());
    url.searchParams.append("redirect_uri", this.redirectUri);
    return url;
  }

  async extractToken(): Promise<string> {
    // TODO: might not work on android!
    const params = new URLSearchParams(window.location.hash.substring(1));

    const accessToken = params.get("access_token");
    if (!accessToken) throw new Error("extractToken: no token found in URL");

    const userId = params.get("user_id");
    if (!userId) throw new Error("extractToken: no userId found in URL");

    // params also contains the scopes the user actually accepted. Check if nutrition is active.
    if (params.get("scope") != this.scope)
      throw new Error("invalid scopes granted");

    const state = await storage.get("fitbitState");
    if (params.get("state") != state)
      throw new Error("extractToken: invalid state");

    await storage.set("fitbitUserId", userId);
    await storage.set("fitbitAccessToken", accessToken);

    return accessToken;
  }

  async authenticationStatus(): Promise<AuthenticationStatus> {
    const token = await this.getAccessToken();
    console.log("token in auth status: " + token);

    // no token available
    if (!token) return AuthenticationStatus.NOT_AUTHENTICATED;

    try {
      const urlBody = new URLSearchParams();
      urlBody.append("token", token);

      const status = await axios.post("/1.1/oauth2/introspect", urlBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "content-type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });
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

enum MealType {
  Breakfast = 1,
  MorningSnack = 2,
  Lunch = 3,
  AfternoonSnack = 4,
  Dinner = 5,
  EveningSnack = 6,
  Anytime = 7,
}

class FitbitApi implements IFood {
  constructor(private auth: IAuth) {}

  public async searchFoods(query: string): Promise<FoodChoice[]> {
    const response = await this.callApi({
      method: "POST",
      url: "/1/foods/search.json",
      params: {
        query: query,
      },
    });

    // TODO: turn foodChoice.unitId into an array and get the valid unitss from the getFoodUnits endpoint

    let out = response.data.foods;
    out.map((f: any) => {
      const a: FoodChoice = {
        id: f.foodId,
        name: f.name,
        brand: f.brand,
        unitId: f.defaultUnit.id,
      };
      return a;
    });
    return out;
  }

  /**
   * @param num amount number
   * @returns num rounded and formatted to two decimal places
   */
  private formatAmount(num: number): string {
    return (Math.round(num * 100) / 100).toFixed(2);
  }

  /**
   * @param date input date object
   * @returns date formatted to yyyy-MM-dd.
   */
  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  public async logFood(food: FoodChoice & FoodItem): Promise<void> {
    const mealTime: MealType = MealType.Anytime; // TODO: use appropriate time

    await this.callApi({
      method: "POST",
      url: "/1/user/-/foods/log.json",
      params: {
        foodId: food.id,
        mealTypeId: mealTime.valueOf(),
        unitId: food.unitId,
        amount: this.formatAmount(food.amount),
        date: this.formatDate(new Date()),
      },
    });
  }

  private async callApi(config: AxiosRequestConfig): Promise<AxiosResponse> {
    const authToken = await this.auth.getAccessToken();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authToken}`,
    };
    return axios(config);
  }
}

const fitbitAuth: IAuth = new FitbitAuth();
const fitbit: IFood = new FitbitApi(fitbitAuth);

export { fitbitAuth, fitbit };
export default fitbit;
