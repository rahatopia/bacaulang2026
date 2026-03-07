"use client"

import { useState } from "react"
import users from "@/data/users.json"

export default function LoginPage() {

  const [rbm, setRbm] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {

    const user = users.find(u => u.RBM === rbm)

    if (!user) {
      alert("RBM tidak ditemukan")
      return
    }

    if (password !== "ptmiu123") {
      alert("Password salah")
      return
    }

    localStorage.setItem("user", JSON.stringify(user))

    window.location.href = "/dashboard"
  }

  return (
    <div className="flex min-h-screen items-center justify-center">

      <div className="w-80 space-y-4">

        <h1 className="text-xl font-bold text-center">
          Login RBM
        </h1>

        <input
          placeholder="RBM"
          value={rbm}
          onChange={(e)=>setRbm(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>

      </div>

    </div>
  )
}