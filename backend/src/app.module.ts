import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_NAME', 'emarat_menu'),
        entities: [User, Category, MenuItem, SiteSettings],
        synchronize: true,
      }),
    }),
    AuthModule,
    CategoriesModule,
    MenuItemsModule,
    SettingsModule,
    UploadsModule,
  ],
})
export class AppModule {}
