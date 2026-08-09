'use client'

import React, { useState, useRef } from 'react'
import { updateContent } from '@/app/actions/content'
import { toast } from "sonner"

interface EditableTextProps {
  id: string
  defaultContent: string
  as?: React.ElementType
  isAdmin?: boolean
  className?: string
}

export default function EditableText({
  id,
  defaultContent,
  as: Tag = 'div',
  isAdmin = false,
  className = ''
}: EditableTextProps) {
  const [content, setContent] = useState(defaultContent)
  const [prevDefaultContent, setPrevDefaultContent] = useState(defaultContent)
  const [isSaving, setIsSaving] = useState(false)
  const contentRef = useRef<HTMLElement>(null)

  if (defaultContent !== prevDefaultContent) {
    setPrevDefaultContent(defaultContent)
    setContent(defaultContent)
  }

  const handleBlur = async () => {
    if (!contentRef.current) return
    const newContent = contentRef.current.innerText

    if (newContent !== content) {
      setIsSaving(true)
      const result = await updateContent(id, newContent)
      if (result && result.success) {
        toast.success("Texte mis à jour", { duration: 2000 })
        setContent(newContent)
      } else {
        // Revert on failure
        contentRef.current.innerText = content
        toast.error("Erreur de sauvegarde")
      }
      setIsSaving(false)
    }
  }

  if (!isAdmin) {
    return <Tag className={`whitespace-pre-wrap ${className}`}>{content}</Tag>
  }

  return (
    <Tag
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      className={`relative outline-none ring-2 ring-transparent hover:ring-blue-400 focus:ring-blue-500 rounded p-1 transition-all whitespace-pre-wrap ${className} ${isSaving ? 'opacity-50' : ''}`}
    >
      {content}
    </Tag>
  )
}
