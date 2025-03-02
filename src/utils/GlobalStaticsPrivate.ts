type GlobalStaticsType = {
  DATABASE_URL: string
  NEXT_PRIVATE_FIREBASE_PRIVATE_KEY: string
}

export const GLOBAL_STATICS_PRIVATE = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  NEXT_PRIVATE_FIREBASE_PRIVATE_KEY:
    process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY?.replaceAll("\\n", "\n") ??
    "",
} satisfies GlobalStaticsType
