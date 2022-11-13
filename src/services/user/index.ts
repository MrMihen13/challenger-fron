import { User, UserId } from "../../domains";
import { getQueryParams } from "../../utils";
import { API } from "../api";

const endpoints = {
  getUserInfo: "/user/info",
  updateUserInfo: "/user/info"
};

export type GetUserInfoQueryParams = {
  userId: UserId;
};

export type GetUserInfoReponse = Omit<User, "jwtToken" | "userRole">;

export type UpdateUserInfoPayload = Pick<
  User,
  "avatar" | "surname" | "name" | "middleName"
>;

export class UserService {
  constructor(private apiInstance: API) {}
  async getUserInfo(reqParams: GetUserInfoQueryParams) {
    try {
      const params = getQueryParams(reqParams);
      const { data } = await this.apiInstance.get<GetUserInfoReponse>(
        endpoints.getUserInfo,
        {
          params
        }
      );
      return data;
    } catch (e) {
      throw e;
    }
  }
  async updateUserInfo(payload: UpdateUserInfoPayload) {
    try {
      await this.apiInstance.post<void>(endpoints.updateUserInfo, payload);
    } catch (e) {
      throw e;
    }
  }
}
