import { makeAutoObservable, runInAction } from "mobx";
import { DialogId, Message, MessageId } from "../../domains";
import {
  API,
  ChatHistoryQueryParams,
  ChatService,
  SendMessagePayload,
  UpdateWidgetRequestPayload
} from "../../services";

export class ChatStore {
  messages: Message[] = [];
  dialogId: Nullable<DialogId> = null;
  chatService: ChatService;
  flags = {
    history: {
      isLoading: true
    },
    dialog: {
      isLoading: true
    },
    send: {
      isSending: false
    },
    widgets: {
      loadingWidgets: [] as MessageId[]
    }
  };
  constructor(apiInstance: API) {
    makeAutoObservable(this);
    this.chatService = new ChatService(apiInstance);
  }

  async getDialogs() {
    runInAction(() => {
      this.flags.dialog.isLoading = true;
    });
    try {
      const { dialogId } = await this.chatService.getAvailableDialog();
      runInAction(() => {
        this.dialogId = dialogId;
      });
    } catch (e) {
      console.error(e);
    }
    runInAction(() => {
      this.flags.dialog.isLoading = false;
    });
  }

  async getHistory(reqParams: ChatHistoryQueryParams) {
    runInAction(() => {
      this.flags.history.isLoading = true;
    });
    try {
      const { messages } = await this.chatService.getChatHistory(reqParams);
      runInAction(() => {
        this.messages = messages.map((message) => new Message(message));
        this.messages.reverse();
      });
    } catch (e) {
      console.error(e);
    }
    runInAction(() => {
      this.flags.history.isLoading = false;
    });
  }

  async sendMessage(message: SendMessagePayload) {
    runInAction(() => {
      this.flags.send.isSending = true;
    });
    try {
      await this.chatService.sendMessage(message);
    } catch (e) {
      console.error(e);
    }
    runInAction(() => {
      this.flags.send.isSending = false;
    });
  }

  async changeWidget(widget: UpdateWidgetRequestPayload) {
    const changingWidgetId = widget.messageId;
    runInAction(() => {
      this.flags.widgets.loadingWidgets.push(changingWidgetId);
    });
    try {
      await this.chatService.changeWidget(widget);
    } catch (e) {
      console.error(e);
    }
    runInAction(() => {
      this.flags.widgets.loadingWidgets = this.flags.widgets.loadingWidgets.filter(
        (id) => id !== changingWidgetId
      );
    });
  }
}
