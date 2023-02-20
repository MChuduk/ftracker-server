import { InputType } from '@nestjs/graphql';
import { SignUpLocalInput } from './sign-up-local.input';

@InputType()
export class SignInLocalInput extends SignUpLocalInput {}
