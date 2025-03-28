"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"
import Image from "next/image"

const projectSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  url: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const { data: session, status } = useSession({ required: true })
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }

  const onSubmit = async (data: ProjectFormValues) => {
    if (status !== "authenticated") {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project.",
        variant: "destructive",
      })
      return
    }

    if (!imageFile) {
      toast({
        title: "Image required",
        description: "Please upload an image for your project.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      if (data.url) formData.append("url", data.url)
      formData.append("image", imageFile)

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const result = await response.json()

      toast({
        title: "Project created",
        description: "Your project has been successfully created.",
      })

      router.push(`/projects/${result.id}`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="mx-auto container  flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto container  max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Project</CardTitle>
          <CardDescription>Share your project with the developer community.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <FormLabel>Project Image</FormLabel>
                <div className="flex flex-col items-center justify-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-full h-64">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Project preview"
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-md cursor-pointer bg-muted/50 hover:bg-muted/80"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Project" {...field} />
                    </FormControl>
                    <FormDescription>A catchy title for your project.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your project in detail..." className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Explain what your project does and why it's interesting.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/yourusername/project" {...field} />
                    </FormControl>
                    <FormDescription>Link to your project (GitHub, demo, etc.)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
