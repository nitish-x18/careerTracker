import 'dotenv/config'
import app from './app.js'

dotenv.config();

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
