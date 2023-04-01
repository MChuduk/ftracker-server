import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsSecurePassword } from '../decorators';

@InputType()
export class SignUpRequestDto {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly displayName: string;

  @Field()
  @IsEmail()
  @MinLength(10)
  @MaxLength(50)
  readonly email: string;

  @Field()
  @MinLength(10)
  @MaxLength(50)
  @IsSecurePassword()
  readonly password: string;
}
