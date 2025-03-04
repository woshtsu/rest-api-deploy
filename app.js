const express = require('express')
const movies = require('./movies.json')
const fs = require('node:fs')
const z = require('zod')
const cors = require('cors')
const { title } = require('node:process')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const { error } = require('node:console')

const app = express()
app.use(express.json())
app.use(cors())
app.disable('x_powered-by')

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/movies',(req,res)=>{
  const { genre, search } = req.query
  if (genre) {
    const filterMovies = movies.filter(
      movie =>movie.genre.some(g=> g.toLowerCase()==genre.toLowerCase())
    )
    return res.json(filterMovies)
  }
  return res.json(movies)
})

app.post('/movies', (req, res)=>{
  const result = validateMovie(req.body)
  if(result.error){
    return res.status(400).json({error: result.error.message})
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id',(req,res)=>{
  const { id } = req.params
  const result = validatePartialMovie(req.body)
  const movieIndex = movies.findIndex(movie => movie.id == id)

  if (!result.success){
    res.status(400).json({ error: JSON.parse(result.error.message)})
  }

  if (movieIndex == -1){
    return res.status(404).json({message: 'movie no found'})
  }
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.delete('/movies/:id',(req,res)=>{
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id == id)

  if (movieIndex === -1){
    return res.status(404).json({message:'Page no found'})
  }

  movies.splice(movieIndex, 1)
  return res.json({message:'Movie Deleted'})
})

app.get('/movies/:id',(req,res)=>{
  const { id } = req.params
  const movie = movies.find(movie => movie.id == id)
  if (movie) return res.json(movie)
})



app.use((req, res) => {
  res.status(404);
  try {
      const img = fs.readFileSync('./public/aviso404.svg');
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(img);
  } catch (error) {
      console.error('Error al leer el archivo SVG:', error.message);
      res.status(500).send('Error interno del servidor');
  }
});


module.exports = app;
