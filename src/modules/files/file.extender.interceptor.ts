import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';

@Injectable()
export class FileExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (req.body?.description) {
      req.file['description'] = req.body?.description;
    }
    if (req.body?.type) {
      req.file['type'] = req.body?.type;
    }
    return next.handle();
  }
}
