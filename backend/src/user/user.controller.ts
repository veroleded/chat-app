import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './responses';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from '@auth/interfaces';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  async getOne(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);

    if (!user || !user.isActivated) {
      throw new NotFoundException('User is not found');
    }

    return new UserResponse(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getCurrentUser(@CurrentUser() payload: JwtPayload) {
    if (payload) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(payload.id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return new UserResponse(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch()
  async updateCurrentUser(
    @CurrentUser() currentUser: JwtPayload,
    @Body() payload: Partial<User>,
  ) {
    const user = await this.userService.update({
      email: currentUser.email,
      ...payload,
    });

    return new UserResponse(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const deletedUser = await this.userService.delete(id, user);

    return new UserResponse(deletedUser);
  }
}
