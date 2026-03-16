//src/app/api/books/route.js
export async function GET(req) {

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`
  )

  const data = await res.json()

  return Response.json(data.items)
}