import { Injectable } from '@nestjs/common';
import { DocumentProcessingService } from '../document-processing/document-processing.service';
import { TaxLawsRepository } from './repositories/tax-laws.repository';
import { TaxLawParserService } from './tax-law-parser.service';

@Injectable()
export class TaxLawsService {
  constructor(
    private readonly taxLawsRepository: TaxLawsRepository,
    private readonly documentProcessingService: DocumentProcessingService,
    private readonly taxLawParserService: TaxLawParserService,
  ) {}

  async createFullTaxLawDocument(file: Express.Multer.File) {
    const rawText = await this.documentProcessingService.process(file);
    const structuredData = this.taxLawParserService.parse(rawText);
    const response =
      await this.taxLawsRepository.createFullTaxLawDocument(structuredData);
    return response;
  }

  async findLawById(taxLawId: string) {
    return await this.taxLawsRepository.findLawById(taxLawId);
  }

  async findSectionById(sectionId: string) {}
  async findSectionBySectionNumber(lawId: string, sectionNumber: string) {}
  async findSubSection(subSectionId: string) {}
  async findSubSectionBySubSectionNumber(
    lawId: string,
    sectionNumber: string,
    subSectionNumber: string,
  ) {}
}
