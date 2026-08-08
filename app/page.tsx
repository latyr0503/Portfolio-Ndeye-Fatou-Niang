import { Button } from "@/components/ui/button";
import { ArrowRight, Video, Camera, Scissors, TrendingUp, MonitorPlay, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/20">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 text-center">
        {/* Decorative background shapes */}
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-secondary opacity-50 blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-primary/10 opacity-50 blur-3xl -z-10"></div>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-6 max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-secondary/80 border-4 border-white shadow-xl overflow-hidden mb-4 relative flex items-center justify-center text-secondary-foreground text-4xl font-heading">
            {/* Image placeholder */}
            Faa
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Ndeye Fatou Niang <span className="text-primary">(Faa)</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> 
            Créatrice de contenu UGC &amp; Storyteller
          </p>
          
          <blockquote className="text-2xl md:text-3xl font-heading italic text-foreground/80 my-8 max-w-2xl border-l-4 border-primary pl-6 py-2 text-left">
            &quot;Je ne cherche pas un bureau. Je cherche des histoires à raconter.&quot;
          </blockquote>
          
          <div className="pt-4">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
              Voir mes réalisations <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* 2. A PROPOS & PROCESSUS */}
      <section className="py-24 px-4 bg-secondary/30 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">À propos de moi</h2>
              <div className="text-lg text-muted-foreground space-y-4 leading-relaxed">
                <p className="font-medium text-foreground text-xl">
                  Un produit ? J&apos;imagine déjà l&apos;histoire. <br/>
                  Une marque ? Je réfléchis à l&apos;histoire qu&apos;on pourrait raconter.
                </p>
                <p>
                  Je suis Faa, créatrice de contenu UGC, et j&apos;aime créer des vidéos simples et authentiques. Mon objectif ? Que chaque contenu ressemble à une recommandation d&apos;une amie, pas à une publicité.
                </p>
                <p>
                  Parce qu&apos;aujourd&apos;hui, ce sont les histoires qui marquent... et c&apos;est exactement ce que j&apos;aime créer.
                </p>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-3xl shadow-sm border border-border/50">
              <h3 className="font-heading text-2xl font-bold mb-6 text-primary">Mon Processus de Création</h3>
              <p className="text-sm italic text-muted-foreground mb-8">*Chaque projet présenté a été imaginé et réalisé par moi.*</p>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/20 before:to-transparent">
                
                {[
                  { title: "Idée (J'imagine)", desc: "Tout commence par une idée. Ensuite, je lui donne vie.", icon: <Sparkles className="h-5 w-5" /> },
                  { title: "Scripts (J'écris)", desc: "Structuration du message et du storytelling.", icon: <CheckCircle2 className="h-5 w-5" /> },
                  { title: "Tournage (Je filme)", desc: "Captation avec un style authentique.", icon: <Camera className="h-5 w-5" /> },
                  { title: "Montage (Je monte)", desc: "Assemblage dynamique pour capter l'attention.", icon: <Scissors className="h-5 w-5" /> },
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                      {step.icon}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-background shadow-sm hover:shadow-md transition-all">
                      <h4 className="font-bold text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 3. COMPETENCES */}
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12">Mes Compétences</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { name: "Création de contenu", icon: <Video className="h-4 w-4" /> },
            { name: "Montage vidéo", icon: <Scissors className="h-4 w-4" /> },
            { name: "Photographie", icon: <Camera className="h-4 w-4" /> },
            { name: "Production vidéo", icon: <MonitorPlay className="h-4 w-4" /> },
            { name: "Marketing digital", icon: <TrendingUp className="h-4 w-4" /> },
            { name: "Social Media", icon: <CheckCircle2 className="h-4 w-4" /> },
          ].map((skill, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium text-lg hover:bg-primary hover:text-primary-foreground transition-colors cursor-default shadow-sm">
              {skill.icon} {skill.name}
            </span>
          ))}
        </div>
      </section>

      {/* 4. REALISATIONS (PORTFOLIO) */}
      <section className="py-24 px-4 bg-foreground text-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-background">Mes Réalisations</h2>
            <p className="text-background/70 text-lg">Découvrez mes créations par catégorie</p>
          </div>

          <div className="space-y-24">
            {/* Category: Tech */}
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 border-b border-background/20 pb-4">
                <span className="bg-primary p-2 rounded-lg text-primary-foreground">💻</span> UGC Tech Content
              </h3>
              <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbar">
                {["Tayeur Gestion", "IMT Dakar", "Jips", "Goat Tech", "Numssms", "IZI premium", "Meloafrik"].map((project, i) => (
                  <div key={i} className="snap-center shrink-0 w-64 sm:w-72 aspect-[9/16] rounded-2xl bg-background/5 border border-background/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-6">
                      <h4 className="font-bold text-xl">{project}</h4>
                      <p className="text-sm text-background/70">Voir le projet →</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Beauté */}
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 border-b border-background/20 pb-4">
                <span className="bg-primary p-2 rounded-lg text-primary-foreground">💄</span> UGC Beauté &amp; Bien-être
              </h3>
              <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbar">
                {["Mayi Welness", "Aura Afrique", "Cherifa Cosmetic", "KND CHIC"].map((project, i) => (
                  <div key={i} className="snap-center shrink-0 w-64 sm:w-72 aspect-[9/16] rounded-2xl bg-background/5 border border-background/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-6">
                      <h4 className="font-bold text-xl">{project}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Actrice Pub */}
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 border-b border-background/20 pb-4">
                <span className="bg-primary p-2 rounded-lg text-primary-foreground">🎬</span> Actrice Pub
              </h3>
              <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbar">
                <div className="snap-center shrink-0 w-64 sm:w-72 aspect-[9/16] rounded-2xl bg-background/5 border border-background/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-6">
                    <h4 className="font-bold text-xl">Shell</h4>
                    <p className="text-sm text-background/70">Campagne &quot;GO WILL&quot;</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category: Personnel */}
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 border-b border-background/20 pb-4">
                <span className="bg-primary p-2 rounded-lg text-primary-foreground">✨</span> Création de Contenu Personnel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-background/5 border border-background/10 hover:bg-background/10 transition-colors">
                  <h4 className="font-bold text-xl text-primary-foreground mb-2">Faa Glow</h4>
                  <p className="text-sm text-background/70 mb-4">Selfcare, routines, bons plans</p>
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="bg-primary/20 px-3 py-1 rounded-full">+26,2K Followers</span>
                    <span className="bg-primary/20 px-3 py-1 rounded-full">+309K J&apos;aime</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-background/5 border border-background/10 hover:bg-background/10 transition-colors">
                  <h4 className="font-bold text-xl text-primary-foreground mb-2">Faa Digital</h4>
                  <p className="text-sm text-background/70 mb-4">Analyse de compte &amp; formation</p>
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="bg-primary/20 px-3 py-1 rounded-full">+7,8K Followers</span>
                    <span className="bg-primary/20 px-3 py-1 rounded-full">+44,3K J&apos;aime</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-background/5 border border-background/10 hover:bg-background/10 transition-colors">
                  <h4 className="font-bold text-xl text-primary-foreground mb-2">YouTube Projets</h4>
                  <p className="text-sm text-background/70 mb-4">Vlogs, Défis (24h sans écrans, 1 mois pour trouver un job)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. STATS & IMPACT */}
      <section className="py-24 px-4 bg-secondary/30 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Gestion de Page &amp; Impact</h2>
            <p className="text-muted-foreground text-lg">Freelance - Des résultats organiques et authentiques</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Cas 1 */}
            <div className="bg-card p-8 md:p-10 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="inline-block px-4 py-1 bg-secondary text-secondary-foreground text-sm font-bold rounded-full mb-6">Cas 1 : Pretty Mina</div>
              <h3 className="font-heading text-3xl font-bold mb-8">Vente de tissu</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-4xl md:text-5xl font-black text-primary mb-2">+328K</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Vues de publications</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-black text-primary mb-2">+6.9K</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Vues de profil</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-foreground mb-1">+9 300</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">J&apos;aime</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-foreground mb-1">+329</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Partages</div>
                </div>
              </div>
              <p className="italic text-sm text-muted-foreground border-l-2 border-primary pl-4">
                Résultats obtenus sans publicité, uniquement grâce à une stratégie de contenus simples, authentiques et adaptés au public local.
              </p>
            </div>

            {/* Cas 2 & 3 */}
            <div className="space-y-8">
              <div className="bg-primary text-primary-foreground p-8 md:p-10 rounded-3xl shadow-md">
                <div className="inline-block px-4 py-1 bg-white/20 text-white text-sm font-bold rounded-full mb-6">Cas 2 : Fakhouni</div>
                <h3 className="font-heading text-2xl font-bold mb-6">Parfums &amp; bien-être</h3>
                <div className="mb-6">
                  <div className="text-5xl font-black mb-2">+13 700</div>
                  <div className="text-lg font-medium opacity-90">abonnés en 3 jours</div>
                  <div className="text-sm opacity-75 mt-1">(passage de 1 000 à 14 700)</div>
                </div>
                <p className="text-sm opacity-90 font-medium">
                  Relayée par plusieurs créateurs de contenu, offrant une visibilité bien au-delà de l&apos;audience initiale.
                </p>
              </div>

              <div className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border">
                <div className="inline-block px-4 py-1 bg-secondary text-secondary-foreground text-sm font-bold rounded-full mb-4">Cas 3 : Allure Elegance</div>
                <h3 className="font-heading text-xl font-bold mb-2">Marque de vêtements traditionnels</h3>
                <p className="text-muted-foreground">Création de vidéos et mise en valeur des collections de la marque.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUTILS */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold mb-10">Mes Outils du Quotidien</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="h-16 w-16 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center text-xl font-bold text-[#D08770]">
                {/* Placeholder logo Claude */}
                C
              </div>
              <span className="font-medium">Claude</span>
            </div>
            <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="h-16 w-16 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center text-xl font-bold text-[#5E81AC]">
                {/* Placeholder logo Metricool */}
                M
              </div>
              <span className="font-medium">Metricool</span>
            </div>
            <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="h-16 w-16 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center text-xl font-bold text-[#B48EAD]">
                {/* Placeholder logo Canva */}
                Cv
              </div>
              <span className="font-medium">Canva</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA / FOOTER */}
      <section className="py-32 px-4 bg-foreground text-background text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-heading text-4xl md:text-6xl font-bold mb-12 text-background">Prêt(e) à collaborer ?</h2>
          
          <div className="mb-12">
            <div className="flex justify-between text-sm font-bold mb-3 text-background/80 uppercase tracking-widest">
              <span>Chargement du prochain projet...</span>
              <span className="text-primary font-black">80%</span>
            </div>
            <div className="h-4 w-full bg-background/20 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-primary rounded-full w-[80%] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="mt-4 italic text-background/60">Les 20% restants dépendent peut-être de vous.</p>
          </div>
          
          <Button size="lg" className="rounded-full px-12 py-8 text-xl font-bold bg-background text-foreground hover:bg-background/90 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            Commençons le projet
          </Button>
        </div>
      </section>
      
      <footer className="bg-foreground py-8 border-t border-background/10 text-center text-background/50 text-sm">
        <p>© {new Date().getFullYear()} Ndeye Fatou Niang (Faa). Tous droits réservés.</p>
      </footer>
    </main>
  );
}
