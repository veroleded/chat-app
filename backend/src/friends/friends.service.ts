import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { FriendsRequstStatus } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllFriends(userId: string) {
    const friendsRequests = await this.databaseService.friendRequest.findMany({
      where: {
        OR: [
          { senderId: userId, status: FriendsRequstStatus.ACCEPTED },
          { receiverId: userId, status: FriendsRequstStatus.ACCEPTED },
        ],
      },
    });
  }
}
