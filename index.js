import express, { json } from 'express'
import fs from 'node:fs'
import { corsMiddleware } from './middlewares/cors.js'

import { moviesRouter } from './routes/movies.js'


const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x_powered-by')

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.use('/movies',moviesRouter)


app.use((req, res) => {
  try {
      res.status(404);
      const img = fs.readFileSync('./public/aviso404.svg')
      res.setHeader('Content-Type', 'image/svg+xml')
      return res.send(img)
  } catch (error) {
      console.error('Error al leer el archivo SVG:', error.message);
      res.status(500).send('Error interno del servidor');
  }
});


/*const PORT = process.env.PORT ?? 1234
app.listen(PORT,()=>{
  console.log(`server listening on port http://localhost:${PORT}`)
})*/

export default app;
