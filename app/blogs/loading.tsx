import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#5ce1e6]/10 to-[#9473d4]/10">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-12 text-[#2ea1bf]" />
        <p className="text-lg font-medium text-[#369694]">Cargando blogs...</p>
      </div>
    </div>
  )
}