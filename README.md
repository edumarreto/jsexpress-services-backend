**

# Node Express - Backend Services - edumarreto


## Description

Sample NodeJS Express environment, with JavaScript and Babel lib.  The sample backend application represents a database schema with 3 entities: User, Company and User Company (as User and Company have a NxM relation).

As backend features:

 - Authentication sample with passport library;
 - Password encryption with Bcrypt library;
 - Security components with CORS control, Content Security Policy, X-Powered-By, HTTP Public Key Pinning, HTTP Strict Transport Security, X-Download-Options, client-side caching, sniffing, ClickJacking and XSS;
 - MySQL database ORM with Sequelize;
 - Application logging with Morgan lib;
 - Custom User login route;
 - Custom Business Error Handling;
 - Custom external API requests;
 - Documentation based on annotations;
 - Container based setup.

## Pre-requirements

 - Docker setup;
 - MySQL setup;

## Execution

    npm start

