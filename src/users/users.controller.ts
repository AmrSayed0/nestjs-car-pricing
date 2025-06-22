import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Get,
  Delete,
  NotFoundException,
  Session,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './dtos/user.dtos';

interface SessionData {
  userId?: number | null;
}

@Controller('auth')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: SessionData,
  ) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: SessionData) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: SessionData) {
    session.userId = null;
    return;
  }

  @Get('/whoami')
  whoAmI(@Session() session: SessionData) {
    if (!session.userId) {
      throw new NotFoundException('User ID not found in session');
    }
    return this.usersService.findOne(session.userId);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    // console.log('handler is running');
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const { email, password } = body;
    return this.usersService.update(parseInt(id), { email, password });
  }
}
