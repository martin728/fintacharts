const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/identity"
    ],
    "target": "https://platform.fintacharts.com",
    "secure": false,
    "changeOrigin": true
  },
];

module.exports = PROXY_CONFIG;
