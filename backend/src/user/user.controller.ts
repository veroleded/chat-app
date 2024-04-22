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
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './responses';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from '@auth/interfaces';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('postAvatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: './uploads/images/avatars',
      preservePath: true,
    }),
  )
  async setAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JwtPayload,
  ) {
    console.log(file);
  }
}
