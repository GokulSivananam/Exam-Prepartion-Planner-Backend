const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM weekly_schedule ORDER BY id')
    const rows = result.rows.map(r => ({
      id: r.id, day: r.day, subject: r.subject,
      topic: r.topic, hours: parseFloat(r.hours), completed: r.completed
    }))
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { day, subject, topic, hours, completed } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO weekly_schedule (day, subject, topic, hours, completed) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [day, subject, topic, hours, completed || false]
    )
    const r = result.rows[0]
    res.status(201).json({ id: r.id, day: r.day, subject: r.subject, topic: r.topic, hours: parseFloat(r.hours), completed: r.completed })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { day, subject, topic, hours, completed } = req.body
  try {
    const result = await pool.query(
      'UPDATE weekly_schedule SET day=$1, subject=$2, topic=$3, hours=$4, completed=$5 WHERE id=$6 RETURNING *',
      [day, subject, topic, hours, completed, req.params.id]
    )
    const r = result.rows[0]
    res.json({ id: r.id, day: r.day, subject: r.subject, topic: r.topic, hours: parseFloat(r.hours), completed: r.completed })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM weekly_schedule WHERE id=$1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
