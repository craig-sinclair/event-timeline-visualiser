import { NextResponse } from "next/server"

export async function GET(timelineID?: String) {

    if (!timelineID) {
        const response = {
            "message": "No timeline ID provided."
        };
        return NextResponse.json(response);
    }
    const response = {"message": `Given timelineID: ${timelineID}`};
    return NextResponse.json(response);
}