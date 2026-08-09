"use client"

import React, { useState, useTransition } from "react"
import { toast } from "sonner"
import { updateContent } from "@/app/actions/content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Pencil, Mail, Phone, Send } from "lucide-react"

// Define TikTok icon since Lucide doesn't have it natively
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
)

interface ContactInfo {
  email: string
  phone: string
  instagram: string
  tiktok: string
  linkedin: string
  twitter: string
}

interface EditableContactProps {
  id: string
  defaultContent: string
  isAdmin?: boolean
}

export default function EditableContact({
  id,
  defaultContent,
  isAdmin = false,
}: EditableContactProps) {
  const [info, setInfo] = useState<ContactInfo>(() => {
    try {
      const parsed = JSON.parse(defaultContent)
      if (parsed) return parsed
    } catch (e) {}
    return {
      email: "",
      phone: "",
      instagram: "",
      tiktok: "",
      linkedin: "",
      twitter: "",
    }
  })
  
  const [prevDefaultContent, setPrevDefaultContent] = useState(defaultContent)
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editData, setEditData] = useState<ContactInfo>(info)

  // Form State
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  if (defaultContent !== prevDefaultContent) {
    setPrevDefaultContent(defaultContent)
    try {
      const parsed = JSON.parse(defaultContent)
      if (parsed) {
        setInfo(parsed)
      }
    } catch (e) {
      console.error("Failed to parse contact info", e)
    }
  }

  const handleSave = () => {
    setInfo(editData)
    startTransition(() => {
      updateContent(id, JSON.stringify(editData))
      toast.success("Informations de contact mises à jour")
    })
    setIsDialogOpen(false)
  }

  const openEdit = () => {
    setEditData(info)
    setIsDialogOpen(true)
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi")
      
      setSubmitStatus("success")
      setFormData({ name: "", phone: "", email: "", message: "" })
      toast.success("Votre message a été envoyé avec succès !")
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch (err: any) {
      setSubmitStatus("error")
      setErrorMessage(err.message)
      toast.error("Erreur lors de l'envoi", { description: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative mx-auto mt-8 w-full max-w-5xl rounded-3xl bg-card text-card-foreground shadow-2xl overflow-hidden text-left">
      <div className="grid md:grid-cols-2 gap-0">
        
        {/* Left side: Form */}
        <div className="p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-border">
          <h3 className="text-2xl font-bold mb-8 text-foreground">Envoyez un message</h3>
          
          <form className="space-y-6" onSubmit={handleSendEmail}>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nom complet *</label>
              <Input 
                required 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Votre nom" 
                className="bg-background border-border/50 h-12" 
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Numéro de téléphone</label>
              <Input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 6 00 00 00 00" 
                className="bg-background border-border/50 h-12" 
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Adresse Email *</label>
              <Input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre@email.com" 
                className="bg-background border-border/50 h-12" 
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message *</label>
              <textarea 
                required 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Décrivez votre projet ou votre besoin..." 
                className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border/50 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-primary" 
                disabled={isSubmitting}
              />
            </div>
            
            {submitStatus === "success" && (
              <div className="p-3 text-sm font-medium text-green-600 bg-green-50 rounded-md border border-green-200">
                Votre message a été envoyé avec succès !
              </div>
            )}
            
            {submitStatus === "error" && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-md border border-red-200">
                {errorMessage}
              </div>
            )}
            
            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-bold flex items-center justify-center gap-2">
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Envoyer le message
                </>
              )}
            </Button>
            
            <div className="text-center pt-2">
              <a href={`mailto:${info.email}`} className="text-sm text-primary hover:underline">
                Préférez l'email ? Écrire directement
              </a>
            </div>
          </form>
        </div>

        {/* Right side: Contact Info */}
        <div className="p-8 md:p-12 lg:p-16 bg-secondary/5 flex flex-col justify-center">
          <div className="space-y-10">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Email</h4>
              <a href={`mailto:${info.email}`} className="text-2xl md:text-3xl font-bold text-foreground hover:text-primary transition-colors break-words">
                {info.email || "hello@example.com"}
              </a>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Téléphone</h4>
              <a href={`tel:${info.phone}`} className="text-2xl md:text-3xl font-bold text-primary hover:text-primary/80 transition-colors">
                {info.phone || "+00 0 00 00 00 00"}
              </a>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Réseaux Sociaux</h4>
              <div className="flex flex-wrap gap-4">
                {info.email && (
                  <a href={`mailto:${info.email}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm hover:scale-110 hover:border-primary hover:text-primary transition-all">
                    <Mail className="h-5 w-5" />
                  </a>
                )}
                {info.phone && (
                  <a href={`tel:${info.phone}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm hover:scale-110 hover:border-primary hover:text-primary transition-all">
                    <Phone className="h-5 w-5" />
                  </a>
                )}
                {info.instagram && (
                  <a href={info.instagram} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm hover:scale-110 hover:border-primary hover:text-primary transition-all">
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                )}
                {info.tiktok && (
                  <a href={info.tiktok} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm hover:scale-110 hover:border-primary hover:text-primary transition-all">
                    <TikTokIcon className="h-5 w-5" />
                  </a>
                )}
                {info.linkedin && (
                  <a href={info.linkedin} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm hover:scale-110 hover:border-primary hover:text-primary transition-all">
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                )}
                {info.twitter && (
                  <a href={info.twitter} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm hover:scale-110 hover:border-primary hover:text-primary transition-all">
                    <TwitterIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <Button
          onClick={openEdit}
          size="icon"
          className="absolute right-4 top-4 z-20 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md h-10 w-10 text-white"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}

      {isPending && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier les informations de contact</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Email</label>
                <Input
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Téléphone</label>
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="+33 6 00 00 00 00"
                />
              </div>
            </div>

            <div className="space-y-3 mt-2 border-t pt-4">
              <h4 className="text-sm font-semibold">Liens Réseaux Sociaux (Laissez vide pour masquer)</h4>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">Lien Instagram</label>
                <Input
                  value={editData.instagram}
                  onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">Lien TikTok</label>
                <Input
                  value={editData.tiktok}
                  onChange={(e) => setEditData({ ...editData, tiktok: e.target.value })}
                  placeholder="https://tiktok.com/@..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">Lien LinkedIn</label>
                <Input
                  value={editData.linkedin}
                  onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">Lien X / Twitter</label>
                <Input
                  value={editData.twitter}
                  onChange={(e) => setEditData({ ...editData, twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
