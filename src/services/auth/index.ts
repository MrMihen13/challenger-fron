import { AxiosError } from "axios";
import { User, UserId, UserJwtToken, UserRole } from "../../domains";
import { API } from "../api";
import crypto from "crypto";

const endpoints = {
  auth: "/auth",
  verifyJwt: "/jwt/verify"
};

export type UserLogin = string;

export type LoginRequestPayload = {
  login: UserLogin;
  password: string;
};

export type LoginResponsePayload = {
  userId: UserId;
  login: UserLogin;
  role: UserRole;
  jwtToken: UserJwtToken;
};

type RefreshResponsePayload = LoginResponsePayload;
type VerifyJwtResponse = Pick<LoginResponsePayload, "role" | "userId">;

export class AuthService {
  private user: User;

  constructor(user: User, private apiInstance: API) {
    this.user = user;
  }

  private clearTokens() {
    this.user.authToken = null;
    this.apiInstance.setRequestInterceptor((config) => config);
    this.apiInstance.setRequestInterceptor(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  updateTokens(jwtToken: RefreshResponsePayload["jwtToken"]) {
    this.user.authToken = jwtToken;
    this.apiInstance.setRequestInterceptor((config) => {
      return {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${jwtToken}` }
      };
    });
    this.apiInstance.setResponseInterceptor(
      (response) => response,
      (error) => {
        if (error.response.status !== 401) {
          return Promise.reject(error);
        }
        this.clearTokens();
      }
    );
  }

  async login(payload: LoginRequestPayload) {
    try {
      const sha256hash = crypto
        .createHash("sha256")
        .update(payload.password)
        .digest("hex");
      const loginRequest = this.apiInstance.post<LoginResponsePayload>(
        endpoints.auth,
        { ...payload, password: sha256hash }
      );
      const { data } = await loginRequest;
      this.updateTokens(data.jwtToken);
      return data;
    } catch (err) {
      throw (err as AxiosError).response;
    }
  }

  async verifyToken(token: UserJwtToken) {
    try {
      const { data } = await this.apiInstance.post<VerifyJwtResponse>(
        endpoints.verifyJwt,
        {
          jwt: token
        }
      );
      this.user.userRole = data.role;
      this.updateTokens(token);
    } catch (err) {
      this.clearTokens();
      throw err;
    }
  }

  disconnect() {
    this.clearTokens();
  }
}
