import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  /**
   * Receive buffer of a request file with expected xlsx extension and convert it to JSON
   * @param buffer file
   *
   * @returns json object value
   */
  async excelToJson(buffer: Buffer): Promise<Record<string, string>[]> {
    const workbook = new ExcelJS.Workbook();

    // Do not block main thread while read buffers
    await workbook.xlsx.load(buffer);

    // Read the first worksheet
    const worksheet = workbook.worksheets[0];
    const jsonData: Record<string, string>[] = [];
    const headers = worksheet.getRow(1)?.values as string[];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowData: Record<string, string> = {};

      if (!headers) return;

      headers.forEach((header, index: number) => {
        rowData[header] = row.getCell(index).value as string;
      });

      jsonData.push(rowData);
    });

    return jsonData;
  }
}
