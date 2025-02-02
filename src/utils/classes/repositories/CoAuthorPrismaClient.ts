import { PrismaClient } from "@prisma/client"

export abstract class CoAuthorPrismaClient {
  constructor(protected prisma: PrismaClient) {}
}
