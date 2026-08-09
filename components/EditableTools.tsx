"use client"

import React, { useState, useEffect, useTransition, useRef } from "react"
import { updateContent } from "@/app/actions/content"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, X, Pencil, Upload } from "lucide-react"

interface Tool {
  id: string
  title: string
  image?: string
  color?: string
}

interface EditableToolsProps {
  id: string
  defaultContent: string
  isAdmin?: boolean
}

const PRESET_COLORS = ["#D08770", "#5E81AC", "#B48EAD", "#A3BE8C", "#EBCB8B", "#88C0D0"]

export default function EditableTools({
  id,
  defaultContent,
  isAdmin = false,
}: EditableToolsProps) {
  const [tools, setTools] = useState<Tool[]>(() => {
    try {
      const parsed = JSON.parse(defaultContent)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [prevDefaultContent, setPrevDefaultContent] = useState(defaultContent)

  if (defaultContent !== prevDefaultContent) {
    setPrevDefaultContent(defaultContent)
    try {
      const parsed = JSON.parse(defaultContent)
      if (Array.isArray(parsed)) {
        setTools(parsed)
      }
    } catch (e) {
      console.error("Failed to parse tools", e)
    }
  }

  const [isPending, startTransition] = useTransition()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<Tool | null>(null)
  const [toolToDelete, setToolToDelete] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [color, setColor] = useState(PRESET_COLORS[0])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const saveTools = (newTools: Tool[]) => {
    setTools(newTools)
    startTransition(() => {
      updateContent(id, JSON.stringify(newTools))
      toast.success("Outils mis à jour")
    })
  }

  const confirmDelete = () => {
    if (toolToDelete) {
      saveTools(tools.filter((t) => t.id !== toolToDelete))
      setToolToDelete(null)
    }
  }

  const handleSave = () => {
    if (!title.trim()) return

    if (editingTool) {
      saveTools(
        tools.map((t) =>
          t.id === editingTool.id ? { ...t, title, image, color } : t
        )
      )
    } else {
      saveTools([
        ...tools,
        { id: `tool-${Date.now()}`, title, image, color },
      ])
    }

    setIsDialogOpen(false)
  }

  const openAdd = () => {
    setEditingTool(null)
    setTitle("")
    setImage("")
    setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)])
    setIsDialogOpen(true)
  }

  const openEdit = (tool: Tool) => {
    setEditingTool(tool)
    setTitle(tool.title)
    setImage(tool.image || "")
    setColor(tool.color || PRESET_COLORS[0])
    setIsDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop volumineuse (max 2MB).")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {tools.map((tool) => (
          <div key={tool.id} className="group relative flex flex-col items-center gap-2 opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0">
            {tool.image ? (
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform duration-300 group-hover:scale-110">
                <img src={tool.image} alt={tool.title} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div 
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-xl font-bold shadow-sm transition-transform duration-300 group-hover:scale-110"
                style={{ color: tool.color || "#D08770" }}
              >
                {getInitials(tool.title)}
              </div>
            )}
            <span className="font-medium">{tool.title}</span>

            {isAdmin && (
              <div className="absolute -right-4 -top-4 z-30 hidden gap-1 group-hover:flex">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openEdit(tool)
                  }}
                  className="rounded-full bg-blue-500 p-1.5 text-white shadow-md transition-transform hover:scale-110 hover:bg-blue-600"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setToolToDelete(tool.id)
                  }}
                  className="rounded-full bg-red-500 p-1.5 text-white shadow-md transition-transform hover:scale-110 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={openAdd}
            variant="outline"
            className="h-auto rounded-full border-dashed bg-transparent px-6 py-2 text-sm hover:bg-secondary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un outil
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTool ? "Modifier l'outil" : "Ajouter un outil"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-semibold">
                Nom de l'outil
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Figma"
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Icône / Image</label>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-secondary">
                  {image ? (
                    <img src={image} alt="Aperçu" className="h-full w-full object-cover" />
                  ) : (
                    <div 
                      className="text-xl font-bold"
                      style={{ color: color }}
                    >
                      {title ? getInitials(title) : "?"}
                    </div>
                  )}
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-xs"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Uploader (Max 2Mo)
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {image && (
                    <Button variant="ghost" size="sm" onClick={() => setImage("")} className="text-xs text-red-500 hover:text-red-600">
                      Supprimer l'image
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {!image && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Couleur (si pas d'image)</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${color === c ? "border-primary scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!toolToDelete}
        onOpenChange={(open) => !open && setToolToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer cet outil ?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToolToDelete(null)}>
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
    </div>
  )
}
