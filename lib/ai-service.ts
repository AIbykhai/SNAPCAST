import { generateText } from "ai"
import { deepseek } from "@ai-sdk/deepseek"
import { openai } from "@ai-sdk/openai"

// Define the AI model options
const deepseekModel = deepseek("deepseek-v3")
const openaiModel = openai("gpt-4o-mini")

// Interface for content generation
interface ContentGenerationParams {
  prompt: string
  brandVoice?: string
  platform?: string
  theme?: string
}

// Interface for account analysis
interface AccountAnalysisParams {
  accountUrl: string
  platform?: string
}

/**
 * Generate content using Deepseek v3 with fallback to ChatGPT 4o mini
 */
export async function generateContent({
  prompt,
  brandVoice = "",
  platform = "Instagram",
  theme = "",
}: ContentGenerationParams) {
  // Create system prompt with brand voice and platform guidance
  const systemPrompt = `You are an expert social media content creator.
${brandVoice ? `Brand voice: ${brandVoice}` : ""}
Platform: ${platform}
${theme ? `Theme: ${theme}` : ""}
Create engaging, platform-appropriate content based on the user's input.
Format the content properly for the specified platform.`

  try {
    // Try with Deepseek first
    const { text } = await generateText({
      model: deepseekModel,
      system: systemPrompt,
      prompt: prompt,
      maxTokens: 1000,
    })

    return { text, model: "deepseek-v3" }
  } catch (error) {
    console.error("Deepseek API error:", error)

    // Fallback to OpenAI
    try {
      const { text } = await generateText({
        model: openaiModel,
        system: systemPrompt,
        prompt: prompt,
        maxTokens: 1000,
      })

      return { text, model: "gpt-4o-mini" }
    } catch (fallbackError) {
      console.error("OpenAI fallback error:", fallbackError)
      throw new Error("Failed to generate content with both primary and fallback AI models")
    }
  }
}

/**
 * Analyze a social media account using Deepseek v3 with fallback to ChatGPT 4o mini
 */
export async function analyzeAccount({ accountUrl, platform = "auto" }: AccountAnalysisParams) {
  const systemPrompt = `You are an expert social media analyst.
Your task is to analyze the provided social media account URL and extract insights.
Return a JSON array of the top 10 performing posts with the following structure:
[
  {
    "id": "unique-id",
    "title": "Brief title summarizing the post",
    "content": "The post content",
    "theme": "The content theme/category",
    "reach": number,
    "engagementRate": number between 0 and 1
  }
]
Make the analysis realistic and insightful.`

  try {
    // Try with Deepseek first
    const { text } = await generateText({
      model: deepseekModel,
      system: systemPrompt,
      prompt: `Analyze this ${platform !== "auto" ? platform : ""} account: ${accountUrl}`,
      maxTokens: 2000,
    })

    return {
      results: JSON.parse(text),
      model: "deepseek-v3",
    }
  } catch (error) {
    console.error("Deepseek API error:", error)

    // Fallback to OpenAI
    try {
      const { text } = await generateText({
        model: openaiModel,
        system: systemPrompt,
        prompt: `Analyze this ${platform !== "auto" ? platform : ""} account: ${accountUrl}`,
        maxTokens: 2000,
      })

      return {
        results: JSON.parse(text),
        model: "gpt-4o-mini",
      }
    } catch (fallbackError) {
      console.error("OpenAI fallback error:", fallbackError)
      throw new Error("Failed to analyze account with both primary and fallback AI models")
    }
  }
}

/**
 * Generate a brand voice profile based on content samples
 */
export async function generateBrandProfile(contentSamples: string[]) {
  const systemPrompt = `You are an expert brand voice analyst.
Analyze the provided content samples and extract:
1. A comprehensive brand voice description
2. A list of key vocabulary words/phrases that define this brand's voice
Return as JSON with the following structure:
{
  "brandVoice": "detailed description of the brand voice",
  "vocabulary": ["word1", "word2", "phrase1", ...]
}`

  try {
    // Try with Deepseek first
    const { text } = await generateText({
      model: deepseekModel,
      system: systemPrompt,
      prompt: `Content samples:\n${contentSamples.join("\n\n")}`,
      maxTokens: 1500,
    })

    return {
      ...JSON.parse(text),
      model: "deepseek-v3",
    }
  } catch (error) {
    console.error("Deepseek API error:", error)

    // Fallback to OpenAI
    try {
      const { text } = await generateText({
        model: openaiModel,
        system: systemPrompt,
        prompt: `Content samples:\n${contentSamples.join("\n\n")}`,
        maxTokens: 1500,
      })

      return {
        ...JSON.parse(text),
        model: "gpt-4o-mini",
      }
    } catch (fallbackError) {
      console.error("OpenAI fallback error:", fallbackError)
      throw new Error("Failed to generate brand profile with both primary and fallback AI models")
    }
  }
}
