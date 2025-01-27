import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-4">
      <h1 className="text-4xl">Nicht gefunden</h1>
      <p>Diese Seite existiert leider nicht.</p>
      <Button asChild size={"lg"}>
        <Link href="/">Zurück</Link>
      </Button>
    </div>
  );
}
