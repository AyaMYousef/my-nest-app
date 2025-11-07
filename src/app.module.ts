import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

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
export class AppModule {}
