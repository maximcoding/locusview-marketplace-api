import {ApiBody} from '@nestjs/swagger';
import {AppFileEnum, AudioFormat, DocumentFormat, ImageFormat, VideoFormat} from './aws-file.schema';

export const ApiAvatarFile =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          description: {
            description: 'free text',
            type: 'string',
          },
          type: {
            description: AppFileEnum.avatar,
            type: 'string',
            enum: [AppFileEnum.avatar],
          },
          [fileName]: {
            description: Object.values(ImageFormat).join(', '),
            type: 'string',
            format: 'binary',
            enum: Object.values(ImageFormat),
          },
        },
      },
    })(target, propertyKey, descriptor);
  };

export const ApiImageFile =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          description: {
            description: 'free text',
            type: 'string',
          },
          type: {
            description: AppFileEnum.image + ', ' + AppFileEnum.image360,
            type: 'string',
            enum: [AppFileEnum.image, AppFileEnum.image360],
          },
          [fileName]: {
            description: Object.values(ImageFormat).join(', '),
            type: 'string',
            format: 'binary',
            enum: Object.values(ImageFormat),
          },
        },
      },
    })(target, propertyKey, descriptor);
  };

export const ApiVideoFile =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          description: {
            description: 'free text',
            type: 'string',
          },
          [fileName]: {
            description: Object.values(VideoFormat).join(', '),
            type: 'string',
            format: 'binary',
            enum: Object.values(VideoFormat),
          },
        },
      },
    })(target, propertyKey, descriptor);
  };

export const ApiAudioFile =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          description: {
            description: 'free text',
            type: 'string',
          },
          [fileName]: {
            description: Object.values(AudioFormat).join(', '),
            type: 'string',
            enum: Object.values(AudioFormat),
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };

export const ApiDocFile =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          description: {
            description: 'free text',
            type: 'string',
          },
          type: {
            description: AppFileEnum.agreement + ', ' + AppFileEnum.cancellation + ', ' + AppFileEnum.rules,
            type: 'string',
            enum: [AppFileEnum.agreement, AppFileEnum.cancellation, AppFileEnum.rules],
          },
          [fileName]: {
            description: Object.values(DocumentFormat).join(', '),
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
