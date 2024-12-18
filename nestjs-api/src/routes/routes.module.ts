import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MapsModule } from 'src/maps/maps.module';
import { RouteDriverService } from './route-driver/route-driver.service';
import { RouteDriverGateway } from './route-driver/route-driver.gateway';
import { KafkaModule } from 'src/kafka/kafka.module';
import { RoutesConsumer } from './routes.consumer';

@Module({
  imports: [MapsModule, KafkaModule],
  controllers: [RoutesController, RoutesConsumer],
  providers: [RoutesService, PrismaService, RouteDriverService, RouteDriverGateway],
})
export class RoutesModule {}
