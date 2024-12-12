import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MapsModule } from 'src/maps/maps.module';
import { RouteDriverService } from './route-driver/route-driver.service';
import { RouteDriverGateway } from './route-driver/route-driver.gateway';

@Module({
  imports: [MapsModule],
  controllers: [RoutesController],
  providers: [RoutesService, PrismaService, RouteDriverService, RouteDriverGateway],
})
export class RoutesModule {}
