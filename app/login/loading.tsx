import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#85DBD9]/20 via-background to-[#9473d4]/10">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="text-primary" />
        <p className="text-muted-foreground font-medium">Cargando...</p>
      </div>
    </div>
  );
}
