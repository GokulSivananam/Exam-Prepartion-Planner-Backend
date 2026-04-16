const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/exam-date', require('./routes/examDate'))
app.use('/api/monthly-plan', require('./routes/monthlyPlan'))
app.use('/api/weekly-schedule', require('./routes/weeklySchedule'))
app.use('/api/daily-tracker', require('./routes/dailyTracker'))
app.use('/api/revision-tracker', require('./routes/revisionTracker'))

app.get('/', (req, res) => res.json({ message: 'Exam Prep API running' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
