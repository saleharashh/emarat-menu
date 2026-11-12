import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { seedDatabase } from './seed-data';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const ds = app.get(DataSource);
    await seedDatabase(ds, { requireAdminPassword: true });
  } finally {
    await app.close();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
