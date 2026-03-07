"use client"

import { Suspense } from "react"
import UpdateClient from "./updateClient"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <UpdateClient />
    </Suspense>
  )
}