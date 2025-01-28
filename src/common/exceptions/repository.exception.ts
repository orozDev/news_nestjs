import { CommonException } from './common.exception';

export default class RepositoryException extends CommonException {
  details?: string;

  constructor(message: string, code: number, details?: string) {
    super(message, code);
    this.details = details;
  }
}
