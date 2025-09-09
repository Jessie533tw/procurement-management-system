import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as entities from '../entities';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const databaseUrl = configService.get('DATABASE_URL');
  
  if (databaseUrl) {
    // Use DATABASE_URL (e.g., from Zeabur)
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: Object.values(entities),
      synchronize: configService.get('NODE_ENV') !== 'production',
      logging: configService.get('NODE_ENV') === 'development',
      ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
    };
  }
  
  // Use individual environment variables (support both naming conventions)
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST') || configService.get('DATABASE_HOST', 'localhost'),
    port: configService.get('POSTGRES_PORT') || configService.get('DATABASE_PORT', 5432),
    username: configService.get('POSTGRES_USER') || configService.get('DATABASE_USERNAME', 'postgres'),
    password: configService.get('POSTGRES_PASSWORD') || configService.get('DATABASE_PASSWORD', 'password'),
    database: configService.get('POSTGRES_DATABASE') || configService.get('DATABASE_NAME', 'construction_management'),
    entities: Object.values(entities),
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
    ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  };
};