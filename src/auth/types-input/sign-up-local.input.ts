import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsSecurePassword } from '../decorators';

@InputType()
export class SignUpLocalInput {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  displayName: string;

  @Field()
  @IsEmail()
  @MinLength(10)
  @MaxLength(50)
  email: string;

  @Field()
  @MinLength(10)
  @MaxLength(50)
  @IsSecurePassword()
  password: string;
}
