import { movieModel } from "../models/movie.js"
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
export class movieController {

  static async getAll(req,res){
    const {genre} = req.query
    const movies = await movieModel.getAll({genre})
    // que es lo q renderiza
    res.json(movies)
  }
  static async getById(req,res){
    const { id } = req.params
    const movie = await movieModel.getById({id})
    if (movie) return res.json(movie)
    res.status(404).json({message:'Movie no found :('})
  }
  static async create(req, res){
    const result = validateMovie(req.body)
    if(result.error){
      return res.status(400).json({error: result.error.message})
    }
    const newMovie = await movieModel.create({input: result.data})
    res.status(201).json(newMovie)
  }
  static async delete(req,res){
    const { id } = req.params
    const result = await movieModel.delete({id})
    if(result === false){
      return res.status(404).json({message:'No se encontro :c'})
    }
  
    return res.json({message:'Movie Deleted :>'})
  }
  static async update (req,res){
    const result = validatePartialMovie(req.body)
    if (!result.success){
      return res.status(400).json({error: JSON.parse(result.error.message)})
    }
  
    const {id} = req.params
  
    const updateMovie = await movieModel.update({id,input: result.data})
  
    return res.json(updateMovie)
  }
}