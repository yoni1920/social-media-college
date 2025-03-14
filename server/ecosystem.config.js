module.exports = {
  apps: [
    {
      name: "wesocial.io",
      script: "./dist/main.js",
      node_args: "--env-file=.env.production",
    },
  ],
};
