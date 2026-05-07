import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    // 1. Handle GraphQL Context
    if (context.getType().toString() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      
      // Use info.parentType to get the operation name (Query/Mutation)
      const parentType = info.parentType.name; 

      return next.handle().pipe(
        tap(() => {
          const ms = Date.now() - start;
          console.log(`[GQL] ${parentType} -> ${info.fieldName} - ${ms}ms`);
        }),
      );
    }

    // 2. Handle REST HTTP Context
    const host = context.switchToHttp();
    const req = host.getRequest();

    if (req) {
      const { method, url } = req;
      return next.handle().pipe(
        tap(() => {
          const ms = Date.now() - start;
          console.log(`[HTTP] ${method} ${url} - ${ms}ms`);
        }),
      );
    }

    return next.handle();
  }
}