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
import { Plus, X, Pencil, Trash2 } from "lucide-react"

interface Stat {
  val: string
  label: string
}

interface CaseStudy {
  id: string
  badge: string
  title: string
  stats: Stat[]
  description: string
}

interface EditableCaseStudiesProps {
  id: string
  defaultContent: string
  isAdmin?: boolean
}

export default function EditableCaseStudies({
  id,
  defaultContent,
  isAdmin = false,
}: EditableCaseStudiesProps) {
  const [cases, setCases] = useState<CaseStudy[]>(() => {
    try {
      const parsed = JSON.parse(defaultContent)
      if (Array.isArray(parsed)) {
        return parsed.map((c: any) => {
          if (c.stats) return c
          const newStats: Stat[] = []
          if (c.stat1Val) newStats.push({ val: c.stat1Val, label: c.stat1Label || "" })
          if (c.stat2Val) newStats.push({ val: c.stat2Val, label: c.stat2Label || "" })
          return {
            id: c.id,
            badge: c.badge || "",
            title: c.title || "",
            description: c.description || "",
            stats: newStats
          }
        })
      }
    } catch (e) {}
    return []
  })
  const [prevDefaultContent, setPrevDefaultContent] = useState(defaultContent)
  const [isPending, startTransition] = useTransition()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null)
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null)

  const [badge, setBadge] = useState("")
  const [title, setTitle] = useState("")
  const [stats, setStats] = useState<Stat[]>([])
  const [description, setDescription] = useState("")

  if (defaultContent !== prevDefaultContent) {
    setPrevDefaultContent(defaultContent)
    try {
      const parsed = JSON.parse(defaultContent)
      if (Array.isArray(parsed)) {
        const migrated = parsed.map((c: any) => {
          if (c.stats) return c
          
          const newStats: Stat[] = []
          if (c.stat1Val) newStats.push({ val: c.stat1Val, label: c.stat1Label || "" })
          if (c.stat2Val) newStats.push({ val: c.stat2Val, label: c.stat2Label || "" })
          
          return {
            id: c.id,
            badge: c.badge || "",
            title: c.title || "",
            description: c.description || "",
            stats: newStats
          }
        })
        setCases(migrated)
      }
    } catch (e) {
      console.error("Failed to parse case studies", e)
    }
  }

  const saveCases = (newCases: CaseStudy[]) => {
    setCases(newCases)
    startTransition(() => {
      updateContent(id, JSON.stringify(newCases))
      toast.success("Cas d'étude mis à jour")
    })
  }

  const confirmDelete = () => {
    if (caseToDelete) {
      saveCases(cases.filter((c) => c.id !== caseToDelete))
      setCaseToDelete(null)
    }
  }

  const handleSave = () => {
    if (!title.trim()) return

    const newData: CaseStudy = {
      id: editingCase ? editingCase.id : `case-${Date.now()}`,
      badge,
      title,
      stats,
      description,
    }

    if (editingCase) {
      saveCases(cases.map((c) => (c.id === editingCase.id ? newData : c)))
    } else {
      saveCases([...cases, newData])
    }

    setIsDialogOpen(false)
  }

  const openAdd = () => {
    setEditingCase(null)
    setBadge("")
    setTitle("")
    setStats([])
    setDescription("")
    setIsDialogOpen(true)
  }

  const openEdit = (caseStudy: CaseStudy) => {
    setEditingCase(caseStudy)
    setBadge(caseStudy.badge || "")
    setTitle(caseStudy.title || "")
    setStats(caseStudy.stats ? [...caseStudy.stats] : [])
    setDescription(caseStudy.description || "")
    setIsDialogOpen(true)
  }

  const addStat = () => {
    setStats([...stats, { val: "", label: "" }])
  }

  const updateStat = (index: number, field: "val" | "label", value: string) => {
    const newStats = [...stats]
    newStats[index][field] = value
    setStats(newStats)
  }

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index))
  }

  // Split items for masonry grid
  const leftColumn = cases.filter((_, i) => i % 2 === 0)
  const rightColumn = cases.filter((_, i) => i % 2 === 1)

  const renderCard = (c: CaseStudy, index: number, isRightCol: boolean) => {
    // Alternating styles based on global index logic
    const isPrimary = (index + (isRightCol ? 1 : 0)) % 3 === 1

    const hasStats = c.stats && c.stats.length > 0
    const gridColsClass = c.stats && c.stats.length >= 2 ? "grid-cols-2" : "grid-cols-1"

    return (
      <div
        key={c.id}
        className={`relative group rounded-3xl p-8 md:p-10 shadow-sm transition-shadow hover:shadow-md ${
          isPrimary
            ? "bg-primary text-primary-foreground shadow-md"
            : "border border-border bg-card text-card-foreground"
        }`}
      >
        {c.badge && (
          <div
            className={`mb-6 inline-block rounded-full px-4 py-1 text-sm font-bold ${
              isPrimary
                ? "bg-white/20 text-white"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {c.badge}
          </div>
        )}

        {c.title && (
          <h3 className={`mb-6 font-heading text-2xl font-bold md:text-3xl ${!hasStats ? 'mb-2' : ''}`}>
            {c.title}
          </h3>
        )}

        {hasStats && (
          <div className={`mb-8 grid gap-6 ${gridColsClass}`}>
            {c.stats.map((stat, idx) => (
              <div key={idx}>
                <div
                  className={`mb-2 text-4xl font-black md:text-5xl ${
                    isPrimary ? "" : "text-primary"
                  }`}
                >
                  {stat.val}
                </div>
                {stat.label && (
                  <div
                    className={`text-sm font-medium ${
                      isPrimary
                        ? "opacity-90"
                        : "tracking-wider text-muted-foreground uppercase"
                    }`}
                  >
                    {stat.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {c.description && (
          <p
            className={`text-sm ${
              isPrimary
                ? "font-medium opacity-90"
                : "border-l-2 border-primary pl-4 text-muted-foreground italic"
            }`}
          >
            {c.description}
          </p>
        )}

        {isAdmin && (
          <div className="absolute -right-3 -top-3 z-30 hidden gap-1 group-hover:flex">
            <button
              onClick={(e) => {
                e.stopPropagation()
                openEdit(c)
              }}
              className="rounded-full bg-blue-500 p-2 text-white shadow-md transition-transform hover:scale-110 hover:bg-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCaseToDelete(c.id)
              }}
              className="rounded-full bg-red-500 p-2 text-white shadow-md transition-transform hover:scale-110 hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="flex flex-col gap-8">
          {leftColumn.map((c, i) => renderCard(c, i, false))}
        </div>
        <div className="flex flex-col gap-8">
          {rightColumn.map((c, i) => renderCard(c, i, true))}
        </div>
      </div>

      {isAdmin && (
        <div className="mt-12 flex justify-center">
          <Button
            onClick={openAdd}
            variant="outline"
            className="h-auto rounded-full border-dashed bg-transparent px-8 py-4 text-lg hover:bg-secondary"
          >
            <Plus className="mr-2 h-5 w-5" />
            Ajouter un Cas d'Étude
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
        <DialogContent className="max-w-none sm:max-w-[80vw] w-[80vw] h-[90vh] max-h-[90vh] flex flex-col p-6">
          <DialogHeader className="shrink-0 mb-4">
            <DialogTitle className="text-2xl font-bold">
              {editingCase ? "Modifier le cas d'étude" : "Ajouter un cas d'étude"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Stats */}
            <div className="flex flex-col h-full rounded-2xl border border-border bg-secondary/20 p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <label className="text-lg font-bold">Statistiques associées</label>
                <Button variant="default" size="sm" onClick={addStat} className="h-9">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une stat
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {stats.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-border rounded-xl bg-background/50">
                    <p className="text-muted-foreground font-medium">
                      Aucune statistique ajoutée.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cliquez sur "Ajouter" pour créer votre première métrique.
                    </p>
                  </div>
                )}
                
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-background p-4 rounded-xl border shadow-sm">
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Valeur</label>
                      <Input
                        value={stat.val}
                        onChange={(e) => updateStat(idx, "val", e.target.value)}
                        placeholder="Ex: +328K"
                        className="h-10 text-lg font-black"
                      />
                    </div>
                    <div className="flex-[2] flex flex-col gap-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Label</label>
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(idx, "label", e.target.value)}
                        placeholder="Ex: Vues de publications"
                        className="h-10"
                      />
                    </div>
                    <div className="flex flex-col gap-2 pt-6">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-10 w-10 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100 shrink-0"
                        onClick={() => removeStat(idx)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Other fields */}
            <div className="flex flex-col h-full overflow-y-auto pr-4 gap-6">
              <div className="flex flex-col gap-2 shrink-0">
                <label className="text-sm font-bold">Badge</label>
                <Input
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Ex: Cas 1 : Pretty Mina"
                  className="h-12 bg-secondary/20"
                />
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <label className="text-sm font-bold">Titre Principal</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Vente de tissu"
                  className="h-12 bg-secondary/20"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-bold">Description détaillée</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description du cas, résultats obtenus, contexte..."
                  className="h-full min-h-[200px] w-full rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="shrink-0 mt-6 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="px-6">
              Annuler
            </Button>
            <Button onClick={handleSave} className="min-w-[150px] px-8 font-bold">
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!caseToDelete}
        onOpenChange={(open) => !open && setCaseToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer ce cas d'étude ?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCaseToDelete(null)}>
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
