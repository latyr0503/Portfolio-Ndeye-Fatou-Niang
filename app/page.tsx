import { getAllContent } from "@/app/actions/content"
import EditableText from "@/components/EditableText"
import EditableImage from "@/components/EditableImage"
import EditableSkills from "@/components/EditableSkills"
import EditableTechPortfolio from "@/components/EditableTechPortfolio"
import EditablePersoPortfolio from "@/components/EditablePersoPortfolio"
import EditableCaseStudies from "@/components/EditableCaseStudies"
import EditableTools from "@/components/EditableTools"
import EditableContact from "@/components/EditableContact"
import { isAdminUser } from "@/lib/auth"
import LogoutButton from "@/components/LogoutButton"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Video,
  Camera,
  Scissors,
  TrendingUp,
  MonitorPlay,
  Sparkles,
  CheckCircle2,
  ArrowDown,
  Heart,
} from "lucide-react"

export default async function Home() {
  const contentMap = await getAllContent()
  const isAdmin = await isAdminUser()

  // Helper function to get content or fallback to default
  const get = (id: string, defaultContent: string) =>
    contentMap[id] || defaultContent

  return (
    <main className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground selection:bg-primary/20">
      {isAdmin && (
        <div className="fixed top-4 right-4 z-50">
          <LogoutButton />
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative mt-8 flex min-h-[90vh] flex-col items-center justify-center px-4 text-center">
        <div className="absolute top-20 left-10 -z-10 h-64 w-64 rounded-full bg-secondary opacity-50 blur-3xl"></div>
        <div className="absolute right-10 bottom-20 -z-10 h-64 w-64 rounded-full bg-primary/10 opacity-50 blur-3xl"></div>

        <div className="mx-auto flex max-w-4xl animate-in flex-col items-center space-y-6 duration-1000 fade-in slide-in-from-bottom-4">
          <EditableImage
            id="hero-image"
            defaultSrc={get("hero-image", "")}
            fallback={<span>Faa</span>}
            isAdmin={isAdmin}
            className="relative mb-4 flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-secondary/80 font-heading text-4xl text-secondary-foreground shadow-xl md:h-60 md:w-60"
          />

          <h1 className="flex flex-wrap items-center justify-center gap-2 font-heading text-5xl font-bold tracking-tight text-foreground md:text-7xl">
            <EditableText
              id="hero-title"
              defaultContent={get("hero-title", "Ndeye Fatou Niang")}
              isAdmin={isAdmin}
              as="span"
            />
          </h1>

          <p className="flex items-center justify-center gap-2 text-xl font-medium text-muted-foreground md:text-2xl">
            <Sparkles className="h-5 w-5 text-primary" />
            <EditableText
              id="hero-desc"
              defaultContent={get(
                "hero-desc",
                "Créatrice de contenu UGC & Storyteller"
              )}
              isAdmin={isAdmin}
              as="span"
            />
          </p>

          <blockquote className="my-8 max-w-2xl border-l-4 border-primary py-2 pl-6 text-left font-heading text-2xl text-foreground/80 italic md:text-3xl">
            <EditableText
              id="hero-quote"
              defaultContent={get(
                "hero-quote",
                `"Je ne cherche pas un bureau. Je cherche des histoires à raconter."`
              )}
              isAdmin={isAdmin}
            />
          </blockquote>

          <div className="py-8">
            <Button
              size="lg"
              className="rounded-full bg-primary px-8 py-6 text-lg text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90"
            >
              <EditableText
                id="hero-btn"
                defaultContent={get("hero-btn", "Voir mes réalisations")}
                isAdmin={isAdmin}
                as="span"
              />
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <ArrowDown className="mx-auto mb-8 h-10 w-10 animate-bounce text-primary" />
        </div>
      </section>

      {/* 2. A PROPOS & PROCESSUS */}
      <section className="relative bg-secondary/30 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="space-y-6">
              <EditableText
                id="about-title"
                defaultContent={get("about-title", "À propos de moi")}
                isAdmin={isAdmin}
                as="h2"
                className="font-heading text-4xl font-bold text-foreground md:text-5xl"
              />

              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <EditableText
                  id="about-p1"
                  defaultContent={get(
                    "about-p1",
                    "Un produit ? J'imagine déjà l'histoire. Une marque ? Je réfléchis à l'histoire qu'on pourrait raconter."
                  )}
                  isAdmin={isAdmin}
                  as="p"
                  className="text-xl font-medium text-foreground"
                />
                <EditableText
                  id="about-p2"
                  defaultContent={get(
                    "about-p2",
                    "Je suis Faa, créatrice de contenu UGC, et j'aime créer des vidéos simples et authentiques. Mon objectif ? Que chaque contenu ressemble à une recommandation d'une amie, pas à une publicité."
                  )}
                  isAdmin={isAdmin}
                  as="p"
                />
              </div>
            </div>

            <div className="h-[500px] w-full overflow-hidden rounded-3xl shadow-sm">
              <EditableImage
                id="about-image"
                defaultSrc={get("about-image", "")}
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary/40">
                    <Camera className="h-16 w-16" />
                  </div>
                }
                isAdmin={isAdmin}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PROCESSUS DE CRÉATION */}
      <section className="bg-background px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-sm md:p-12">
            <EditableText
              id="process-title"
              defaultContent={get("process-title", "Mon Processus de Création")}
              isAdmin={isAdmin}
              as="h3"
              className="text-center font-heading text-2xl font-bold text-primary"
            />
            <EditableText
              id="process-subtitle"
              defaultContent={get(
                "process-subtitle",
                "*Chaque projet présenté a été imaginé et réalisé par moi.*"
              )}
              isAdmin={isAdmin}
              as="p"
              className="mb-8 text-center text-sm text-muted-foreground italic"
            />

            <div className="relative grid grid-cols-1 gap-6 md:grid-cols-4">
              {/* Ligne horizontale (desktop uniquement) */}
              <div className="absolute left-[12%] right-[12%] top-6 -z-10 hidden h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent md:block"></div>
              {[
                {
                  id: "process-1",
                  defTitle: "Idée (J'imagine)",
                  defDesc:
                    "Tout commence par une idée. Ensuite, je lui donne vie.",
                  icon: <Sparkles className="h-5 w-5" />,
                },
                {
                  id: "process-2",
                  defTitle: "Scripts (J'écris)",
                  defDesc: "Structuration du message et du storytelling.",
                  icon: <CheckCircle2 className="h-5 w-5" />,
                },
                {
                  id: "process-3",
                  defTitle: "Tournage (Je filme)",
                  defDesc: "Captation avec un style authentique.",
                  icon: <Camera className="h-5 w-5" />,
                },
                {
                  id: "process-4",
                  defTitle: "Montage (Je monte)",
                  defDesc: "Assemblage dynamique pour capter l'attention.",
                  icon: <Scissors className="h-5 w-5" />,
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-background bg-secondary text-primary shadow-sm">
                    {step.icon}
                  </div>
                  <div className="w-full rounded-xl border border-border/50 bg-background p-4 shadow-sm transition-all hover:shadow-md">
                    <EditableText
                      id={`${step.id}-title`}
                      defaultContent={get(`${step.id}-title`, step.defTitle)}
                      isAdmin={isAdmin}
                      as="h4"
                      className="font-bold text-foreground"
                    />
                    <EditableText
                      id={`${step.id}-desc`}
                      defaultContent={get(`${step.id}-desc`, step.defDesc)}
                      isAdmin={isAdmin}
                      as="p"
                      className="mt-2 text-sm text-muted-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPETENCES */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <EditableText
          id="skills-title"
          defaultContent={get("skills-title", "Mes Compétences")}
          isAdmin={isAdmin}
          as="h2"
          className="mb-12 font-heading text-4xl font-bold md:text-5xl"
        />
        <EditableSkills
          id="skills-list"
          defaultContent={get(
            "skills-list",
            JSON.stringify([
              { id: "skill-1", name: "Création de contenu", icon: "Video" },
              { id: "skill-2", name: "Montage vidéo", icon: "Scissors" },
              { id: "skill-3", name: "Photographie", icon: "Camera" },
              { id: "skill-4", name: "Production vidéo", icon: "MonitorPlay" },
              { id: "skill-5", name: "Marketing digital", icon: "TrendingUp" },
              { id: "skill-6", name: "Social Media", icon: "CheckCircle2" },
            ])
          )}
          isAdmin={isAdmin}
        />
      </section>

      {/* 4. REALISATIONS (PORTFOLIO) */}
      <section className="bg-foreground px-4 py-24 text-background">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <EditableText
              id="portfolio-title"
              defaultContent={get("portfolio-title", "Mes Réalisations")}
              isAdmin={isAdmin}
              as="h2"
              className="mb-4 font-heading text-4xl font-bold text-background md:text-5xl"
            />
            <EditableText
              id="portfolio-subtitle"
              defaultContent={get(
                "portfolio-subtitle",
                "Découvrez mes créations par catégorie"
              )}
              isAdmin={isAdmin}
              as="p"
              className="text-lg text-background/70"
            />
          </div>

          <div className="space-y-24">
            {/* Category: Tech */}
            <div>
              <h3 className="mb-8 flex items-center gap-3 border-b border-background/20 pb-4 text-2xl font-bold">
                <span className="rounded-lg bg-primary p-2 text-primary-foreground shadow-md shadow-primary/20">
                  💻
                </span>
                <EditableText
                  id="cat-tech-title"
                  defaultContent={get("cat-tech-title", "UGC Tech Content")}
                  isAdmin={isAdmin}
                  as="span"
                />
              </h3>
              <EditableTechPortfolio
                id="tech-portfolio-list"
                defaultContent={get(
                  "tech-portfolio-list",
                  JSON.stringify([
                    { id: "tech-1", title: "Tayeur Gestion", image: "" },
                    { id: "tech-2", title: "IMT Dakar", image: "" },
                    { id: "tech-3", title: "Jips", image: "" },
                    { id: "tech-4", title: "Goat Tech", image: "" },
                    { id: "tech-5", title: "Numssms", image: "" },
                    { id: "tech-6", title: "IZI premium", image: "" },
                    { id: "tech-7", title: "Meloafrik", image: "" },
                  ])
                )}
                isAdmin={isAdmin}
              />
            </div>

            {/* Category: Personnel */}
            <div>
              <h3 className="mb-8 flex items-center gap-3 border-b border-background/20 pb-4 text-2xl font-bold">
                <span className="rounded-lg bg-primary p-2 text-primary-foreground">
                  ✨
                </span>
                <EditableText
                  id="cat-perso-title"
                  defaultContent={get(
                    "cat-perso-title",
                    "Création de Contenu Personnel"
                  )}
                  isAdmin={isAdmin}
                  as="span"
                />
              </h3>

              <EditablePersoPortfolio
                id="perso-portfolio-list"
                defaultContent={get(
                  "perso-portfolio-list",
                  JSON.stringify([
                    {
                      id: "perso-1",
                      title: "Faa Glow",
                      description: "Selfcare, routines, bons plans",
                      stats: [
                        { value: "+26,2K", label: "Followers" },
                        { value: "+309K", label: "J'aime" },
                      ],
                    },
                    {
                      id: "perso-2",
                      title: "Faa Digital",
                      description: "Analyse de compte & formation",
                      stats: [
                        { value: "+7,8K", label: "Followers" },
                        { value: "+44,3K", label: "J'aime" },
                      ],
                    },
                    {
                      id: "perso-3",
                      title: "YouTube Projets",
                      description:
                        "Vlogs, Défis (24h sans écrans, 1 mois pour trouver un job)",
                      stats: [],
                    },
                  ])
                )}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. STATS & IMPACT */}
      <section className="relative overflow-hidden bg-secondary/30 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <EditableText
              id="stats-title"
              defaultContent={get("stats-title", "Gestion de Page & Impact")}
              isAdmin={isAdmin}
              as="h2"
              className="mb-4 font-heading text-4xl font-bold md:text-5xl"
            />
            <EditableText
              id="stats-subtitle"
              defaultContent={get(
                "stats-subtitle",
                "Freelance - Des résultats organiques et authentiques"
              )}
              isAdmin={isAdmin}
              as="p"
              className="text-lg text-muted-foreground"
            />
          </div>

          <EditableCaseStudies
            id="case-studies-list"
            defaultContent={JSON.stringify([
              {
                id: "c1",
                badge: "Cas 1 : Pretty Mina",
                title: "Vente de tissu",
                stats: [
                  { val: "+328K", label: "Vues de publications" },
                  { val: "+6.9K", label: "Vues de profil" },
                ],
                description:
                  "Résultats obtenus sans publicité, uniquement grâce à une stratégie de contenus simples, authentiques et adaptés au public local.",
              },
              {
                id: "c2",
                badge: "Cas 2 : Fakhouni",
                title: "Parfums & bien-être",
                stats: [{ val: "+13 700", label: "abonnés en 3 jours" }],
                description:
                  "Relayée par plusieurs créateurs de contenu, offrant une visibilité bien au-delà de l'audience initiale.",
              },
              {
                id: "c3",
                badge: "Cas 3 : Allure Elegance",
                title: "Marque de vêtements traditionnels",
                stats: [],
                description:
                  "Création de vidéos et mise en valeur des collections de la marque.",
              },
            ])}
            isAdmin={isAdmin}
          />
        </div>
      </section>

      {/* 6. OUTILS */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-10 font-heading text-3xl font-bold">
            <EditableText
              id="tools-title"
              defaultContent="Mes Outils du Quotidien"
              isAdmin={isAdmin}
              as="span"
            />
          </h2>
          <EditableTools
            id="tools-list"
            defaultContent={JSON.stringify([
              { id: "t1", title: "Claude", color: "#D08770" },
              { id: "t2", title: "Metricool", color: "#5E81AC" },
              { id: "t3", title: "Canva", color: "#B48EAD" },
            ])}
            isAdmin={isAdmin}
          />
        </div>
      </section>

      {/* 7. CTA / FOOTER */}
      <section className="relative bg-foreground px-4 py-32 text-center text-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent opacity-10"></div>
        <div className="relative z-10 mx-auto max-w-5xl">
          <h2 className="mb-12 font-heading text-4xl font-bold text-background md:text-6xl">
            Prêt(e) à collaborer ?
          </h2>

          <div className="mb-16 max-w-3xl mx-auto">
            <div className="mb-3 flex justify-between text-sm font-bold tracking-widest text-background/80 uppercase">
              <span>Chargement du prochain projet...</span>
              <span className="font-black text-primary">80%</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-background/20 p-0.5">
              <div className="relative h-full w-[80%] overflow-hidden rounded-full bg-primary">
                <div className="absolute inset-0 animate-pulse bg-white/20"></div>
              </div>
            </div>
            <p className="mt-4 text-background/60 italic">
              Les 20% restants dépendent peut-être de vous.
            </p>
          </div>

          <EditableContact 
            id="contact-info"
            defaultContent={JSON.stringify({
              email: "seneabdoulayelatyr@gmail.com",
              phone: "+221 76 124 10 31",
              instagram: "https://www.instagram.com/reels/DbnRuolujsr/",
              tiktok: "https://www.tiktok.com/search?q=contanna&t=1769689194163",
              linkedin: "https://www.linkedin.com/in/abdoulaye-latyr-sene-96338a99/",
              twitter: "https://x.com/AbdoulayeLatyr"
            })}
            isAdmin={isAdmin}
          />
        </div>
      </section>

      <footer className="border-t border-background/10 bg-foreground py-8 text-center text-sm text-background/50">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://abdoulayelatyr.com/"
            className="text-primary hover:underline"
          >
            Abdoulaye latyr SENE
          </a>{" "}
          <Heart className="inline h-4 w-4 animate-pulse" />. Tous
          droits réservés.
        </p>
      </footer>
    </main>
  )
}
