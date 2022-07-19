import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsSecurePassword } from '../decorators/secure-password.decorator';

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
