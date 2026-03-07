
"use client"

export const dynamic = "force-dynamic"


import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const kodeBacaList = [
"Z - NORMAL",
"1 - KWH METER TINGGI",
"2 - GANTI KWH METER",
"3 - ANJING GALAK",
"7 - STAN DARI PELANGGAN",
"D - PELANGGAN TIDAK SESUAI RBM",
"E - RUMAH TUTUP",
"F - RUMAH KOSONG",
"I - KWH METER DIDALAM BANGUNAN",
"L - TARIF TIDAK SESUAI",
"M - KWH KURANG TAGIH",
"N - KWH LEBIH TAGIH",
"U - PEMADAMAN",
"W - BENCANA",
"A - KWH METER MACET",
"B - KWH METER MUNDUR",
"C - KWH METER TIDAK ADA",
"H - KWH METER BURAM/PECAH",
"J - SEGEL TIDAK ADA",
"K - MCB PERLU DIPERIKSA",
"X - MIGRASI"
]

export default function UpdatePage() {

  const params = useSearchParams()
  const idpel = params.get("idpel")

  const [user,setUser] = useState<any>(null)
  const [data,setData] = useState<any>(null)

  const [stan,setStan] = useState("")
  const [kode,setKode] = useState("Z - NORMAL")
  const [foto,setFoto] = useState<File | null>(null)

  const [loading,setLoading] = useState(true)
  const [submitting,setSubmitting] = useState(false)

  useEffect(()=>{

    const u = localStorage.getItem("user")

    if(!u){
      window.location.href="/login"
      return
    }

    const parsed = JSON.parse(u)

    setUser(parsed)

    loadCustomer(parsed)

  },[])



  async function loadCustomer(user:any){

    try{

      const res = await fetch("/api/tasks",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          action:"search",
          idpel:idpel,
          rbm:user.RBM
        })
      })

      const result = await res.json()

      if(result.status === "success"){
        setData(result.data)
      }else{
        alert("Customer not found")
        window.location.href="/dashboard"
      }

    }catch(err){
      alert("API error")
    }

    setLoading(false)

  }



  async function submit(){

    if(submitting) return

    if(!stan){
      alert("Stan meter belum diisi")
      return
    }

    if(!foto){
      alert("Foto belum dipilih")
      return
    }

    setSubmitting(true)

    try{

      console.log("Uploading image...")

      const formData = new FormData()
      formData.append("file",foto)

      const upload = await fetch("/api/upload",{
  method:"POST",
  body:formData
})

const text = await upload.text()

console.log("Upload raw response:", text)

let img

try {
  img = JSON.parse(text)
} catch {
  alert("Upload response invalid")
  console.error("Upload returned non JSON:", text)
  setSubmitting(false)
  return
}

      console.log("Upload result:", img)

      if(img.status !== "success"){
        alert("Upload foto gagal")
        setSubmitting(false)
        return
      }

      const kodeValue = kode

      console.log("Sending update:", {
        idpel,
        rbm:user.RBM,
        stan,
        kode:kodeValue,
        foto:img.url
      })

      const update = await fetch("/api/tasks",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          action:"update",
          idpel:idpel,
          rbm:user.RBM,
          stan:stan,
          kode:kodeValue,
          foto:img.url
        })
      })

      const result = await update.json()

      console.log("Update result:", result)

      if(result.status !== "success"){
        alert("Update gagal")
        setSubmitting(false)
        return
      }

      alert("Data berhasil disimpan")

      window.location.href="/dashboard"

    }catch(err){

      console.error(err)
      alert("Submit gagal")

    }

    setSubmitting(false)

  }



  if(loading){
    return(
      <div className="p-6 text-center">
        Loading...
      </div>
    )
  }



  return(

    <div className="p-6 max-w-xl mx-auto space-y-4">

      <h1 className="text-xl font-bold">
        Update Meter
      </h1>


      <div className="bg-white p-4 rounded shadow">

        <p><b>IDPEL:</b> {data.idpel}</p>
        <p><b>NAMA:</b> {data.nama}</p>
        <p><b>TARIF:</b> {data.tarif}</p>
        <p><b>DAYA:</b> {data.daya}</p>

      </div>


      <input
        placeholder="Stan Meter"
        value={stan}
        onChange={(e)=>setStan(e.target.value)}
        className="w-full border p-2 rounded"
      />


      <select
        value={kode}
        onChange={(e)=>setKode(e.target.value)}
        className="w-full border p-2 rounded"
      >

        {kodeBacaList.map((k)=>(
          <option key={k} value={k}>
            {k}
          </option>
        ))}

      </select>


      <input
      type="file"
      accept="image/*"
      capture="environment"
      onChange={(e)=>setFoto(e.target.files?.[0] || null)}
      className="w-full"
      />

      {foto && (
      <img
      src={URL.createObjectURL(foto)}
      className="rounded-lg border mt-3"
      />
      )}


      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">

        <button
        onClick={submit}
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold"
        >
        {submitting ? "Submitting..." : "SUBMIT"}
        </button>

      </div>

      <div className="pb-24"></div>

    </div>

  )

}