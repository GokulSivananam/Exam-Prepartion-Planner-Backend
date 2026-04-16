const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mock_tests ORDER BY test_date DESC')
    const rows = result.rows.map(r => ({
      id: r.id, testDate: r.test_date, subject: r.subject,
      score: parseFloat(r.score), weakAreas: r.weak_areas
    }))
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { testDate, subject, score, weakAreas } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO mock_tests (test_date, subject, score, weak_areas) VALUES ($1,$2,$3,$4) RETURNING *',
      [testDate, subject, score, weakAreas]
    )
    const r = result.rows[0]
    res.status(201).json({ id: r.id, testDate: r.test_date, subject: r.subject, score: parseFloat(r.score), weakAreas: r.weak_areas })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { testDate, subject, score, weakAreas } = req.body
  try {
    const result = await pool.query(
      'UPDATE mock_tests SET test_date=$1, subject=$2, score=$3, weak_areas=$4 WHERE id=$5 RETURNING *',
      [testDate, subject, score, weakAreas, req.params.id]
    )
    const r = result.rows[0]
    res.json({ id: r.id, testDate: r.test_date, subject: r.subject, score: parseFloat(r.score), weakAreas: r.weak_areas })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM mock_tests WHERE id=$1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
