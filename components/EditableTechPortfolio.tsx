"use client"

import React, { useState, useTransition, useRef } from "react"
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
import {
  MonitorPlay,
  ArrowRight,
  Plus,
  X,
  Pencil,
  Upload,
  Link,
  Video,
} from "lucide-react"

interface TechProject {
  id: string
  title: string
  image: string
  mediaType?: "image" | "video"
  description?: string
}

interface EditableTechPortfolioProps {
  id: string
  defaultContent: string
  isAdmin?: boolean
}

export default function EditableTechPortfolio({
  id,
  defaultContent,
  isAdmin = false,
}: EditableTechPortfolioProps) {
  const [projects, setProjects] = useState<TechProject[]>(() => {
    try {
      const parsed = JSON.parse(defaultContent)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  })
  const [prevDefaultContent, setPrevDefaultContent] = useState(defaultContent)
  const [isPending, startTransition] = useTransition()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<TechProject | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [viewingProject, setViewingProject] = useState<TechProject | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (defaultContent !== prevDefaultContent) {
    setPrevDefaultContent(defaultContent)
    try {
      const parsed = JSON.parse(defaultContent)
      if (Array.isArray(parsed)) {
        setProjects(parsed)
      }
    } catch (e) {
      console.error("Failed to parse tech projects", e)
    }
  }

  const saveProjects = (newProjects: TechProject[]) => {
    setProjects(newProjects)
    startTransition(() => {
      updateContent(id, JSON.stringify(newProjects))
      toast.success("Portfolio tech mis à jour")
    })
    setIsDialogOpen(false)
  }

  const confirmDelete = () => {
    if (projectToDelete) {
      saveProjects(projects.filter((p) => p.id !== projectToDelete))
      setProjectToDelete(null)
    }
  }

  const handleSave = () => {
    if (!title.trim()) return

    if (editingProject) {
      saveProjects(
        projects.map((p) =>
          p.id === editingProject.id ? { ...p, title, image, mediaType, description } : p
        )
      )
    } else {
      saveProjects([
        ...projects,
        { id: `tech-${Date.now()}`, title, image, mediaType, description },
      ])
    }

    setIsDialogOpen(false)
  }

  const openAdd = () => {
    setEditingProject(null)
    setTitle("")
    setDescription("")
    setImage("")
    setMediaType("image")
    setIsDialogOpen(true)
  }

  const openEdit = (project: TechProject) => {
    setEditingProject(project)
    setTitle(project.title)
    setDescription(project.description || "")
    setImage(project.image || "")
    setMediaType(project.mediaType || "image")
    setIsDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Le fichier est trop volumineux (max 5MB pour la base de données). Utilisez plutôt un lien externe pour les grandes vidéos."
      )
      return
    }

    const isVideoFile = file.type.startsWith("video/")
    setMediaType(isVideoFile ? "video" : "image")

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const isVideo = (url: string, type?: string) => {
    if (type === "video") return true
    if (url.startsWith("data:video/")) return true
    if (url.match(/\.(mp4|webm|ogg)$/i)) return true
    return false
  }

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 gap-6 pb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project) => {
          const projectIsVideo = isVideo(project.image, project.mediaType)

          return (
            <div
              key={project.id}
              className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-2xl border border-background/10 bg-black/20 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(122,32,51,0.25)]"
            >
              {project.image && projectIsVideo ? (
                <video
                  src={project.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}

              <div className="absolute inset-0 bg-background/5 transition-transform duration-700 group-hover:scale-105"></div>

              <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6">
                <h4 className="translate-y-3 transform text-xl font-bold text-white transition-transform duration-500 group-hover:translate-y-0">
                  {project.title}
                </h4>
                <div className="mt-2 overflow-hidden">
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setViewingProject(project)
                    }}
                    className="flex translate-y-full transform items-center gap-1 text-sm font-medium text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:underline outline-none"
                  >
                    Voir le projet <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {isAdmin && (
                <div className="absolute top-2 right-2 z-30 hidden gap-1 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openEdit(project)
                    }}
                    className="rounded-full bg-blue-500 p-1.5 text-white shadow-md transition-transform hover:scale-110 hover:bg-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setProjectToDelete(project.id)
                    }}
                    className="rounded-full bg-red-500 p-1.5 text-white shadow-md transition-transform hover:scale-110 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isAdmin && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={openAdd}
            variant="outline"
            className="h-auto rounded-full border-dashed bg-transparent px-8 py-4 text-lg hover:bg-secondary"
          >
            <Plus className="mr-2 h-5 w-5" />
            Ajouter un projet
          </Button>
        </div>
      )}

      {isPending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-background/50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="flex max-w-none flex-col border-0 p-6 shadow-2xl"
          style={{
            width: "85vw",
            maxWidth: "1200px",
            height: "85vh",
            maxHeight: "900px",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              {editingProject ? "Modifier le projet" : "Ajouter un projet"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-8 overflow-hidden md:flex-row">
            {/* L'aperçu géant */}
            <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl border bg-secondary/30">
              {image && isVideo(image, mediaType) ? (
                <video
                  src={image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : image ? (
                <img
                  src={image}
                  alt="Aperçu"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border bg-background shadow-sm">
                    <MonitorPlay className="h-10 w-10 opacity-40" />
                  </div>
                  <p className="text-lg font-medium">Aucun média</p>
                  <p className="mt-1 max-w-[250px] text-sm opacity-60">
                    L'aperçu de votre image ou vidéo apparaîtra ici en grand
                    format.
                  </p>
                </div>
              )}
            </div>

            {/* Le panneau latéral (formulaire) */}
            <div className="flex w-full shrink-0 flex-col gap-6 overflow-y-auto pr-4 pb-4 md:w-[380px]">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-semibold">
                  Titre du projet
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mon superbe projet UGC"
                  className="h-12 text-base font-medium shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="description" className="text-sm font-semibold">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre projet en détail..."
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
                />
              </div>
              
              <div className="flex flex-col gap-4 border-t pt-4">
                <label className="text-sm font-semibold">Source du média</label>

                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-14 w-full border border-primary/20 bg-primary/10 text-primary shadow-none hover:bg-primary/20"
                >
                  <Upload className="mr-3 h-5 w-5 shrink-0" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-semibold">
                      Uploader un fichier
                    </span>
                    <span className="text-[10px] opacity-70">
                      Max 5Mo (Image ou vidéo courte)
                    </span>
                  </div>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,video/mp4,video/webm"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2 shrink-0 border-t pt-6">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              className="h-12 px-6 font-medium"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="h-12 px-8 font-bold shadow-md"
            >
              Enregistrer le projet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action
              modifiera la page immédiatement.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox for Viewing Project */}
      <Dialog
        open={!!viewingProject}
        onOpenChange={(open) => !open && setViewingProject(null)}
      >
        <DialogContent className="flex h-[90vh] max-w-[95vw] flex-col overflow-hidden border-none bg-black/95 p-0 shadow-2xl md:max-w-[85vw] md:flex-row">
          <DialogHeader className="absolute right-4 top-4 z-50 md:hidden">
            <DialogTitle className="sr-only">Visualiser le projet</DialogTitle>
          </DialogHeader>
          
          <div className="relative flex min-h-[40vh] flex-1 items-center justify-center bg-black">
            {viewingProject &&
              (isVideo(viewingProject.image, viewingProject.mediaType) ? (
                <video
                  src={viewingProject.image}
                  controls
                  autoPlay
                  className="h-full w-full object-contain outline-none"
                />
              ) : (
                <img
                  src={viewingProject.image}
                  alt={viewingProject.title}
                  className="h-full w-full object-contain"
                />
              ))}
          </div>

          {/* Section description */}
          <div className="flex w-full shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-zinc-950 p-6 text-white md:w-[400px] md:p-8">
            {viewingProject && (
              <>
                <h2 className="mb-6 text-2xl font-bold text-primary">
                  {viewingProject.title}
                </h2>
                <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-zinc-300">
                  {viewingProject.description ? (
                    viewingProject.description
                  ) : (
                    <span className="italic opacity-50">Aucune description pour ce projet.</span>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
