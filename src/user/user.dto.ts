import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsValidPassword } from '../utils/validPassword';

export class CreateUserDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @IsValidPassword({ message: 'Password too weak' })
  password: string;
}
