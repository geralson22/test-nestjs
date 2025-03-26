import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';

/**
 * This module creates a service to manipulate excel files who can be injected in another modules
 * Reusing the excel manipulation in multiples modules
 */
@Module({
  imports: [],
  controllers: [],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
