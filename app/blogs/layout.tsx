import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Travel & Repeat",
  description:
    "Descubre consejos de viaje, guias de destinos, y experiencias unicas que te ayudaran a planificar tu proxima aventura.",
  openGraph: {
    title: "Blog - Travel & Repeat",
    description:
      "Consejos de viaje, guias de destinos y experiencias unicas para tus proximas vacaciones.",
    type: "website",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
