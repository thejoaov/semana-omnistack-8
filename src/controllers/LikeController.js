const Dev = require('../models/Dev')
module.exports = {
  async store(req, res) {
    try {
      const { user } = req.headers
      const { devId } = req.params
      const loggedDev = await Dev.findById(user)
      const targetDev = await Dev.findById(devId)

      if (!targetDev) {
        return res.status(400).json({ error: 'Dev not exists' })
      }

      if (targetDev.likes.includes(loggedDev._id)) {
        console.log('kkkKKKKK DEU MATCH kKKkKKK')
      }

      if (loggedDev.likes.includes(targetDev._id)) {
        console.log('Sossega aí o dedo do like amigão.')
        return res.status(400).json({ error: 'Already Liked' })
      }

      loggedDev.likes.push(targetDev._id)

      await loggedDev.save()

      return res.json(loggedDev)
    } catch (error) {
      return res.status(400).json({ Error: error.message })
    }
  }
}
