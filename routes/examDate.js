const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET exam date
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT exam_date FROM exam_date LIMIT 1')
    res.json({ examDate: result.rows[0]?.exam_date || null })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update exam date
router.put('/', async (req, res) => {
  const { examDate } = req.body
  try {
    const exists = await pool.query('SELECT id FROM exam_date LIMIT 1')
    if (exists.rows.length > 0) {
      await pool.query('UPDATE exam_date SET exam_date=$1 WHERE id=$2', [examDate, exists.rows[0].id])
    } else {
      await pool.query('INSERT INTO exam_date (exam_date) VALUES ($1)', [examDate])
    }
    res.json({ examDate })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
