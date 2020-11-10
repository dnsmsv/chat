export class ChatMessage {
  public $key: string;

  constructor(
    public userName?: string,
    public email?: string,
    public message?: string,
    public timeSent?: Date,
    public isOwn?: boolean,
    public replyedMessageKey?: string
  ) {
    timeSent = new Date();
  }
}
