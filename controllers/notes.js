const Note = require('../models/note')

exports.create = (req, res) => {
  const { id } = req.jwt

  Note({
    belongsTo: id,
    date: req.body.date,
    title: req.body.title,
    text: req.body.text
  }).save()
    .then(note => res.json({ succsess: true, note }))
}

exports.all = (req, res) => {
  const { id } = req.jwt

  const lastUpdate = req.headers['last-update']
                  || req.query.lastUpdate
                  || 0

  Note
    .find({ belongsTo: id, createdAt: { $gt: lastUpdate } })
    .then(notes => res.json({ succsess: true, notes }))
}

exports.update = (req, res) => {
  const { id } = req.jwt

  Note
    .update(
      { belongsTo: id, _id: req.body.id },
      { text: req.body.text, title: req.body.title, date: req.body.date }
    )
    .then(note => res.json({ succsess: true, note }))
}

exports.delete = (req, res) => {
  const { id } = req.jwt

  Note
    .remove({ belongsTo: id, _id: req.body.id })
    .then(result => res.json({ succsess: true }))
}
