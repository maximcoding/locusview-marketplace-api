import {FilesService} from './files.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {Body, Controller, Delete, Param, UseGuards} from '@nestjs/common';
import {ModelEnum} from '../../enums/model.enum';
import {ObjectIdValidationPipe} from '../../helpers/object-id.validation.pipe';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@ApiTags('Files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(ModelEnum.Files)
export class FilesController {
  constructor(private service: FilesService) {}

  @Delete()
  async deleteMultipleFiles(@Body() ids: string[]): Promise<void> {
    await this.service.deletePublicFiles(ids);
  }

  @Delete(':id')
  async deleteFile(@Param('id', ObjectIdValidationPipe) id: string): Promise<void> {
    await this.service.deletePublicFile(id);
  }

  // @Post('upload/property/multipart/audio')
  // @ApiConsumes('multipart/form-data')
  // @ApiAudioFile()
  // @UseInterceptors(FileExtender)
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadPropertyAudio(
  //   @Param('propertyId', ObjectIdValidationPipe) id: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<IAwsFile> {
  //   return await this.service.uploadAudioFile(id, file);
  // }
  //
  // @Post('upload/property/multipart/video')
  // @ApiConsumes('multipart/form-data')
  // @ApiVideoFile()
  // @UseInterceptors(FileExtender)
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadPropertyVideo(
  //   @Param('propertyId', ObjectIdValidationPipe) id: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<IAwsFile> {
  //   return await this.service.uploadVideoFile(id, file);
  // }
  //
  // @Post('upload/property/multipart/document')
  // @ApiConsumes('multipart/form-data')
  // @ApiDocFile()
  // @UseInterceptors(FileDocExtender)
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadPropertyDocument(
  //   @Param('propertyId', ObjectIdValidationPipe) id: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<IAwsFile> {
  //   return await this.service.uploadDocFile(id, file);
  // }
  //
  // @Post('upload/property/multipart/image')
  // @ApiConsumes('multipart/form-data')
  // @ApiImageFile()
  // @UseInterceptors(FileInterceptor('image'))
  // async uploadPropertyImage(
  //   @Param('propertyId', ObjectIdValidationPipe) id: string,
  //   @UploadedFile() images: Express.Multer.File,
  // ): Promise<IProperty> {
  //   return await this.service.uploadImage(id, images);
  // }
  //
  // @Post('upload/property/multipart/image360')
  // @ApiConsumes('multipart/form-data')
  // @ApiImageFile()
  // @UseInterceptors(FileInterceptor('image'))
  // async uploadPropertyImage360(
  //   @Param('propertyId', ObjectIdValidationPipe) id: string,
  //   @UploadedFile() images: Express.Multer.File,
  // ): Promise<IProperty> {
  //   return await this.service.uploadImage(id, images);
  // }

  // @Post('upload/multipart/images')
  // @ApiConsumes('multipart/form-data')
  // @ApiMultiFile()
  // @UseInterceptors(FilesInterceptor('files'))
  // async uploadImages360(
  //   @Param('id', ObjectIdValidationPipe) id: string,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ): Promise<IProperty> {
  //   return await this.service.uploadImages(id, files);
  // }
}
