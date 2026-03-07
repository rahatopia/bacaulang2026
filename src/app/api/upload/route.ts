import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({
        status: "error",
        message: "No file uploaded"
      })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const uploadPreset = "baca-ulang"

    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", uploadPreset)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data
      }
    )

    const result = await res.json()

    console.log("Cloudinary response:", result)

    if (!result.secure_url) {
      return NextResponse.json({
        status: "error",
        message: "Upload succeeded but URL missing",
        raw: result
      })
    }

    return NextResponse.json({
      status: "success",
      url: result.secure_url
    })

  } catch (err: any) {

    console.error("Upload error:", err)

    return NextResponse.json({
      status: "error",
      message: err.message
    })

  }

}