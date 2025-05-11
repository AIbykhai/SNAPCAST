"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Highlight } from "@/components/ui/highlight"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Loader2, X } from "lucide-react"
import { getProfile, updateProfile, updateBrandProfile } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  bio: z.string().max(160, { message: "Bio must not exceed 160 characters" }).optional(),
})

const brandProfileSchema = z.object({
  brandVoice: z.string().min(10, { message: "Brand voice description must be at least 10 characters" }),
  vocabulary: z.string(),
})

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [brandKeywords, setBrandKeywords] = useState<string[]>([])
  const { toast } = useToast()

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      bio: "",
    },
  })

  const brandForm = useForm<z.infer<typeof brandProfileSchema>>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      brandVoice: "",
      vocabulary: "",
    },
  })

  // Fetch profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile()

        // Update profile form
        profileForm.reset({
          name: data.user.name,
          email: data.user.email,
          company: data.user.company || "",
          bio: data.user.bio || "",
        })

        // Update brand form
        if (data.brandProfile) {
          brandForm.reset({
            brandVoice: data.brandProfile.brandVoice,
            vocabulary: "",
          })

          // Set brand keywords
          setBrandKeywords(data.brandProfile.vocabulary || [])
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          title: "Error loading profile",
          description: "Failed to load your profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [profileForm, brandForm, toast])

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true)

    try {
      // Update profile
      await updateProfile({
        name: values.name,
        company: values.company,
        bio: values.bio,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onBrandSubmit(values: z.infer<typeof brandProfileSchema>) {
    setIsLoading(true)

    try {
      // Add new keywords if any were entered
      let updatedKeywords = [...brandKeywords]

      if (values.vocabulary.trim()) {
        const newKeywords = values.vocabulary
          .split(",")
          .map((keyword) => keyword.trim())
          .filter((keyword) => keyword.length > 0 && !brandKeywords.includes(keyword))

        if (newKeywords.length > 0) {
          updatedKeywords = [...brandKeywords, ...newKeywords]
          setBrandKeywords(updatedKeywords)
          brandForm.setValue("vocabulary", "")
        }
      }

      // Update brand profile
      await updateBrandProfile({
        brandVoice: values.brandVoice,
        vocabulary: updatedKeywords,
      })

      toast({
        title: "Brand profile updated",
        description: "Your brand profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating brand profile:", error)
      toast({
        title: "Error updating brand profile",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeKeyword = async (keyword: string) => {
    try {
      const updatedKeywords = brandKeywords.filter((k) => k !== keyword)
      setBrandKeywords(updatedKeywords)

      // Update brand profile
      await updateBrandProfile({
        vocabulary: updatedKeywords,
      })

      toast({
        title: "Keyword removed",
        description: `"${keyword}" has been removed from your brand vocabulary`,
      })
    } catch (error) {
      console.error("Error removing keyword:", error)
      toast({
        title: "Error removing keyword",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen flex-col md:flex-row">
        <DashboardSidebar />
        <div className="flex-1">
          <DashboardHeader />
          <main className="container mx-auto p-4 md:p-6">
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">
              User <Highlight>Profile</Highlight>
            </h1>
            <p className="text-muted-foreground">Manage your personal information and brand settings</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Personal Information</TabsTrigger>
              <TabsTrigger value="brand">Brand Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} disabled />
                            </FormControl>
                            <FormDescription>Email cannot be changed</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Optional: Enter your company or organization name</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Tell us a little about yourself"
                                className="resize-none"
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description for your profile. Maximum 160 characters.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brand">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Profile</CardTitle>
                  <CardDescription>Update your brand voice and vocabulary for AI-generated content</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...brandForm}>
                    <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-6">
                      <FormField
                        control={brandForm.control}
                        name="brandVoice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand Voice</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-[120px] resize-none" />
                            </FormControl>
                            <FormDescription>
                              This description helps our AI understand and match your brand's tone and style.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel>Brand Vocabulary</FormLabel>
                        <div className="mb-3 flex flex-wrap gap-2">
                          {brandKeywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="px-3 py-1">
                              {keyword}
                              <button
                                type="button"
                                onClick={() => removeKeyword(keyword)}
                                className="ml-2 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>

                        <FormField
                          control={brandForm.control}
                          name="vocabulary"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Add new keywords (comma-separated)" />
                              </FormControl>
                              <FormDescription>
                                Enter words and phrases that are important to your brand voice. Separate each with a
                                comma.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Update Brand Profile"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
