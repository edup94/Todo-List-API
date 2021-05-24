import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Users } from './entities/Users'
import { Exception } from './utils'
import { Todos } from './entities/Todos'

export const createUser = async (req: Request, res:Response): Promise<Response> =>{

	if(!req.body.first_name) throw new Exception("Please provide a first_name")
	if(!req.body.last_name) throw new Exception("Please provide a last_name")
	if(!req.body.email) throw new Exception("Please provide an email")
	if(!req.body.password) throw new Exception("Please provide a password")

	const userRepo = getRepository(Users)
	const user = await userRepo.findOne({ where: {email: req.body.email }})
    if(user) throw new Exception("Users already exists with this email")
    
    const newDefaultTodo = getRepository(Todos).create()
    newDefaultTodo.label = "Example"
    newDefaultTodo.done = false;

    //Create a new user
    const newUser = userRepo.create() 
    newUser.first_name = req.body.first_name
    newUser.last_name = req.body.last_name
    newUser.email = req.body.email
    newUser.password = req.body.password
    newUser.todo = [newDefaultTodo]
	const results = await userRepo.save(newUser) //Grabo el nuevo usuario 
	return res.json(results);
}

    //Find all users
export const getUsers = async (req: Request, res: Response): Promise<Response> =>{
        const users = await getRepository(Users).find({ relations: ["todo"] });
		return res.json(users);
}

    //Find user by id
export const getUser = async (req: Request, res: Response): Promise<Response> =>{
        const users = await getRepository(Users).findOne(req.params.id);
        if(!users) throw new Exception("User doesn't exist.");
		return res.json(users);
}

    //Update a user
export const updateUser = async (req: Request, res:Response): Promise<Response> =>{
    const user = await getRepository(Users).findOne(req.params.id);
	if(user) {
        getRepository(Users).merge(user, req.body);
        const results = await getRepository(Users).save(user);
        return res.json(results);
    }
	return res.status(404).json({msg: "No user found."});
}

    //Delete a user and all his todos
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
    if(!req.body.done) throw new Exception("Please provide a status")
    
    //Create a new Todo and insert into a user
    const user = await getRepository(Users).findOne({ relations: ["todo"], where: {id: req.params.id}});
    if (user) {
        const newTodo = new Todos();
        newTodo.label = req.body.label
        newTodo.done = false
        user.todo.push(newTodo)
        const results = await getRepository(Users).save(user); //Grabo el nuevo Todo
        return res.json(results);   
    }
        return res.json("Todo not found.");
}
    //Get all todos
export const getTodos = async (req: Request, res: Response): Promise<Response> =>{
		const todos = await getRepository(Todos).find({ relations: ["users"] });
		return res.json(todos);
}
    //Get a specific todo by id
export const getTodo = async (req: Request, res: Response): Promise<Response> =>{
        const results = await getRepository(Users).findOne({ relations: ["todo"], where: {id: req.params.id}});
        if (!results) throw new Exception ("User doesn't have any todos.");
		return res.json(results.todo);
}

    //Update a specific todo
export const updateTodo = async (req: Request, res:Response): Promise<Response> =>{
    const todoRepo = getRepository(Todos) 
	const todo = await todoRepo.findOne(req.params.id);
	if(!todo) throw new Exception("No Todo found");
	
	todoRepo.merge(todo, req.body); 
	const results = await todoRepo.save(todo);
	return res.json(results);
}

    //Delete a specific todo
export const deleteTodos = async (req: Request, res: Response): Promise<Response> =>{
    const todo = await getRepository(Todos).findOne(req.params.id);
    if(!todo) {
        return res.json({ msg :"This todo doesn't exist."});
    }else {
    const todo = await getRepository(Todos).delete(req.params.id);
		return res.json(todo);
    }	
}