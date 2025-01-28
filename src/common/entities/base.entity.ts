export abstract class BaseEntity<T> {
  private _id: string | null = null;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  constructor(partial?: Partial<T>) {
    Object.assign(this, partial);
  }
}
