const fs = require("fs");

function readFromEnvOrTerminate(key) {
	const value = process.env[key];

	if(typeof(value) !== "string" || value.trim().length === 0) {
		console.error(`The env. variable '${key}' is not set. Terminating...`);

		process.exit(0);
	}

	return value;
}

function readFromFsOrTerminate(value) {
    fs.stat(value, function (err, stat) {
        if (err != null) {
            if (err.code === 'ENOENT') {
                // file does not exist
                console.error(`The file '${value}' does not exist. Terminating...`);
            } else {
                console.error('Some error occured. Error Code: ', err.code);
            }
            process.exit(1);
        }
    });
    return value;
}

module.exports = Object.freeze({
	UMBREL_COOKIE_NAME: "UMBREL_SESSION",

	LOG_LEVEL: process.env.LOG_LEVEL || "info",

	PORT: parseInt(process.env.PORT) || 2000,

	UMBREL_AUTH_SECRET: readFromEnvOrTerminate("UMBREL_AUTH_SECRET"),

	TOR_PATH: process.env.TOR_PATH || "/var/lib/tor",
	APP_DATA_PATH: process.env.APP_DATA_PATH || "/app-data",

	MANAGER_IP: readFromEnvOrTerminate("MANAGER_IP"),
	MANAGER_PORT: parseInt(readFromEnvOrTerminate("MANAGER_PORT")),

	DASHBOARD_IP: readFromEnvOrTerminate("DASHBOARD_IP"),
	DASHBOARD_PORT: parseInt(readFromEnvOrTerminate("DASHBOARD_PORT")),	
	
    HTTPS_KEY_PATH: readFromFsOrTerminate(process.env.HTTPS_KEY_PATH || "/ssl/ssl.key"),
    HTTPS_CERT_PATH: readFromFsOrTerminate(process.env.HTTPS_CERT_PATH || "/ssl/ssl.cert"),
	
});