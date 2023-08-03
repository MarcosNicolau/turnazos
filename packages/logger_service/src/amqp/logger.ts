import { LoggerLevels, LoggerParams } from "types/logger";
import { AMQP_QUEUES, AMQP_EXCHANGES } from "../constants/amqp";
import { Channel, ConsumeMessage } from "amqplib";
import { logger } from "config/logger";
import Joi from "joi";

const loggerLevelsValidation = Joi.string().valid(
	"error",
	"info",
	"silly",
	"http",
	"warn",
	"debug",
	"verbose"
);

const loggerConsumer = (msg: ConsumeMessage, channel: Channel) => {
	const { level, message, stack, description, httpCode }: LoggerParams = JSON.parse(
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
	logger[level](log, { stack, httpCode, description });

	//Acknowledge consumer
	channel.ack(msg);
};

export const createLoggerConsumer = async (channel: Channel) => {
	//Assert direct logger exchange
	await channel.assertExchange(AMQP_EXCHANGES.logger, "direct", {
		durable: false,
	});
	//We want to have a separate queue for the error
	await channel.assertQueue(AMQP_QUEUES.logger.error, { autoDelete: false, durable: true });
	//Bind the queue to the exchange
	await channel.bindQueue(AMQP_QUEUES.logger.error, AMQP_EXCHANGES.logger, "error");
	//For the rest of the log levels, we don't need a durable queue, since the severity of the logs is not so important and the queue is not durable for better performance
	const assertion = await channel.assertQueue("", { durable: false, exclusive: true });
	//So we bind all the logging levels patterns to the same queue
	(<LoggerLevels[]>["debug", "http", "info", "silly", "verbose", "warn"]).forEach(
		async (level) => {
			await channel.bindQueue(assertion.queue, AMQP_EXCHANGES.logger, level);
		}
	);
	//Consume the queues
	channel.consume(AMQP_QUEUES.logger.error, (msg) => {
		if (!msg) return;
		loggerConsumer(msg, channel);
	});
	channel.consume(assertion.queue, (msg) => {
		if (!msg) return;
		loggerConsumer(msg, channel);
	});
};
