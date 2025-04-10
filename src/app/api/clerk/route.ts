import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json()
  console.log(payload)
}

export async function GET() {
  return Response.json({ message: 'Hello World!' })
}