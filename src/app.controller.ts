import {
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Redirect,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel/excel.service';
import { ApiBody, ApiConsumes, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  @ApiExcludeEndpoint(true)
  @Redirect('api')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('excel-to-json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          maxLength: 100000,
        },
      },
      required: ['file'],
    },
  })
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.excelService.excelToJson(file.buffer);
  }
}
