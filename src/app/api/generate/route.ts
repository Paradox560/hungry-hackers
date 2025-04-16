import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Parse the JSON body from the request
        const body = await req.json();

        // Send body to Flask API
        const response = await fetch('http://127.0.0.1:5000/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Receive response
        const data = await response.json();
        return NextResponse.json({ data: data, status: response.status });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}