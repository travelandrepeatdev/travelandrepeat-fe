import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-12 text-primary" />
        <p className="text-lg font-medium text-muted-foreground">
          Cargando articulo...
        </p>
      </div>
    </div>
  );
}
