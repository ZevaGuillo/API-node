import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    const authService = new AuthService();
    const controller = new AuthController(authService);

    // Definir las rutas
    router.use('/login', controller.login );
    router.use('/register', controller.register );
    router.use('/validate-email/:token', controller.validateEmail );



    return router;
  }


}

