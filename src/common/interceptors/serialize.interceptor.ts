import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export interface ClassConstructor {
  new (...args: any[]): Record<string, any>;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // console.log('Before request handling', context);

    return handler.handle().pipe(
      map((data: any) => {
        // console.log('After request handling', data);

        return plainToClass(this.dto, data, {
          // Transform plain objects into class instances
          // This is useful for validation and serialization
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
