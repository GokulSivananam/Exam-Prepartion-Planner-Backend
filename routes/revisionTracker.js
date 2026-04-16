const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM revision_tracker ORDER BY id')
    const rows = result.rows.map(r => ({
      id: r.id, topic: r.topic,
      firstRevision: r.first_revision,
      secondRevision: r.second_revision,
      finalRevision: r.final_revision
    }))
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { topic } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO revision_tracker (topic) VALUES ($1) RETURNING *',
      [topic]
    )
    const r = result.rows[0]
    res.status(201).json({ id: r.id, topic: r.topic, firstRevision: r.first_revision, secondRevision: r.second_revision, finalRevision: r.final_revision })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { topic, firstRevision, secondRevision, finalRevision } = req.body
  try {
    const result = await pool.query(
      'UPDATE revision_tracker SET topic=$1, first_revision=$2, second_revision=$3, final_revision=$4 WHERE id=$5 RETURNING *',
      [topic, firstRevision, secondRevision, finalRevision, req.params.id]
    )
    const r = result.rows[0]
    res.json({ id: r.id, topic: r.topic, firstRevision: r.first_revision, secondRevision: r.second_revision, finalRevision: r.final_revision })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM revision_tracker WHERE id=$1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
