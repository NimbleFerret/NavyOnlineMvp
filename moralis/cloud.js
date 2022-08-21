const logger = Moralis.Cloud.getLogger();

Moralis.Cloud.define("printLogs", async (request) => {
    logger.info("Hello World");
});