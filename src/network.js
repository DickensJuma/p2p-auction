const Hyperswarm = require("hyperswarm");

class Network {
  constructor() {
    this.swarm = new Hyperswarm();
    this.swarm.on("connection", this.handleConnection.bind(this));
  }

  handleConnection(conn, info) {
    conn.on("data", (data) => {
      // handling incoming data
      console.log("Received:", data.toString());
    });
  }

  async join(topic, options) {
    return new Promise(async (resolve, reject) => {
      const discovery = this.swarm.join(topic, options);
      console.log("Joining network...");
      await discovery.flushed();
      resolve();
      console.log("Joined network");
    });
  }

  broadcast(topic, message) {
    this.swarm.peers.forEach((peer) => {
      peer.on("connection", (conn, info) => {
        conn.write(message);
        conn.end();
      });
    });
  }
}

module.exports = Network;
