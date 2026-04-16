const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET all
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM monthly_plan ORDER BY id')
    // Map snake_case to camelCase for frontend
    const rows = result.rows.map(r => ({
      id: r.id,
      subject: r.subject,
      topic: r.topic,
      startDate: r.start_date,
      targetDate: r.target_date,
      status: r.status
    }))
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create
router.post('/', async (req, res) => {
  const { subject, topic, startDate, targetDate, status } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO monthly_plan (subject, topic, start_date, target_date, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [subject, topic, startDate, targetDate, status || 'pending']
    )
    const r = result.rows[0]
    res.status(201).json({ id: r.id, subject: r.subject, topic: r.topic, startDate: r.start_date, targetDate: r.target_date, status: r.status })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update
router.put('/:id', async (req, res) => {
  const { subject, topic, startDate, targetDate, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE monthly_plan SET subject=$1, topic=$2, start_date=$3, target_date=$4, status=$5 WHERE id=$6 RETURNING *',
      [subject, topic, startDate, targetDate, status, req.params.id]
    )
    const r = result.rows[0]
    res.json({ id: r.id, subject: r.subject, topic: r.topic, startDate: r.start_date, targetDate: r.target_date, status: r.status })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM monthly_plan WHERE id=$1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
