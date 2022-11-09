import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {CommonSchemaOptions} from '../../helpers/common-schema.options';
import {Document, ObjectId} from 'mongoose';
import mongoose from 'mongoose';

export enum ImageFormat {
    jpeg = 'image/jpeg',
    png = 'image/png',
    tiff = 'image/tiff',
    gif = 'image/gif',
    heic = 'image/heic',
    heif = 'image/heif',
}

export enum DocumentFormat {
    pdf = 'application/pdf',
    doc = 'application/msword',
}

export enum AudioFormat {
    mp3 = 'audio/mpeg',
    aiff = 'audio/x-aiff',
}

export enum VideoFormat {
    m3u8 = 'application/x-mpegURL',
    mpeg = 'video/mpeg',
    mp4 = 'video/mp4',
    m4v = 'video/x-m4v',
    mov = 'video/quicktime',
}

export interface IAppDocumentFile extends Express.Multer.File {
    type: AppFileEnum;
}

export interface IAppFile extends Express.Multer.File {
    description: AppFileEnum;
    type: AppFileEnum;
}

export type ContentType = ImageFormat | DocumentFormat | AudioFormat | VideoFormat;

export enum AppImageFileEnum {
    image = 'image',
    image360 = 'image360',
}

export enum AppFileEnum {
    avatar = 'avatar',
    image = 'image',
    images = 'images',
    image360 = 'image360',
    images360 = 'images360',
    video = 'video',
    audio = 'audio',
    agreement = 'agreement',
    cancellation = 'cancellation',
    rules = 'rules',
}

export interface IAwsFile {
    _id?: string;
    url: string;
    mimetype: ContentType;
    key: string;
    fileType: AppFileEnum;
}

@Schema(CommonSchemaOptions)
export class AwsFile implements IAwsFile {
    @Prop({
        required: [false, 'FILE_URL_IS_BLANK'],
    })
    url: string;

    @Prop({
        required: [false, 'FILE_NAME_IS_BLANK'],
    })
    name: string;

    @Prop({
        required: [true, 'FILE_MIME_TYPE_IS_BLANK'],
    })
    mimetype: ContentType;

    @Prop({
        required: [true, 'FILE_KEY_IS_BLANK'],
    })
    key: string;

    @Prop({
        required: [true, 'FILE_TYPE_IS_BLANK'],
    })
    fileType: AppFileEnum;
}

export type AwsFileDocument = AwsFile & Document;

export const AwsFileSchema = SchemaFactory.createForClass(AwsFile);

AwsFileSchema.pre('save', async function (next: mongoose.HookNextFunction) {
    next();
});

AwsFileSchema.post('remove', async (doc) => {
    // remove from relate property
    // remove from related room
});
