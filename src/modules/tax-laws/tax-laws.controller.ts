import {
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { TaxLawsService } from './tax-laws.service';

@Controller('tax-laws')
@ApiTags('Tax-Laws')
export class TaxLawsController {
  constructor(private readonly taxLawsService: TaxLawsService) {}
  @Post('upload')
  @SuccessMessage('Tax law uploaded and processed successfully.')
  @ApiOperation({
    summary: 'Upload a Tax Law PDF file.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tax law uploaded and processed successfully.',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Unable to upload tax law',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests. Rate limit exceeded',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },

      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('pdf')) {
          return cb(new Error('Only PDF files allowed'), false);
        }

        cb(null, true);
      },
    }),
  )
  async uploadTaxLaw(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const upload = await this.taxLawsService.createFullTaxLawDocument(file);
    return upload;
  }

  @Get('get-tax-law-by-id/:taxLawId')
  async findLawById(@Param('taxLawId') taxLawId: string) {
    return await this.taxLawsService.findLawById(taxLawId);
  }
}
