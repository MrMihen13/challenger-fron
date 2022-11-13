import { makeAutoObservable } from "mobx";
import { LS } from "../../utils";
import { LSKeys } from "../../const";

export type UserId = number;
export type UserAvatar = Nullable<string>;
export type UserSurname = string;
export type UserName = string;
export type UserMiddleName = string;
export type UserRole = "CLIENT" | "ADMIN";
export type UserJwtToken = Nullable<string>;

export class User {
  userId: UserId;
  avatar: UserAvatar;
  surname: UserSurname;
  name: UserName;
  middleName: UserMiddleName;
  userRole: UserRole;
  jwtToken: UserJwtToken;

  constructor(user: User) {
    makeAutoObservable(this);
    this.userId = user.userId;
    this.avatar = user.avatar;
    this.surname = user.surname;
    this.name = user.name;
    this.middleName = user.middleName;
    this.userRole = user.userRole;
    this.jwtToken = user.jwtToken;
  }

  get authToken() {
    return this.jwtToken;
  }

  set authToken(token: UserJwtToken) {
    if (token) {
      LS.setItem(LSKeys.AUTH, token);
    } else {
      LS.removeItem(LSKeys.AUTH);
    }
    this.jwtToken = token;
  }

  get isAuthorized() {
    return Boolean(this.authToken);
  }

  static initialUser() {
    return new User({
      userId: 0,
      avatar: null,
      surname: "",
      name: "",
      middleName: "",
      userRole: "CLIENT",
      jwtToken: LS.getItem(LSKeys.AUTH),
      authToken: LS.getItem(LSKeys.AUTH),
      isAuthorized: false
    });
  }
}
