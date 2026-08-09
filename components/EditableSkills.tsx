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
import { 
  Video, 
  Scissors, 
  Camera, 
  MonitorPlay, 
  TrendingUp, 
  CheckCircle2, 
  Star, 
  Image, 
  Smartphone, 
  Pen, 
  Plus, 
  X,
  Pencil
} from 'lucide-react'

// Mapping icon names to components
const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="h-4 w-4" />,
  Scissors: <Scissors className="h-4 w-4" />,
  Camera: <Camera className="h-4 w-4" />,
  MonitorPlay: <MonitorPlay className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  CheckCircle2: <CheckCircle2 className="h-4 w-4" />,
  Star: <Star className="h-4 w-4" />,
  Image: <Image className="h-4 w-4" />,
  Smartphone: <Smartphone className="h-4 w-4" />,
  Pen: <Pen className="h-4 w-4" />,
}

interface Skill {
  id: string
  name: string
  icon: string
}

interface EditableSkillsProps {
  id: string
  defaultContent: string // JSON string of skills
  isAdmin?: boolean
}

export default function EditableSkills({ id, defaultContent, isAdmin = false }: EditableSkillsProps) {
  const [skills, setSkills] = useState<Skill[]>(() => {
    try {
      const parsed = JSON.parse(defaultContent)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  })
  const [prevDefaultContent, setPrevDefaultContent] = useState(defaultContent)
  const [isPending, startTransition] = useTransition()

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null)
  
  // Form states
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('Star')

  if (defaultContent !== prevDefaultContent) {
    setPrevDefaultContent(defaultContent)
    try {
      const parsed = JSON.parse(defaultContent)
      if (Array.isArray(parsed)) {
        setSkills(parsed)
      }
    } catch (e) {
      console.error("Failed to parse skills", e)
    }
  }

  const saveSkills = (newSkills: Skill[]) => {
    setSkills(newSkills)
    startTransition(() => {
      updateContent(id, JSON.stringify(newSkills))
      toast.success("Compétences mises à jour")
    })
  }

  const handleDelete = (e: React.MouseEvent, skillId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSkillToDelete(skillId)
  }

  const confirmDelete = () => {
    if (skillToDelete) {
      saveSkills(skills.filter(s => s.id !== skillToDelete))
      setSkillToDelete(null)
    }
  }

  const handleSave = () => {
    if (!name.trim()) return

    if (editingSkill) {
      saveSkills(skills.map(s => s.id === editingSkill.id ? { ...s, name, icon } : s))
    } else {
      saveSkills([...skills, { id: `skill-${Date.now()}`, name, icon }])
    }
    
    setIsDialogOpen(false)
  }

  const openAdd = () => {
    setEditingSkill(null)
    setName('')
    setIcon('Star')
    setIsDialogOpen(true)
  }

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setName(skill.name)
    setIcon(skill.icon || 'Star')
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 relative w-full">
      {skills.map((skill) => (
        <span
          key={skill.id}
          className="group relative inline-flex cursor-default items-center gap-2 rounded-full bg-secondary px-6 py-3 text-lg font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {iconMap[skill.icon] || <Star className="h-4 w-4" />}
          <span>{skill.name}</span>
          
          {isAdmin && (
            <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1 z-10">
              <button 
                onClick={() => openEdit(skill)}
                className="bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 shadow-md transition-transform hover:scale-110"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button 
                onClick={(e) => handleDelete(e, skill.id)}
                className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-transform hover:scale-110"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </span>
      ))}

      {isAdmin && (
        <Button onClick={openAdd} variant="outline" className="rounded-full px-6 py-3 h-auto text-lg border-dashed bg-transparent hover:bg-secondary">
          <Plus className="w-5 h-5 mr-2" />
          Ajouter
        </Button>
      )}

      {/* Loading overlay */}
      {isPending && (
         <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-xl z-20">
           <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
         </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Modifier la compétence" : "Ajouter une compétence"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">Nom</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Photographie"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm font-medium mt-2">Icône</label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {Object.keys(iconMap).map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => setIcon(iconName)}
                    className={`p-3 rounded-xl border transition-all ${icon === iconName ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' : 'bg-background hover:bg-secondary'}`}
                  >
                    {iconMap[iconName]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!skillToDelete} onOpenChange={(open) => !open && setSkillToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action modifiera la page immédiatement.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillToDelete(null)}>Annuler</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={confirmDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
