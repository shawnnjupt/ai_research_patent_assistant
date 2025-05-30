import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  backUrl?: string
}

export function Header({ title, backUrl }: HeaderProps) {
  return (
    <header className="flex items-center px-4 py-4 border-b bg-black">
      {backUrl && (
        <Link href={backUrl} passHref>
          <Button variant="ghost" size="icon" aria-label="返回" className="text-white hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      )}
      <h1 className="text-lg font-semibold text-white ml-4">{title}</h1>
    </header>
  )
} 