import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Application Tracker API is running!',
  })
})

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
  })
})

export default app