import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { MenuItem } from './menu-items/menu-item.entity';
import { SettingsModule } from './settings/settings.module';
import { SiteSettings } from './settings/site-settings.entity';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const sslEnabled = config.get<string>('DB_SSL') === 'true';

        return {
          type: 'postgres',
          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: config.get<string>('DB_HOST', 'localhost'),
                port: Number(config.get<string>('DB_PORT', '5432')),
                username: config.get<string>('DB_USER', 'postgres'),
                password: config.get<string>('DB_PASSWORD', ''),
                database: config.get<string>('DB_NAME', 'emarat_menu'),
              }),
          ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
          entities: [User, Category, MenuItem, SiteSettings],
          synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') !== 'false',
        };
      },
    }),
    AuthModule,
    CategoriesModule,
    MenuItemsModule,
    SettingsModule,
    UploadsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
