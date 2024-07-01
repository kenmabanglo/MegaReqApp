const PROXY_CONFIG = [
  {
    context: [
      "/api",
    ],
    target: "http://210.4.112.18:5556",
    changeOrigin: true,
    secure: false
  }
]

module.exports = PROXY_CONFIG;
