import { AuthController } from './auth/dto/auth.controller';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { PreAuthMiddleware } from './common/middlewares/preAuth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI as string,{
          serverSelectionTimeoutMS: 5000,
          onConnectionCreate(connection){
            connection.on('connected',() =>
               console.log('MongoDB connected Successfully')
            );
          },
    } ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule  implements NestModule{

  configure(consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware, PreAuthMiddleware).forRoutes(AuthController);
  }

}
