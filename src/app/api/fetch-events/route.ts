import { NextResponse } from "next/server"

export async function GET() {
    const response = {"message": "hello world"};
    return NextResponse.json(response);
}