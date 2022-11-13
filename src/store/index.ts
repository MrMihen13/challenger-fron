import { API } from "../services";
import { UserStore } from "./user";
import { ChatStore } from "./chat";
import { makeAutoObservable } from "mobx";

const baseURL = "https://hack.invest-open.ru/";

class RootStore {
  userStore: UserStore;
  chatStore: ChatStore;
  private backendAPI: API;
  constructor() {
    makeAutoObservable(this);
    this.backendAPI = new API({ baseURL });
    this.userStore = new UserStore(this.backendAPI);
    this.chatStore = new ChatStore(this.backendAPI);
  }
}

type Stores = keyof RootStore;
const store = new RootStore();

export function useStore(): RootStore;
export function useStore<T extends Stores>(storeName: T): RootStore[T];
export function useStore<T extends Stores>(storeName?: T) {
  if (storeName) {
    return store[storeName];
  }
  return store;
}
