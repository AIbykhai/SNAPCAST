"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BrandProfileWizard } from "@/components/brand-profile-wizard"
import { getAuthStatus } from "@/lib/auth-utils"

export default function BrandProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    importMethod: "",
    pastedContent: ["", "", ""],
    socialMediaUrl: "",
    importedPosts: [],
    selectedPosts: [],
    vocabulary: "",
    brandVoiceSummary: "",
    suggestedVocabulary: [],
  })

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = getAuthStatus()
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [router])

  const handleComplete = () => {
    // In a real application, you would save the brand profile data
    console.log("Brand profile completed:", formData)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <BrandProfileWizard formData={formData} setFormData={setFormData} onComplete={handleComplete} />
    </div>
  )
}
