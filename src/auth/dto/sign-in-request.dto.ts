import { InputType, OmitType } from '@nestjs/graphql';
import { SignUpRequestDto } from './sign-up-request.dto';

@InputType()
export class SignInRequestDto extends OmitType(SignUpRequestDto, [
  'displayName',
]) {}
