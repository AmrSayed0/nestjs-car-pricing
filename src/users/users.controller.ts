import {
  Controller,
  Body,
  Patch,
  Param,
  Query,
  Get,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../common';
import { UpdateUserDto, UserResponseDto } from './dtos/user.dtos';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('users')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/:id')
  async findUser(@Param('id') id: string) {
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
  @UseGuards(AuthGuard)
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const { email, password } = body;
    return this.usersService.update(parseInt(id), { email, password });
  }

  // Example: Protected route to update current user's own profile
  @Patch('/me')
  @UseGuards(AuthGuard)
  updateCurrentUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.update(user.id, body);
  }
}
