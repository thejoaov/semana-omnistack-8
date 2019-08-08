const Dev = require('../models/Dev')
module.exports = {
  async store(req, res) {
    console.log(req.params.devId)
    console.log(req.headers.user)

    try {
      const { user } = req.headers
      const { devId } = req.params
      const loggedDev = await Dev.findById(user)
      const targetDev = await Dev.findById(devId)

      if (!targetDev) {
        return res.status(400).json({ error: 'Dev not exists' })
      }

      if (loggedDev.dislikes.includes(targetDev._id)) {
        console.log('Já deu dislike amigão.')
        return res.status(400).json({ error: 'Already Disliked' })
      }

      loggedDev.dislikes.push(targetDev._id)

      await loggedDev.save()

      return res.json(loggedDev)
    } catch (error) {
      return res.status(400).json({ Error: error.message })
    }
  }
}
