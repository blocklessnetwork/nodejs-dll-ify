process.on("message", function (msg, handle) {
  process.send(msg);
  process.exit(0);
});
