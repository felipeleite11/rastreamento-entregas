import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MapsModule } from 'src/maps/maps.module';
import { RouteDriverService } from './route-driver/route-driver.service';

@Module({
  imports: [MapsModule],
  controllers: [RoutesController],
  providers: [RoutesService, PrismaService, RouteDriverService],
})
export class RoutesModule {}
