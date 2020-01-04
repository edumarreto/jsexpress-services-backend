import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "./logger.js";
import helmet from "helmet";
import compression from "compression";
import expressValidator from "express-validator";
import multer from "multer";


module.exports = app => {

	const cfg = app.libs.config;


	app.set("port", 3000);

	app.enable('trust proxy');

	app.use(morgan("common", {
		stream: {
			write: (message) => {
				logger.info(message);
			}
		}
	}));


	//Middleware CORS, origin configuration
	app.use(cors({
		origin: cfg.whiteList,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"]
	}));

	//Security middlewares -- Content Security Policy, X-Powered-By, HTTP Public Key Pinning,
	//HTTP Strict Transport Security, X-Download-Options, client-side caching,sniffing, ClickJacking e XSS
	app.use(helmet());

	//payload compression -- GZIP
	app.use(compression());

	//handle JSON spaces on payloads
	app.set("json spaces", 4);

	//BodyParser to handle JSON payloads
	app.use(bodyParser.json());

	//Library to validate payloads
	app.use(expressValidator());

	//User Company authentication
	app.use(app.auth.initialize());


	//sample exclusion, deleting req.body.id fields from payload
	app.use((req, res, next) => {
		delete req.body.id;
		next();
	});



	app.use(express.static("public"));
};