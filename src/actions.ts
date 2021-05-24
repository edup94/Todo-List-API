import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Users } from './entities/Users'
import { Exception } from './utils'
import { Todos } from './entities/Todos'

export const createUser = async (req: Request, res:Response): Promise<Response> =>{

	// important validations to avoid ambiguos errors, the client needs to understand what went wrong
	if(!req.body.first_name) throw new Exception("Please provide a first_name")
	if(!req.body.last_name) throw new Exception("Please provide a last_name")
	if(!req.body.email) throw new Exception("Please provide an email")
	if(!req.body.password) throw new Exception("Please provide a password")

	const userRepo = getRepository(Users)
	// fetch for any user with this email
	const user = await userRepo.findOne({ where: {email: req.body.email }})
    if(user) throw new Exception("Users already exists with this email")
    
    const newDefaultTodo = getRepository(Todos).create()
    newDefaultTodo.label = "Example"
    newDefaultTodo.done = false;

    //Creo un usuario
    const newUser = userRepo.create() 
    newUser.first_name = req.body.first_name
    newUser.last_name = req.body.last_name
    newUser.email = req.body.email
    newUser.password = req.body.password
    newUser.todo = [newDefaultTodo]
	const results = await getRepository(Users).save(newUser); //Grabo el nuevo usuario 
	return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> =>{
		const users = await getRepository(Users).find({ relations: ["todo"] });
		return res.json(users);
}

export const getUser = async (req: Request, res: Response): Promise<Response> =>{
		const users = await getRepository(Users).findOne(req.params.id);
		return res.json(users);
}

export const updateUser = async (req: Request, res:Response): Promise<Response> =>{
    const userRepo = getRepository(Users) // I need the userRepo to manage users

    // find user by id
	const user = await userRepo.findOne(req.params.id); 
	if(!user) throw new Exception("No User found");
	
    // better to merge, that way we can do partial update (only a couple of properties)
	userRepo.merge(user, req.body); 
	const results = await userRepo.save(user);  // commit to DM	
	return res.json(results);
}

export const deleteUsers = async (req: Request, res: Response): Promise<Response> =>{
    const users = await getRepository(Users).findOne(req.params.id);
    if(!users) {
        return res.json({ msg :"This user doesn't exist."});
    }else {
    const users = await getRepository(Users).delete(req.params.id);
		return res.json(users);
    }	
}

export const createTodo = async (req: Request, res:Response): Promise<Response> =>{
    if(!req.body.label) throw new Exception("Please provide a label")
    if(!req.body.done) throw new Exception("Please provide a state")
    
    //creo nuevo Todo
    const newTodo = getRepository(Todos).create()
    newTodo.label = req.body.label
    newTodo.done = req.body.done
    const results = await getRepository(Todos).save(newTodo); //Grabo el nuevo Todo
	return res.json(results);
}

export const getTodos = async (req: Request, res: Response): Promise<Response> =>{
		const todos = await getRepository(Todos).find({ relations: ["user"] });
		return res.json(todos);
}

export const getTodo = async (req: Request, res: Response): Promise<Response> =>{
		const todos = await getRepository(Todos).findOne(req.params.id);
		return res.json(todos);
}

export const updateTodo = async (req: Request, res:Response): Promise<Response> =>{
    const todoRepo = getRepository(Todos) // I need the todoRepo to manage todos

    // find todo by id
	const todo = await todoRepo.findOne(req.params.id); 
	if(!todo) throw new Exception("No Todo found");
	
    // better to merge, that way we can do partial update (only a couple of properties)
	todoRepo.merge(todo, req.body); 
	const results = await todoRepo.save(todo);  // commit to DM	
	return res.json(results);
}

export const deleteTodos = async (req: Request, res: Response): Promise<Response> =>{
    const todos = await getRepository(Todos).findOne(req.params.id);
    if(!todos) {
        return res.json({ msg :"This todo doesn't exist."});
    }else {
    const todos = await getRepository(Todos).delete(req.params.id);
		return res.json(todos);
    }	
}