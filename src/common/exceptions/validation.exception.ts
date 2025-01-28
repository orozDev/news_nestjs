import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common.exception';

export class ValidationException extends CommonException {
  messages: any;
  constructor(response) {
    super(response, HttpStatus.BAD_REQUEST);
    this.messages = response;
  }
}
