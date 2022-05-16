import { AMQP_QUEUES, AMQP_EXCHANGES } from "../../constants/amqp";
import { Channel } from "amqplib";
import { logger } from "config/logger";
import Joi from "joi";

const loggerLevelsValidation = Joi.string().valid("error", "info", "silly", "http", "warn");

interface MsgContent {
	level: string;
	message: string;
	serviceName: "user";
	stack: string;
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
		const { level, message, serviceName, stack }: MsgContent = JSON.parse(
			msg.content.toString() || "{}"
		);
		//Validate the logger levels
		const { error } = loggerLevelsValidation.validate(level);
		if (error) {
			logger.error(
				`The service ${msg?.properties.appId} wanted publish a log event but was rejected because it didn't match the log level schema`
			);
			return channel.ack(msg);
		}
		const log = `${serviceName?.toUpperCase()} ${message}`;
		//@ts-expect-error level validation does not work, but we are validating it with JOI.
		logger[level || "info"](log, { stack });
		//Acknowledge consumer
		channel.ack(msg);
	});
};
