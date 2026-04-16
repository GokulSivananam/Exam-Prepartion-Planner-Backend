const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM daily_tracker ORDER BY date DESC')
    const rows = result.rows.map(r => ({
      id: r.id,
      date: r.date,
      topicsCompleted: r.topics_completed,
      studyHours: parseFloat(r.study_hours),
      difficultTopics: r.difficult_topics,
      notes: r.notes
    }))
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { date, topicsCompleted, studyHours, difficultTopics, notes } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO daily_tracker (date, topics_completed, study_hours, difficult_topics, notes) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [date, topicsCompleted, studyHours, difficultTopics, notes]
    )
    const r = result.rows[0]
    res.status(201).json({ id: r.id, date: r.date, topicsCompleted: r.topics_completed, studyHours: parseFloat(r.study_hours), difficultTopics: r.difficult_topics, notes: r.notes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { date, topicsCompleted, studyHours, difficultTopics, notes } = req.body
  try {
    const result = await pool.query(
      'UPDATE daily_tracker SET date=$1, topics_completed=$2, study_hours=$3, difficult_topics=$4, notes=$5 WHERE id=$6 RETURNING *',
      [date, topicsCompleted, studyHours, difficultTopics, notes, req.params.id]
    )
    const r = result.rows[0]
    res.json({ id: r.id, date: r.date, topicsCompleted: r.topics_completed, studyHours: parseFloat(r.study_hours), difficultTopics: r.difficult_topics, notes: r.notes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM daily_tracker WHERE id=$1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
