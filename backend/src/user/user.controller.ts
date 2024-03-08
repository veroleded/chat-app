import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './responses';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from '@auth/interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  async findOne(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);

    if (!user || !user.isActivated) {
      throw new NotFoundException('User is not found');
    }

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
