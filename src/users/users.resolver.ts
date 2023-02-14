import { Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/auth/decorators';
import { UserType } from './types';

@Resolver(() => UserType)
export class UsersResolver {
  @Public()
  @Query(() => [UserType], { name: 'findAllUsers', description: '123' })
  async findAll() {
    return [
      {
        id: '123',
        email: 'email',
        password: 'password',
    }];
  }
}
