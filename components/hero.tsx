import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Users, Award } from 'lucide-react'

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 lg:py-32">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Blockchain-powered module reviews
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
          Make better course choices with{' '}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            transparent reviews
          </span>
        </h1>

        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          HSLU students helping students. Review modules, earn reputation, and discover the best courses through decentralized, censorship-resistant feedback.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="gap-2 font-semibold"
            onClick={() => {
              const moduleSection = document.getElementById('modules-section')
              if (moduleSection) {
                moduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
          >
            Browse Modules <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 font-semibold"
            onClick={() => {
              alert('To get verified, please contact the contract owner at: marcel.christen@stud.hslu.ch\n\nVerification is currently done manually by the admin.')
            }}
          >
            <Shield className="w-4 h-4" /> Get Verified
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Verified Students</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Only HSLU students with @stud.hslu.ch emails can review. Soul-bound NFT badges ensure authenticity.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-lg mb-2">Community Driven</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Upvote helpful reviews, build reputation, and contribute to a better learning experience.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-chart-3" />
            </div>
            <h3 className="font-bold text-lg mb-2">Blockchain Secured</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Reviews stored on Polygon. Transparent, immutable, and censorship-resistant forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
