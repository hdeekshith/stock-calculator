import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Inventory Module (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return 400 status code when sku is not passed', () => {
    return request(app.getHttpServer()).get('/inventory').expect(400);
  });

  it('should return 400 status code when sku is invalid', () => {
    return request(app.getHttpServer())
      .get('/inventory?sku=SXV4098/71/68')
      .expect(400);
  });

  it('should return 200 status code when valid sku is passed', () => {
    return request(app.getHttpServer())
      .get('/inventory?sku=SXV420098/71/68')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
