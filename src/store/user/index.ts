import { flow, makeAutoObservable, runInAction } from "mobx";
import { User, UserId } from "../../domains";
import {
  API,
  AuthService,
  LoginRequestPayload,
  LoginResponsePayload,
  UserService
} from "../../services";

export class UserStore {
  user: User;
  authService: AuthService;
  userService: UserService;
  flags = {
    user: {
      isLoading: true
    }
  };
  constructor(apiProvider: API) {
    makeAutoObservable(this);
    this.user = User.initialUser();
    this.authService = new AuthService(this.user, apiProvider);
    this.userService = new UserService(apiProvider);
  }

  async getInfo(userId: UserId) {
    runInAction(() => {
      this.flags.user.isLoading = true;
    });
    try {
      const fullData = await this.userService.getUserInfo({ userId });
      this.user.avatar = fullData.avatar;
      this.user.name = fullData.name;
      this.user.surname = fullData.surname;
      this.user.middleName = fullData.middleName;
      this.user.userId = fullData.userId;
    } catch (e) {
      console.error(e);
    }
    runInAction(() => {
      this.flags.user.isLoading = false;
    });
  }

  login = flow(function* (this: UserStore, loginPayload: LoginRequestPayload) {
    this.flags.user.isLoading = true;
    try {
      const initUserData: LoginResponsePayload = yield this.authService.login(
        loginPayload
      );
      yield this.getInfo(initUserData.userId);
      this.user.authToken = initUserData.jwtToken;
      this.user.userRole = initUserData.role;
    } catch (e) {
      console.error(e);
      throw e;
    }
    this.flags.user.isLoading = false;
  });

  get fullName() {
    return `${this.user.surname} ${this.user.name} ${this.user.middleName}`;
  }

  disconnect() {
    this.authService.disconnect();
    this.user = User.initialUser();
  }
}
