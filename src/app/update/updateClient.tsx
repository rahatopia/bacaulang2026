"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import imageCompression from "browser-image-compression"

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

export default function UpdateClient() {

  const router = useRouter()
  const searchParams = useSearchParams()
  const idpel = searchParams.get("idpel")

  const [data,setData] = useState<any>(null)
  const [stan,setStan] = useState("")
  const [kode,setKode] = useState("Z - NORMAL")
  const [foto,setFoto] = useState<File | null>(null)

  const [loading,setLoading] = useState(true)
  const [submitting,setSubmitting] = useState(false)
  const [compressing,setCompressing] = useState(false)

  // =============================
  // LOAD DATA
  // =============================
  useEffect(()=>{

    if(!idpel) return

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    fetch("/api/tasks",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        action:"search",
        idpel,
        rbm:user.RBM
      })
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.status === "success"){
        setData(res.data)
      } else {
        alert("Customer tidak ditemukan")
        router.push("/dashboard")
      }
    })
    .catch(()=>{
      alert("Gagal mengambil data")
    })
    .finally(()=>{
      setLoading(false)
    })

  },[idpel])

  // =============================
  // IMAGE COMPRESSION
  // =============================
  async function handleFileChange(e:any){

    const file = e.target.files?.[0]
    if(!file) return

    try{

      setCompressing(true)

      const options = {
        maxSizeMB: 0.7,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: "image/jpeg"
      }

      const compressed = await imageCompression(file, options)

      const newFile = new File(
        [compressed],
        `meter-${Date.now()}.jpg`,
        { type: "image/jpeg" }
      )

      setFoto(newFile)

    }catch(err){
      console.error(err)
      alert("Gagal kompres gambar")
    }

    setCompressing(false)

  }

  // =============================
  // SUBMIT
  // =============================
  async function submit(){

    if(submitting) return

    if(!stan){
      alert("Stan meter wajib diisi")
      return
    }

    if(!foto){
      alert("Foto wajib diambil")
      return
    }

    setSubmitting(true)

    try{

      const formData = new FormData()
      formData.append("file", foto)

      const uploadRes = await fetch("/api/upload",{
        method:"POST",
        body:formData
      })

      const uploadData = await uploadRes.json()

      if(uploadData.status !== "success"){
        alert("Upload gagal")
        setSubmitting(false)
        return
      }

      const fotoUrl = uploadData.url

      const user = JSON.parse(localStorage.getItem("user") || "{}")

      const res = await fetch("/api/tasks",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          action:"update",
          idpel,
          rbm:user.RBM,
          stan,
          kode,
          foto:fotoUrl
        })
      })

      const result = await res.json()

      if(result.status === "success"){
        alert("✅ Data berhasil disimpan")
        router.push("/dashboard")
      } else {
        alert("Submit gagal")
      }

    }catch(err){
      console.error(err)
      alert("Terjadi kesalahan")
    }

    setSubmitting(false)

  }

  // =============================
  // UI
  // =============================
  if(loading){
    return <div className="p-4">Loading...</div>
  }

  return(

    <div className="p-4 pb-28 max-w-md mx-auto space-y-4">

      <h1 className="text-xl font-bold text-center">
        Update Meter
      </h1>

      {/* CUSTOMER CARD */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">

        <p className="text-sm text-gray-500">IDPEL</p>
        <p className="font-bold text-lg">{data?.idpel}</p>

        <p className="mt-2 text-sm text-gray-500">Nama</p>
        <p className="font-semibold">{data?.nama}</p>

        <p className="mt-2 text-sm text-gray-500">
          {data?.tarif} / {data?.daya} VA
        </p>

      </div>

      {/* STAN INPUT */}
      <input
        type="number"
        placeholder="Stan Meter"
        value={stan}
        onChange={(e)=>setStan(e.target.value)}
        className="w-full border p-4 rounded-lg text-lg"
      />

      {/* KODE BACA */}
      <select
        value={kode}
        onChange={(e)=>setKode(e.target.value)}
        className="w-full border p-4 rounded-lg text-lg"
      >
        {kodeBacaList.map((k)=>(
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

      {/* CAMERA BUTTON */}
      <label className="block">

        <div className="bg-gray-100 border border-dashed rounded-lg p-4 text-center cursor-pointer">
          📷 Ambil Foto Meter
        </div>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

      </label>

      {/* STATUS */}
      {compressing && (
        <p className="text-sm text-blue-600">
          ⏳ Compressing image...
        </p>
      )}

      {submitting && (
        <p className="text-sm text-green-600">
          ⏳ Uploading & saving...
        </p>
      )}

      {/* PREVIEW */}
      {foto && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Preview:</p>
          <img
            src={URL.createObjectURL(foto)}
            className="rounded-lg border w-full object-contain"
          />
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full bg-blue-600 active:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold"
        >
          {submitting ? "Processing..." : "SUBMIT"}
        </button>

      </div>

    </div>

  )

}