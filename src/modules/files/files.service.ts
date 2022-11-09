import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import {S3} from 'aws-sdk';
import {ConfigService} from '@nestjs/config';
import {v4 as uuid} from 'uuid';
import {Model, ObjectId} from 'mongoose';
import {
  AppFileEnum,
  AudioFormat,
  AwsFileDocument,
  DocumentFormat,
  IAppDocumentFile,
  IAppFile,
  IAwsFile,
  ImageFormat,
  VideoFormat,
} from './aws-file.schema';
import {FILE_MODEL} from './files.providers';
import {ICompany} from '../projects/projects.schema';

const path = require('path');

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILE_MODEL) private fileModel: Model<AwsFileDocument>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(
    file: Express.Multer.File | IAppFile | IAppDocumentFile,
    fileType: AppFileEnum,
  ): Promise<AwsFileDocument> {
    if (!file) {
      throw new UnsupportedMediaTypeException('file is empty');
    }
    if (file.size > +process.env.APP_MAX_FILE_SIZE) {
      throw new PayloadTooLargeException('file size limit max 20 mb');
    }
    this.validateFileType(file.mimetype, fileType);
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: file.buffer,
        Key: `${uuid()}-${file.originalname}`,
      })
      .promise();
    const created = new this.fileModel({
      key: uploadResult.Key,
      url: uploadResult.Location,
      mimetype: file.mimetype,
      fileType: fileType,
    });
    return await created.save();
  }

  async deletePublicFile(fileId: string, fileType?: AppFileEnum): Promise<void> {
    const found = await this.fileModel.findOne({_id: fileId, fileType}).exec();
    if (!found) {
      throw new NotFoundException('file no found');
    }
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Key: found.key,
      })
      .promise();
    await found.remove();
  }

  public async deletePublicFiles(ids: string[]): Promise<void> {
    const found = await this.fileModel.find().where('_id').in(ids).exec();
    if (found.length) {
      found.map(async (fileToDelete) => {
        const s3 = new S3();
        await s3
          .deleteObject({
            Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
            Key: fileToDelete.key,
          })
          .promise();
        await fileToDelete.remove();
      });
    }
  }

  public async uploadImage(id: string, file: Express.Multer.File): Promise<any> {
    // const uploaded = await this.filesService.uploadFile(file, AppFileEnum.audio);
    // return await this.dataModel.findByIdAndUpdate(id, {audio: uploaded}).exec();
  }

  public async uploadImage360(id: string, file: Express.Multer.File): Promise<any> {
    // const uploaded = await this.filesService.uploadFile(file, AppFileEnum.audio);
    // return await this.dataModel.findByIdAndUpdate(id, {audio: uploaded}).exec();
  }

  public async uploadAudioFile(id: string, file: Express.Multer.File): Promise<any> {
    // const uploaded = await this.filesService.uploadPublicFile(file, AppFileEnum.audio);
    // return await this.dataModel.findByIdAndUpdate(id, {audio: uploaded}).exec();
  }

  public async uploadVideoFile(id: string, file: Express.Multer.File): Promise<any> {
    // property.video = await this.filesService.uploadPublicFile(file, AppFileEnum.video);
    // return await property.save();
  }

  public async uploadDocFile(id: string, file: Express.Multer.File): Promise<any> {
    // const fileType = (file as IAppDocumentFile)?.type;
    // const property = await this.findWithFilesById(id, fileType);
    // const previousFile = property[fileType]; // agreement, cancellation, rules,
    // await this.cleanPreviousFiles(previousFile);
    // const uploaded = await this.filesService.uploadPublicFile(file, fileType);
    // property[fileType] = uploaded;
    // return await property.save();
  }

  async deleteFiles(fileId: string[]): Promise<any> {
    const file = await this.fileModel.findById(fileId);
    if (file) {
      const s3 = new S3();
      await s3
        .deleteObject({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Key: file.key,
        })
        .promise();
      await this.fileModel.deleteOne({_id: file._id});
    }
  }

  public getFileExtension(file: Express.Multer.File): string {
    return path.extname(file.originalname);
  }

  public validateFileType(mimetype, fileType: AppFileEnum) {
    switch (fileType) {
      case AppFileEnum.audio:
        if (!this.isAudio(mimetype)) {
          throw new UnsupportedMediaTypeException(Object.values(AudioFormat));
        }
        break;
      case AppFileEnum.video:
        if (!this.isVideo(mimetype)) {
          throw new UnsupportedMediaTypeException(Object.values(VideoFormat));
        }
        break;
      case AppFileEnum.avatar:
      case AppFileEnum.image:
      case AppFileEnum.images:
        if (!this.isImage(mimetype)) {
          throw new UnsupportedMediaTypeException(Object.values(ImageFormat));
        }
        break;
      case AppFileEnum.images360:
      case AppFileEnum.image360:
        if (!this.isImage360(mimetype)) {
          throw new UnsupportedMediaTypeException(Object.values(ImageFormat));
        }
        break;
      case AppFileEnum.agreement:
      case AppFileEnum.cancellation:
      case AppFileEnum.rules:
        if (!this.isDocument(mimetype)) {
          throw new UnsupportedMediaTypeException(Object.values(DocumentFormat));
        }
        break;
      default:
        throw new UnsupportedMediaTypeException(Object.values(DocumentFormat));
    }
  }

  private isImage(mimetype): boolean {
    return !!ImageFormat[mimetype] || mimetype.startsWith('image/');
  }

  private isImage360(mimetype): boolean {
    return !!ImageFormat[mimetype] || mimetype.startsWith('image/');
  }

  private isVideo(mimetype): boolean {
    return !!AudioFormat[mimetype] || mimetype.startsWith('video/');
  }

  private isAudio(mimetype): boolean {
    return !!VideoFormat[mimetype] || mimetype.startsWith('audio/');
  }

  private isDocument(mimetype): boolean {
    return !!DocumentFormat[mimetype] || mimetype.startsWith('application/');
  }

  private validateIds(ids: string[]) {
    ids.forEach((value) => {
      const objectIdRegEx = new RegExp('^[0-9a-fA-F]{24}$');
      if (!objectIdRegEx.test(value)) {
        throw new BadRequestException('one of the file id is not valid');
      }
    });
  }
}
