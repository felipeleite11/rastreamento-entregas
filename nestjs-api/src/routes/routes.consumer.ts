import { Controller, Logger } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { RoutesService } from "./routes.service";
import { KafkaContext } from "src/kafka/kafka-context";

@Controller()
export class RoutesConsumer {
	private logger = new Logger(RoutesConsumer.name)

	constructor(private routeService: RoutesService) {}

	@MessagePattern('freight')
	updateFreight(payload: KafkaContext) {
		this.logger.log(`Receiving message from topic ${payload.topic}...`)

		const { route_id, amount } = payload.messageValue

		this.routeService.update(route_id, { freight: amount })
	}
}