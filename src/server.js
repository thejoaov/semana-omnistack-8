const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");
const port = process.env.PORT || 3333;

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

mongoose.connect(
  "mongodb+srv://thejoaov:naruto@cluster0-mgfky.gcp.mongodb.net/omnistack8?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

// armazenar depois os usuarios que deram match num banco de dados
const connectedUsers = {};

io.on("connection", socket => {
  const { user } = socket.handshake.query;
  console.log(user, socket.id);
  connectedUsers[user] = socket.id;
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(port);
