import { API } from "../api";
import { DialogId, Message } from "../../domains";
import { getQueryParams } from "../../utils";

const endpoints = {
  send: "/message/send",
  chatHistory: "/chat/history",
  availableDialog: "/chat/dialog",
  updateWidget: "/chat/message/update"
};

export type SendMessagePayload = Partial<
  Pick<
    Message,
    "text" | "messageType" | "data" | "mediaUrl" | "messageId" | "dialogId"
  >
>;
export type SendMessageResponsePayload = Pick<Message, "messageId">;

export type ChatHistoryQueryParams = {
  dialogId: DialogId;
  limit?: number;
  timestamp?: number;
  older?: boolean;
};

export type ChatHistoryResponsePayload = { messages: Message[] };

export type AvailableDialogPaylod = { dialogId: DialogId };

export type UpdateWidgetRequestPayload = Pick<Message, "messageId" | "data">;

export class ChatService {
  constructor(private apiInstance: API) {}

  async sendMessage(message: SendMessagePayload) {
    try {
      const { data } = await this.apiInstance.post<SendMessageResponsePayload>(
        endpoints.send,
        { message }
      );
      return data;
    } catch (e) {
      throw e;
    }
  }
  async getChatHistory(reqParams: ChatHistoryQueryParams) {
    try {
      const params = getQueryParams(reqParams);
      const { data } = await this.apiInstance.get<ChatHistoryResponsePayload>(
        endpoints.chatHistory,
        {
          params
        }
      );
      return data;
    } catch (e) {
      throw e;
    }
  }
  async getAvailableDialog() {
    try {
      const { data } = await this.apiInstance.get<AvailableDialogPaylod>(
        endpoints.availableDialog
      );
      return data;
    } catch (e) {
      throw e;
    }
  }
  async changeWidget(widget: UpdateWidgetRequestPayload) {
    try {
      await this.apiInstance.post<void>(endpoints.updateWidget, widget);
    } catch (e) {
      throw e;
    }
  }
}
