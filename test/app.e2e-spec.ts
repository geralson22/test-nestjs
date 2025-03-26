import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/excel-to-json', () => {
    it('Should return 400 due dont send any file', () => {
      return request(app.getHttpServer())
        .post('/excel-to-json')
        .expect(400)
        .then((response) => {
          const message = response.body.message as string;

          expect(message).toEqual('File is required');
        });
    });

    it('Should return 400 due send valid file', () => {
      return request(app.getHttpServer())
        .post('/excel-to-json')
        .attach('file', 'test/files/bluealba.png')
        .expect(400)
        .then((response) => {
          const message = response.body.message as string;

          expect(message).toMatch(
            new RegExp(
              'expected type is application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ),
          );
        });
    });

    it('Should return 200 with JSON array with 7 objects', () => {
      return request(app.getHttpServer())
        .post('/excel-to-json')
        .attach('file', 'test/files/excel-to-json.xlsx')
        .expect(200)
        .then((response) => {
          expect(response.body).toBeDefined();
          expect(response.body).toHaveLength(7);
          expect(response.body[0]).toHaveProperty('name');
          expect(response.body[0].name).toBe('Peter');
        });
    });
  });
});
