import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Serialize } from '../common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserResponseDto } from '../users/dtos/user.dtos';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/user.entity';

interface SessionData {
  userId?: number | null;
}

@Controller('auth')
@Serialize(UserResponseDto)
export class AuthController {
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
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  getCurrentUserProfile(@CurrentUser() user: User) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
