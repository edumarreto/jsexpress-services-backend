import cluster from "cluster";
import os from "os";
import logger from "./libs/logger.js";


const CPUS = os.cpus();

if (cluster.isMaster) {
	CPUS.forEach(() => cluster.fork());
	cluster.on("listening", worker => {
		console.log("Cluster %d connected", worker.process.pid);
		logger.info("Cluster %d connected", worker.process.pid);
	});
	cluster.on("disconnect", worker => {
		console.log("Cluster %d disconnected", worker.process.pid);
		logger.info("Cluster %d disconnected",  worker.process.pid);
	});
	cluster.on("exit", worker => {
		console.log("Cluster %d on exit status", worker.process.pid);
		logger.info("Cluster %d on exit status",  worker.process.pid);
		cluster.fork();
		// On node failure, a new node is launch
	});
	} else {
	require("./index.js");
}