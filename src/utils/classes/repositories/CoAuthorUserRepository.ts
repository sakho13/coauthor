import { CoAuthorPrismaClient } from "./CoAuthorPrismaClient"
import { PrismaClient } from "@prisma/client"

export class CoAuthorUserRepository extends CoAuthorPrismaClient {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  public async fetchUserByFirebaseUid(firebaseUid: string) {
    return await this.prisma.user.findUnique({
      where: {
        firebaseUid,
      },
    })
  }

  public async createUserByFirebase(
    firebaseUid: string,
    email: string,
    name: string,
  ) {
    return await this.prisma.user.create({
      data: {
        email,
        name,
        firebaseUid,
      },
    })
  }

  public async isDuplicateEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })
    return user !== null
  }
}
