'use client'

import React, { useRef, useState, useTransition } from 'react'
import { updateContent } from '@/app/actions/content'
import { Camera } from 'lucide-react'

interface EditableImageProps {
  id: string
  defaultSrc: string
  alt?: string
  isAdmin?: boolean
  className?: string
  fallback?: React.ReactNode
}

export default function EditableImage({
  id,
  defaultSrc,
  alt = 'Image',
  isAdmin = false,
  className = '',
  fallback
}: EditableImageProps) {
  const [src, setSrc] = useState(defaultSrc)
  const [isPending, startTransition] = useTransition()
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit size to ~4MB for safety with base64/Neon
    if (file.size > 4 * 1024 * 1024) {
      alert("L'image est trop volumineuse (max 4MB).")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setSrc(dataUrl)
      
      // Save to database
      startTransition(() => {
        updateContent(id, dataUrl).catch(err => {
          console.error("Failed to save image", err)
          alert("Erreur lors de la sauvegarde de l'image.")
        })
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div 
      className={`relative group ${className} ${isAdmin ? 'cursor-pointer' : ''}`}
      onClick={() => isAdmin && fileInputRef.current?.click()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        fallback
      )}

      {/* Overlay admin au survol */}
      {isAdmin && (
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Camera className="w-8 h-8 text-white" />
        </div>
      )}

      {/* Loader pendant la sauvegarde */}
      {isPending && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
    </div>
  )
}
