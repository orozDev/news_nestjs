import { CommonException } from './common.exception';

export default class LockedException extends CommonException {
  constructor(message: string, code: number = 423) {
    super(message, code);
  }
}
