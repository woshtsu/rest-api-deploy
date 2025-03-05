import { Router } from "express"
import { movieController } from "../controllers/movies.js"

export const moviesRouter = Router()

moviesRouter.get('/', movieController.getAll)
moviesRouter.get('/:id', movieController.getById)
moviesRouter.post('/', movieController.create)
moviesRouter.delete('/:id', movieController.delete)
moviesRouter.patch('/:id', movieController.update)