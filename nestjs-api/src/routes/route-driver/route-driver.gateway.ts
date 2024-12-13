import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { RoutesService } from '../routes.service'

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
export class RouteDriverGateway {
	constructor(private routesService: RoutesService) { }

	@SubscribeMessage('client:new-points')
	async handleMessage(client: any, payload: any) {
		const { route_id } = payload

		const route = await this.routesService.findOne(route_id)

		const { steps } = (route.directions as any).routes[0].legs[0]

		for (const step of steps) {
			const { lat: latStart, lng: lngStart } = step.start_location
			const { lat: latEnd, lng: lngEnd } = step.end_location

			client.emit(`server:new-points/${route_id}:list`, {
				route_id,
				lat: latStart,
				lng: lngStart
			})

			client.broadcast.emit('server:new-points:list', {
				route_id,
				lat: latStart,
				lng: lngStart
			})

			await sleep(2000)

			client.emit(`server:new-points/${route_id}:list`, {
				route_id,
				lat: latEnd,
				lng: lngEnd
			})

			client.broadcast.emit('server:new-points:list', {
				route_id,
				lat: latEnd,
				lng: lngEnd
			})

			await sleep(3000)
		}
	}
}

async function sleep(time: number) {
	return new Promise(r => setTimeout(r, time))
}