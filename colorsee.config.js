// pm2 configuration file
module.exports = {
	apps: [
		{
			name: "ColorSee",
			script: "./index.js",
			watch: true,
			instances: 1,
			kill_timeout: 3000,
		},
	],
};
