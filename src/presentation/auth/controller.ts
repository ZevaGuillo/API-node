import { Request, Response } from "express";

export class AuthController {
    
    constructor(){}

    

    register = (req: Request, res: Response)=>{
        res.json('registro de usuario')
    }

    login = (req: Request, res: Response)=>{
        res.json('login')
    }

    validateEmail = (req: Request, res: Response)=>{
        res.json('validate email')
    }

}