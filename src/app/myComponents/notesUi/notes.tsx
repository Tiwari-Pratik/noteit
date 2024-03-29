
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pN9Hrus1awF
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card"

export default function Notes() {
  return (
    <section className="mt-24 mx-auto p-8 w-[90%] min-h-full">
      <div className="flex flex-col min-h-full">
        <main className="flex-1 flex flex-col p-4 gap-4 md:p-6">
          <div className="flex justify-between items-center gap-4">
            <h1 className="font-semibold text-2xl text-primary">Notes</h1>
            <Button>New Note</Button>
          </div>
          <div className="grid gap-4 md:gap-6">
            <Card className="border-primary/50 flex items-center justify-between px-2">
              <div>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold">Meeting Notes</CardTitle>
                  <CardDescription className="line-clamp-2">
                    <p>Follow-up on action items from the last meeting. Discussing the new project proposal.</p>
                  </CardDescription>
                </CardContent>
              </div>
              <div>
                <Button>Edit</Button>
              </div>
            </Card>
            <Card className="border-primary/50 flex items-center justify-between px-2">
              <div>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold">Shopping List</CardTitle>
                  <CardDescription className="line-clamp-2">
                    <ul className="list-disc pl-4">
                      <li>Apples</li>
                      <li>Bread</li>
                      <li>Cheese</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </div>
              <div>
                <Button>Edit</Button>
              </div>
            </Card>
            <Card className="border-primary/50 flex items-center justify-between px-2">
              <div>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold">Project Ideas</CardTitle>
                  <CardDescription className="line-clamp-2">
                    <ul className="list-disc pl-4">
                      <li>Apples</li>
                      <li>Bread</li>
                      <li>Cheese</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </div>
              <div>
                <Button>Edit</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </section>
  )
}

