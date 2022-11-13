export type DialogId = number;

export class Dialog {
  dialogId: DialogId;
  constructor(dialog: Dialog) {
    this.dialogId = dialog.dialogId;
  }
}
