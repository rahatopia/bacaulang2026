"use client"

import { useEffect, useState } from "react"

type Task = {
  idpel: string
  nama: string
  tarif: string
  daya: number
}

export default function Dashboard() {

  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {

    const data = localStorage.getItem("user")

    if (!data) {
      window.location.href = "/login"
      return
    }

    const u = JSON.parse(data)
    setUser(u)

    loadTasks(u.RBM)

  }, [])

  async function loadTasks(rbm: string) {

    try {

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "tasks",
          rbm: rbm
        })
      })

      const text = await res.text()

      if (!text) {
        setError("Empty API response")
        setLoading(false)
        return
      }

      let data

      try {
        data = JSON.parse(text)
      } catch {
        console.error("Invalid JSON:", text)
        setError("Invalid JSON response")
        setLoading(false)
        return
      }

      console.log("API response:", data)

      if (Array.isArray(data)) {
        setTasks(data)
      }
      else if (data.data && Array.isArray(data.data)) {
        setTasks(data.data)
      }
      else if (data.status === "not_found") {
        setTasks([])
      }
      else {
        setError("Unexpected API response")
      }

    } catch (err) {

      console.error(err)
      setError("API connection error")

    }

    setLoading(false)

  }

  if (!user) return null

  const totalTasks = tasks.length

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold text-center">
          BACA ULANG UP3 GARUT 2026
        </h1>

        <div className="bg-white p-4 rounded shadow">

         
          <p><b>RBM:</b> {user.RBM}</p>

        </div>

        <div className="bg-blue-100 p-4 rounded shadow text-center">

          <p className="text-lg font-semibold">Belum Baca</p>
          <p className="text-3xl font-bold">{totalTasks}</p>

        </div>

        <div className="space-y-3">

          {loading && (
            <div className="text-center text-gray-500">
              Loading tasks...
            </div>
          )}

          {error && (
            <div className="text-red-600 text-center">
              {error}
            </div>
          )}

          {!loading && tasks.length === 0 && !error && (
            <div className="text-center text-gray-500">
              Tidak ada tugas tersisa
            </div>
          )}

          {tasks.map((task) => (

            <div
              key={task.idpel}
              className="bg-white border rounded p-4 flex justify-between items-center shadow-sm"
            >

              <div>

                <p className="font-bold">
                  {task.idpel}
                </p>

                <p>
                  {task.nama}
                </p>

                <p className="text-sm text-gray-500">
                  {task.tarif} / {task.daya}
                </p>

              </div>

              <button
                onClick={() => window.location.href = `/update?idpel=${task.idpel}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                UPDATE
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}