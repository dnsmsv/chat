export class ChatMessage {
    public $key: string;

    constructor(
        public userName?: string,
        public email?: string,
        public message?: string,
        public timeSent?: Date) {
            timeSent = new Date();
    }
}