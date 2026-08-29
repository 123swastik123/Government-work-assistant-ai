import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">🏛️</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist, or the service guide
        may have moved. Try searching for what you need.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button leftIcon={<Home className="w-4 h-4" />}>Go home</Button>
        </Link>
        <Link href="/search">
          <Button variant="outline" leftIcon={<Search className="w-4 h-4" />}>
            Search services
          </Button>
        </Link>
      </div>
    </div>
  );
}
