import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/user.dtos';

@Controller('auth')
export class UsersController {
  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    console.log('User created:', body);
  }
}
