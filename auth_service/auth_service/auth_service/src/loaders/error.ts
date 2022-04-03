export const processErrorsLoaders = () => {
	// get the unhandled rejection and throw it to another fallback handler we already have.
	process.on("unhandledRejection", (error) => {
		throw error;
	});
	//TODO publish an event to the logger service
	process.on("uncaughtException", (error) => {
		console.error(`uncaught exception ${JSON.stringify(error)}`);
	});
};
