'use client'

import React, { useState, useTransition } from 'react'
import { updateContent } from '@/app/actions/content'
import { toast } from "sonner"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, X, Pencil, Trash2 } from 'lucide-react'

interface Stat {
  value: string
  label: string
}

interface PersoProject {
  id: string
  title: string
  description: string
  stats?: Stat[]
}

interface EditablePersoPortfolioProps {
  id: string
  defaultContent: string
  isAdmin?: boolean
}

export default function EditablePersoPortfolio({ id, defaultContent, isAdmin = false }: EditablePersoPortfolioProps) {
  const [projects, setProjects] = useState<PersoProject[]>(() => {
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
  const [editingProject, setEditingProject] = useState<PersoProject | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stats, setStats] = useState<Stat[]>([])

  if (defaultContent !== prevDefaultContent) {
    setPrevDefaultContent(defaultContent)
    try {
      const parsed = JSON.parse(defaultContent)
      if (Array.isArray(parsed)) {
        setProjects(parsed)
      }
    } catch (e) {
      console.error("Failed to parse perso projects", e)
    }
  }

  const saveProjects = (newProjects: PersoProject[]) => {
    setProjects(newProjects)
    startTransition(() => {
      updateContent(id, JSON.stringify(newProjects))
      toast.success("Portfolio personnel mis à jour")
    })
  }

  const confirmDelete = () => {
    if (projectToDelete) {
      saveProjects(projects.filter(p => p.id !== projectToDelete))
      setProjectToDelete(null)
    }
  }

  const handleSave = () => {
    if (!title.trim()) return

    if (editingProject) {
      saveProjects(projects.map(p => p.id === editingProject.id ? { ...p, title, description, stats } : p))
    } else {
      saveProjects([...projects, { id: `perso-${Date.now()}`, title, description, stats }])
    }
    
    setIsDialogOpen(false)
  }

  const openAdd = () => {
    setEditingProject(null)
    setTitle('')
    setDescription('')
    setStats([])
    setIsDialogOpen(true)
  }

  const openEdit = (project: PersoProject) => {
    setEditingProject(project)
    setTitle(project.title)
    setDescription(project.description)
    setStats(project.stats || [])
    setIsDialogOpen(true)
  }

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="group relative rounded-2xl border border-background/10 bg-background/5 p-6 transition-colors hover:bg-background/10">
            <h4 className="mb-2 text-xl font-bold text-primary-foreground">
              {project.title}
            </h4>
            <p className="mb-4 text-sm text-background/70">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              {project.stats?.map((stat, idx) => (
                <span key={idx} className="rounded-full bg-primary/20 px-3 py-1">
                  <span className="font-bold">{stat.value}</span> {stat.label}
                </span>
              ))}
            </div>

            {isAdmin && (
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 z-30">
                <button 
                  onClick={() => openEdit(project)}
                  className="bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 shadow-md transition-transform hover:scale-110"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setProjectToDelete(project.id)}
                  className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-transform hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="flex justify-center mt-8">
          <Button onClick={openAdd} variant="outline" className="rounded-full px-8 py-4 h-auto text-lg border-dashed bg-transparent hover:bg-secondary">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un contenu
          </Button>
        </div>
      )}

      {isPending && (
         <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-xl z-20">
           <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
         </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Modifier le contenu" : "Ajouter un contenu"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">Titre</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium">Description</label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm font-medium mt-2">Statistiques</label>
              <div className="col-span-3 space-y-3">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input 
                      value={stat.value} 
                      onChange={(e) => {
                        const newStats = [...stats]
                        newStats[idx].value = e.target.value
                        setStats(newStats)
                      }} 
                      placeholder="+26,2K" 
                      className="w-1/3"
                    />
                    <Input 
                      value={stat.label} 
                      onChange={(e) => {
                        const newStats = [...stats]
                        newStats[idx].label = e.target.value
                        setStats(newStats)
                      }} 
                      placeholder="Followers" 
                      className="w-full"
                    />
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100 flex-shrink-0" onClick={() => setStats(stats.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setStats([...stats, { value: '', label: '' }])} className="w-full border-dashed">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une statistique
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer ce contenu ? Cette action est irréversible.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>Annuler</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={confirmDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
