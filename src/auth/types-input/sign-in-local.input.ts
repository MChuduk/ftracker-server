import { InputType, OmitType } from '@nestjs/graphql';
import { SignUpLocalInput } from './sign-up-local.input';

@InputType()
export class SignInLocalInput extends OmitType(SignUpLocalInput, [
  'displayName',
]) {}
