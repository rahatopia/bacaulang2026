import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const payload = {
      ...body,
      sheetId: process.env.GOOGLE_SHEET_ID
    }

    const res = await fetch(process.env.GOOGLE_SCRIPT_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    const text = await res.text()

    console.log("Apps Script raw response:", text)

    let data

    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({
        status: "error",
        message: "Apps Script returned non-JSON response",
        raw: text
      })
    }

    return NextResponse.json(data)

  } catch (error:any) {

    console.error("API ERROR:", error)

    return NextResponse.json({
      status: "error",
      message: error.message
    })

  }

}