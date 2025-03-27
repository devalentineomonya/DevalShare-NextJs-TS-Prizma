import { Suspense } from "react"
import Link from "next/link"
import { ProjectList } from "@/components/project-list"
import { ProjectListSkeleton } from "@/components/project-list-skeleton"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Share Your Developer Projects</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Connect with other developers, showcase your work, and discover amazing projects.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/projects/new">
                  <Button size="lg">Share Your Project</Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline">
                    Explore Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Latest Projects</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check out the newest projects from our community.
                </p>
              </div>
              <Suspense fallback={<ProjectListSkeleton />}>
                <ProjectList />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DevShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

