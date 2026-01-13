import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { PostModule } from './modules/post/post.module';
import { TagModule } from './modules/tag/tag.module';
import { VisitorModule } from './modules/visitor/visitor.module';
import { HealthModule } from './modules/health/health.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    PostModule,
    TagModule,
    VisitorModule,
    HealthModule,
    UploadModule,
  ],
})
export class AppModule {}
