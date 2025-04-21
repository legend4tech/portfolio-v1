"use client"

import { useEffect, useRef, useState } from "react"

interface SmartTextWrapProps {
  text: string
  className?: string
}

export default function SmartTextWrap({ text, className = "" }: SmartTextWrapProps) {
  const [processedText, setProcessedText] = useState(text)
  const containerRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // Process text to handle long words
    const processText = () => {
      // If no text or no container, return original
      if (!text || !containerRef.current) return text

      const words = text.split(/\s+/)
      const containerWidth = containerRef.current.clientWidth

      // Process each word - if a word is too long, add soft hyphens
      const processedWords = words.map((word) => {
        // Skip short words (less than 15 chars)
        if (word.length < 15) return word

        // For long words, measure if they would overflow
        const testSpan = document.createElement("span")
        testSpan.style.visibility = "hidden"
        testSpan.style.position = "absolute"
        testSpan.style.fontSize = window.getComputedStyle(containerRef.current!).fontSize
        testSpan.innerText = word
        document.body.appendChild(testSpan)

        const wordWidth = testSpan.getBoundingClientRect().width
        document.body.removeChild(testSpan)

        // If word is wider than container, insert soft hyphens
        if (wordWidth > containerWidth * 0.9) {
          // Insert soft hyphens every ~10 characters
          return word
            .split("")
            .map((char, i) => (i > 0 && i % 10 === 0 ? `\u00AD${char}` : char))
            .join("")
        }

        return word
      })

      return processedWords.join(" ")
    }

    setProcessedText(processText())
  }, [text])

  return (
    <p ref={containerRef} className={`${className} break-words`}>
      {processedText}
    </p>
  )
}
