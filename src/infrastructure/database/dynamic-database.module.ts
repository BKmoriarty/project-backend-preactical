import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ConfigService } from '@nestjs/config';

interface DatabaseConfig {
  name: string; // ชื่อการเชื่อมต่อ (เช่น 'default', 'secondary')
  config: MysqlConnectionOptions;
}

@Module({})
export class DynamicDatabaseModule {
  static forRoot(configs: DatabaseConfig[]): DynamicModule {
    const providers: Provider[] = [];
    const imports: DynamicModule[] = [];

    // สร้าง TypeOrmModule.forRootAsync สำหรับแต่ละฐานข้อมูล
    configs.forEach((dbConfig: DatabaseConfig) => {
      imports.push(
        TypeOrmModule.forRootAsync({
          name: dbConfig.name || 'default',
          useFactory: (
            configService: ConfigService,
          ): MysqlConnectionOptions => ({
            ...dbConfig.config,
            type: dbConfig.config.type || 'mysql',
            host:
              configService.get<string>(
                `${dbConfig.name.toUpperCase()}_DB_HOST`,
              ) || dbConfig.config.host,
            port:
              configService.get<number>(
                `${dbConfig.name.toUpperCase()}_DB_PORT`,
              ) || dbConfig.config.port,
            username:
              configService.get<string>(
                `${dbConfig.name.toUpperCase()}_DB_USERNAME`,
              ) || dbConfig.config.username,
            password:
              configService.get<string>(
                `${dbConfig.name.toUpperCase()}_DB_PASSWORD`,
              ) || dbConfig.config.password,
            database:
              configService.get<string>(
                `${dbConfig.name.toUpperCase()}_DB_NAME`,
              ) || dbConfig.config.database,
            entities: dbConfig.config.entities || [
              __dirname + '/../typeorm/*.entity{.ts,.js}',
            ],
            synchronize: dbConfig.config.synchronize || false,
          }),
          inject: [ConfigService],
        }),
      );
    });

    return {
      module: DynamicDatabaseModule,
      imports,
      providers,
      exports: [TypeOrmModule],
    };
  }
}
