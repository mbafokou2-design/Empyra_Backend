const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
const dotenv   = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('API is running...')
})

/* ── Routes ── */
app.use('/api/auth',         require('./routes/authRoutes'))
app.use('/api/users',        require('./routes/userRoutes'))
app.use('/api/services',     require('./routes/serviceRoutes'))
app.use('/api/blog',         require('./routes/blogRoutes'))
app.use('/api/actualite',    require('./routes/actualiteRoutes'))
app.use('/api/intelligence', require('./routes/intelligenceRoutes'))
app.use('/api/stats',        require('./routes/statsRoutes'))        // ← NEW

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})