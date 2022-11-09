import {Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException} from '@nestjs/common';
import {Observable, throwError, TimeoutError} from 'rxjs';
import {catchError, timeout} from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(+process.env.APP_REQUEST_TIME_OUT),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  }
}
