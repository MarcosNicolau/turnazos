import { AMQP_QUEUES, AMQP_EXCHANGES } from "../../constants/amqp";
import { Channel } from "amqplib";
import { logger } from "config/logger";
import Joi from "joi";

const loggerLevelsValidation = Joi.string().valid("error", "info", "silly", "http", "warn");

interface MsgContent {
	level: string;
	message: string;
	stack?: string;
	httpCode?: number;
	description?: string;
}

export const createLoggerConsumer = async (channel: Channel) => {
	//Assert direct logger exchange
	await channel.assertExchange(AMQP_EXCHANGES.logger, "direct", {
		durable: false,
	});
	await channel.assertQueue(AMQP_QUEUES.logging, { autoDelete: false, durable: true });
	//Bind the queue to the exchange
	await channel.bindQueue(AMQP_QUEUES.logging, AMQP_EXCHANGES.logger, "");
	//Consume the logging event
	channel.consume(AMQP_QUEUES.logging, (msg) => {
		if (!msg) return;
		const { level, message, stack, description, httpCode }: MsgContent = JSON.parse(
			msg.content.toString() || "{}"
		);
		const appId = msg.properties.appId;
		//Validate the logger levels
		const { error } = loggerLevelsValidation.validate(level);
		if (!appId)
			logger.warn(
				"A service send a log with no APP ID. Please debug and provide a APP ID to identify the service's logs"
			);
		if (error) {
			logger.error(
				`The service ${appId} wanted publish a log event but was rejected because it didn't match the log level schema`
			);
			return channel.ack(msg);
		}
		const log = `${appId?.toUpperCase()}: ${message}`;
		// @ts-expect-error level validation does not work, but we are validating it with JOI.
		logger[level || "info"](log, { stack, httpCode, description });

		//Acknowledge consumer
		channel.ack(msg);
	});
};
