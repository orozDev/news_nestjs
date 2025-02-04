import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class StripContextPipe implements PipeTransform {
  transform(value: any) {
    if (value.__context) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __context, ...rest } = value;
      return rest;
    }
    return value;
  }
}
