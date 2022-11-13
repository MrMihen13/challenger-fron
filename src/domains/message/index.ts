import { makeAutoObservable } from "mobx";
import { UserId } from "../user";

export type MessageId = string;
export type MessageText = string;
export type MessageData = Nullable<{ data: any }>;
export type MessageType = "TEXT" | "WIDGET" | "MEDIA";
export type MessageMediaUrl = Nullable<string>;
export type MessageSender = UserId;
export type MessageRecipient = UserId;
export type MessageDialogId = number;
export type MessageTimestamp = Timestamp;

export class Message {
  messageId: MessageId;
  text: MessageText;
  data: MessageData;
  messageType: MessageType;
  mediaUrl: MessageMediaUrl;
  sender: MessageSender;
  recipient: MessageRecipient;
  dialogId: MessageDialogId;
  timestamp: MessageTimestamp;
  constructor(message: Message) {
    makeAutoObservable(this);
    this.messageId = message.messageId;
    this.text = message.text;
    this.data = message.data;
    this.messageType = message.messageType;
    this.mediaUrl = message.mediaUrl;
    this.sender = message.sender;
    this.recipient = message.recipient;
    this.dialogId = message.dialogId;
    this.timestamp = message.timestamp;
  }
}
