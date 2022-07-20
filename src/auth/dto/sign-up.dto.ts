import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsSecurePassword } from '../decorators';

export class SignupDto {
  @IsEmail()
  @MinLength(10)
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50)
  @IsSecurePassword()
  password: string;
}
