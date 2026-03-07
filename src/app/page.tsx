"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import users from "@/data/users.json"

const quotes = [
  {
    text: "Sesungguhnya Allah mencintai seseorang yang apabila bekerja, ia menyempurnakan pekerjaannya.",
    author: "Hadis Riwayat Thabrani"
  },
  {
    text: "Setiap kalian adalah pemimpin dan setiap kalian akan dimintai pertanggungjawaban atas yang dipimpinnya.",
    author: "Hadis Riwayat Bukhari & Muslim"
  },
  {
    text: "Pedagang yang jujur dan amanah akan bersama para nabi, orang-orang yang benar, dan para syuhada.",
    author: "Hadis Riwayat Tirmidzi"
  },
  {
    text: "Tidak beriman seseorang yang tidak amanah, dan tidak sempurna agama bagi yang tidak menepati janji.",
    author: "Hadis Riwayat Ahmad"
  },
  {
    text: "Hisablah dirimu sebelum kamu dihisab, dan timbanglah amalmu sebelum ditimbang.",
    author: "Umar bin Khattab RA"
  },
  {
    text: "Kejujuran membawa kepada kebaikan, dan kebaikan membawa ke surga.",
    author: "Hadis Riwayat Bukhari & Muslim"
  },
  {
    text: "Bekerjalah untuk duniamu seakan-akan kamu hidup selamanya, dan beramallah untuk akhiratmu seakan-akan kamu mati besok.",
    author: "Ali bin Abi Thalib RA"
  }
]

export default function Home() {

  const router = useRouter()

  const [rbm,setRbm] = useState("")
  const [password,setPassword] = useState("")

  const quote = quotes[Math.floor(Math.random()*quotes.length)]

  function login(){

    if(!rbm){
      alert("RBM harus diisi")
      return
    }

    if(password !== "ptmiu123"){
      alert("Password salah")
      return
    }

    const user = {
      RBM: rbm.toUpperCase()
    }

    localStorage.setItem("user", JSON.stringify(user))

    router.push("/dashboard")

  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 animate-gradient">

      <div className="bg-white/90 backdrop-blur shadow-xl rounded-xl p-8 w-full max-w-md space-y-6">

        <h1 className="text-2xl font-bold text-center text-gray-800">
          BACA ULANG UP3 GARUT 2026
        </h1>

        <div className="text-center text-gray-600 italic text-sm leading-relaxed">

          "{quote.text}"

          <div className="mt-2 not-italic text-gray-500">
            — {quote.author}
          </div>

        </div>

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
          onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          LOGIN
        </button>

      </div>

      <style jsx>{`
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradientMove 12s ease infinite;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

    </div>

  )

}