import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json(
    {
      status: "OK",
      message: "Hello! Let's write with me!",
    },
    { status: 200 },
  )
}
