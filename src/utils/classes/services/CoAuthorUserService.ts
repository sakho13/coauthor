import { CoAuthorError } from "../CoAuthorError"
import { CoAuthorUserRepository } from "../repositories/CoAuthorUserRepository"

type UserData = {
  username: string
  email: string
}

export class CoAuthorUserService {
  private userRepository: CoAuthorUserRepository

  private _userId: string = ""

  constructor(userRepository: CoAuthorUserRepository) {
    this.userRepository = userRepository
  }

  public async registerAndLoginByFirebaseUid(
    firebaseUid: string,
    userData: UserData,
  ) {
    const checkRegisteredUser =
      await this.userRepository.fetchUserByFirebaseUid(firebaseUid)

    if (checkRegisteredUser) {
      this._userId = checkRegisteredUser.id
      return {
        status: "EXISTS",
        user: checkRegisteredUser,
      } as const
    }

    const isDuplicateEmail = await this.userRepository.isDuplicateEmail(
      userData.email,
    )
    if (isDuplicateEmail) {
      throw new CoAuthorError({
        code: "DUPLICATE_EMAIL",
        message: "このメールアドレスは既に登録されています。",
      })
    }

    const createdUser = await this.userRepository.createUserByFirebase(
      firebaseUid,
      userData.email,
      userData.username,
    )

    this._userId = createdUser.id

    return {
      status: "CREATED",
      user: createdUser,
    } as const
  }

  public async fetchUserByFirebaseUid(firebaseUid: string) {
    const user = await this.userRepository.fetchUserByFirebaseUid(firebaseUid)
    if (!user) {
      throw new CoAuthorError({
        code: "USER_NOT_FOUND",
        message: "ユーザが見つかりませんでした。",
      })
    }
    return user
  }

  public quitUser() {}

  public get userId() {
    return this._userId
  }
}
