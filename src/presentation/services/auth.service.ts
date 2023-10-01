import { JwtAdapter, bcryptAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto } from '../../domain';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';

export class AuthService {
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const exsitUser = await UserModel.findOne({ email: registerUserDto.email });
        if (exsitUser) throw CustomError.badRequest('User already exists');

        try {

            const user = new UserModel(registerUserDto);

            // encryp password
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();
            // JWT

            // Send email

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return { user: userEntity, token: 'token' };

        } catch (error) {
            throw CustomError.internal(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('User not exists');

        // compare password
        const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password);

        if (!isMatch) throw CustomError.badRequest('Password is not valid');

        // JWT

        const { password, ...userEntity } = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({ id: userEntity.id, role: userEntity.role });
        if(!token) throw CustomError.internal('Error generating token')

        return { user: userEntity, token: token };

    }

}