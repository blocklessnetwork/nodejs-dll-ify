// fill the ipc incase this runs outside of go executor
process.send = process.send || function () {};

const fnCollection = {};

process.on("message", function (msg, handle) {
  if (msg === "exec") {
    if (fnCollection[msg.id]) {
      fnCollection[msg.id](msg.data);
    } else {
      process.send({ id: msg.id, data: "no such function" });
    }
  }

  process.send(msg);
  process.exit(0);
});

module.exports = {
  export: function (key, fn) {
    fnCollection[key] = fn;
    console.log("exporting");
    return fn;
  },
};
