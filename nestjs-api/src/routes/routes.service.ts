import { Inject, Injectable } from '@nestjs/common';
import * as KafkaLib from '@confluentinc/kafka-javascript'
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectionsService } from 'src/maps/directions/directions.service';
import { directions } from '@googlemaps/google-maps-services-js/dist/directions';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService, 
    private directionService: DirectionsService,
    @Inject('KAFKA_PRODUCER') private kafkaProducer: KafkaLib.KafkaJS.Producer
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    const { available_travel_modes, geocoded_waypoints, routes, request } = await this.directionService.getDirections(
      createRouteDto.source_id,
      createRouteDto.destination_id
    )

    const [legs] = routes[0].legs

    const route = await this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        source: {
          name: legs.start_address,
          location: {
            lat: legs.start_location.lat,
            lng: legs.start_location.lng
          }
        },
        destination: {
          name: legs.end_address,
          location: {
            lat: legs.end_location.lat,
            lng: legs.end_location.lng
          }
        },
        duration: legs.duration.value,
        distance: legs.distance.value,
        directions: JSON.parse(
          JSON.stringify({
            available_travel_modes,
            geocoded_waypoints,
            routes,
            request
          })
        )
      }
    })

    await this.kafkaProducer.send({
      topic: 'route',
      messages: [{
        value: JSON.stringify({
          event: 'RouteCreated',
          id: route.id,
          distance: legs.distance.value,
          directions: legs.steps.reduce((acc, step) => {
            return [
              ...acc,
              {
                lat: step.start_location.lat,
                lng: step.start_location.lng
              },
              {
                lat: step.end_location.lat,
                lng: step.end_location.lng
              }
            ]
          }, [])
        })
      }]
    })

    return route
  }

  findAll() {
    return this.prismaService.route.findMany()
  }

  findOne(id: string) {
    return this.prismaService.route.findUniqueOrThrow({
      where: { id }
    })
  }

  update(id: string, updateRouteDto: UpdateRouteDto) {
    return this.prismaService.route.update({
      where: { id },
      data: updateRouteDto
    })
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
