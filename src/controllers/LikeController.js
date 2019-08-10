const Dev = require("../models/Dev");
module.exports = {
  async store(req, res) {
    try {
      console.log(req.io, req.connectedUsers);
      const { user } = req.headers;
      const { devId } = req.params;
      const loggedDev = await Dev.findById(user);
      const targetDev = await Dev.findById(devId);

      if (!targetDev) {
        return res.status(400).json({ error: "Dev not exists" });
      }

      if (targetDev.likes.includes(loggedDev._id)) {
        const loggedSocket = req.connectedUsers[user];
        const targetSocket = req.connectedUsers[devId];
        if (loggedSocket) {
          // armazenar depois os matchs em outra collection no mongodb
          req.io.to(loggedSocket).emit("match", targetDev);
        }
        if (targetSocket) {
          // armazenar depois os matchs em outra collection no mongodb
          req.io.to(targetSocket).emit("match", loggedDev);
        }
      }

      if (loggedDev.likes.includes(targetDev._id)) {
        console.log("Sossega aí o dedo do like amigão.");
        return res.status(400).json({ error: "Already Liked" });
      }

      loggedDev.likes.push(targetDev._id);

      await loggedDev.save();

      return res.json(loggedDev);
    } catch (error) {
      return res.status(400).json({ Error: error.message });
    }
  },
};
