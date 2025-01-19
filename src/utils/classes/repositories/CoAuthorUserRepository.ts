import { prisma } from "@/utils/prisma"

export class CoAuthorUserRepository {
  public async fetchUserByFirebaseUid(firebaseUid: string) {
    return await prisma.user.findUnique({
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
    return await prisma.user.create({
      data: {
        email,
        name,
        firebaseUid,
      },
    })
  }

  public async isDuplicateEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })
    return user !== null
  }
}
