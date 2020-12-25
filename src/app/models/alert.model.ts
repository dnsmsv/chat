import { AlertType } from './alert-type';

export class Alert {
  private _text: string;
  private _type: AlertType;
  private _visible: boolean;

  constructor(text?: string, type?: AlertType, visible?: boolean) {
    this._text = text;
    this._type = type;
    this._visible = visible;
  }

  clone(other: Alert) {
    this._text = other.text;
    this._type = other.type;
    this._visible = other.visible;
  }

  get text(): string {
    return this._text;
  }

  get type(): AlertType {
    return this._type;
  }

  get visible(): boolean {
    return this._visible;
  }
}
