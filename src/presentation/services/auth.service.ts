import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto } from '../../domain';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { EmailService } from './email.service';

export class AuthService {
    constructor(
        private readonly emailService: EmailService
    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const exsitUser = await UserModel.findOne({ email: registerUserDto.email });
        if (exsitUser) throw CustomError.badRequest('User already exists');

        try {

            const user = new UserModel(registerUserDto);

            // encryp password
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();
            // JWT
            const token = await JwtAdapter.generateToken({ id: user.id, role: user.role });
            if(!token) throw CustomError.internal('Error generating token')

            // Send email
            await this.sendEmailValidationLink(user.email);

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return { user: userEntity, token: token };

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

    public validateEmail = async (token: string) => {
        const payload = await JwtAdapter.verifyToken(token);
    }

    private sendEmailValidationLink = async (email: string) => {
        const token = await JwtAdapter.generateToken({ email });
        if(!token) throw CustomError.internal('Error generating token');

        const link = `${envs.WEBSERVER_URL}/auth/validate-email/${token}`;

        const html = `
            <h1>Verify your email</h1>
            <p>Click this link to verify your email: <a href="${link}">${link}</a></p>
        `;

        const options = {
            to: email,
            subject: 'Verify your email',
            htmlBody: html,
        }

        const isSet = await this.emailService.sendEmail(options);
        if(!isSet) throw CustomError.internal('Error sending email');
    }


}