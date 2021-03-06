import { StatusType } from './status-type';

export class User {
  constructor(
    public id?: string,
    public email?: string,
    public name?: string,
    public password?: string,
    public status?: StatusType
  ) {}
}
