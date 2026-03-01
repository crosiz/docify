import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Brain, Mail, FileText, Users, Shield, ArrowRight, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import { LandingNav } from "@/components/landing-nav"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-center items-center">
          <a
            href="https://crosiz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 py-1 px-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
          >
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground/80 group-hover:text-foreground transition-colors">
              Developed by
            </span>
            <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <img
                src="/logo.png"
                alt="Crosiz Logo"
                className="h-[14px] w-auto object-contain"
              />
              <span className="text-[12px] font-bold tracking-tight text-foreground">
                Crosiz
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full point-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full point-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <Badge variant="secondary" className="mb-4 bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-4 py-1.5 text-sm transition-colors cursor-default">
                ✨ AI-Powered Knowledge Management
              </Badge>
              <h1 className="text-5xl sm:text-7xl font-extrabold text-foreground tracking-tight text-balance leading-[1.1]">
                Find Answers from Your <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">Internal Knowledge</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed">
                Docify transforms your documents and emails into an intelligent active database. Get instant AI-powered answers
                from your team's collective knowledge with military-grade security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="text-lg px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 border-primary/20 hover:bg-primary/5 transition-all hover:border-primary/50">
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* 3D Graphic Area */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none pt-10 lg:pt-0">
              <div className="relative" style={{ perspective: "2000px" }}>
                <div className="relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center transition-all duration-700 hover:rotate-y-[5deg] hover:rotate-x-[5deg] group cursor-pointer" style={{ transformStyle: "preserve-3d", transform: "rotateY(-15deg) rotateX(10deg)" }}>

                  {/* Shadow Layer */}
                  <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-2xl group-hover:bg-primary/30 transition-colors duration-700" style={{ transform: "translateZ(-50px)" }} />

                  {/* Main floating card */}
                  <div className="relative flex flex-col items-center justify-center p-8 bg-card/60 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl h-[300px] w-full max-w-[400px]" style={{ transform: "translateZ(50px)" }}>

                    <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/50 via-transparent to-accent/50 rounded-3xl z-[-1]" />

                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/20">
                      <Brain className="w-10 h-10 text-primary drop-shadow-md" />
                    </div>

                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Docify AI Engine</h3>
                    <p className="text-muted-foreground text-center mt-3 font-medium">Vectorizing enterprise data via semantic analysis</p>

                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 blur-xl rounded-full animate-pulse" style={{ transform: "translateZ(100px)" }} />
                  </div>

                  {/* Floating decorative sub-cards */}
                  <div className="absolute top-10 -right-8 bg-background/90 backdrop-blur-xl border border-border/50 p-4 rounded-xl shadow-xl group-hover:translate-y-[-10px] transition-transform duration-500 delay-100 flex items-center gap-3" style={{ transform: "translateZ(80px)" }}>
                    <FileText className="w-5 h-5 text-accent" />
                    <span className="text-sm font-semibold text-foreground">1,402 Docs Indexed</span>
                  </div>

                  <div className="absolute bottom-10 -left-8 bg-background/90 backdrop-blur-xl border border-border/50 p-4 rounded-xl shadow-xl group-hover:translate-y-[-10px] transition-transform duration-500 delay-200 flex items-center gap-3" style={{ transform: "translateZ(120px)" }}>
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-foreground">SOC 2 Verified</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Knowledge Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make your team's knowledge instantly accessible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 transform-gpu cursor-default border-primary/10 hover:border-primary/30 bg-card">
              <CardHeader>
                <Search className="h-12 w-12 text-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle>Intelligent Document Search</CardTitle>
                <CardDescription>
                  Search through PDFs, Word docs, and spreadsheets using natural language queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Vector-based semantic search
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Support for multiple file formats
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Real-time indexing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 transform-gpu cursor-default border-primary/10 hover:border-primary/30 bg-card">
              <CardHeader>
                <Brain className="h-12 w-12 text-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Get instant answers and summaries generated from your knowledge base</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Contextual AI responses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Document summarization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Source attribution
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 transform-gpu cursor-default border-primary/10 hover:border-primary/30 bg-card">
              <CardHeader>
                <Mail className="h-12 w-12 text-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle>Email Integration</CardTitle>
                <CardDescription>Connect your email inbox to search through important conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Gmail & Outlook support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Automatic email indexing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Privacy-first approach
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Built for Enterprise Teams</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure, scalable, and designed for modern knowledge work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <FileText className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Multi-Format Support</h3>
              <p className="text-sm text-muted-foreground">PDFs, Word, Excel, and more</p>
            </Card>

            <Card className="text-center p-6">
              <Users className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">Share knowledge across teams</p>
            </Card>

            <Card className="text-center p-6">
              <Shield className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">SOC 2 compliant infrastructure</p>
            </Card>

            <Card className="text-center p-6">
              <Brain className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Advanced AI</h3>
              <p className="text-sm text-muted-foreground">GPT-4 powered insights</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Trusted by Knowledge Teams</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Docify has completely transformed how our team retrieves internal policies. What used to take hours of
                searching through old PDFs now takes seconds."
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The semantic search feature is incredible. It flawlessly understands the context of our local Urdu-English mixed queries across technical documentation."
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Email integration was a game-changer for our agency. Now we can instantly find important decisions buried in client email threads."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Knowledge Management?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of teams who've made their knowledge instantly accessible with AKOP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="https://crosiz.com/inquiry" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent w-full sm:w-auto"
              >
                Schedule Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold text-foreground">AKOP</span>
              </div>
              <p className="text-muted-foreground">AI-powered knowledge management for modern teams</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-accent">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-accent">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-accent">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 pb-6 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground text-sm mb-4">&copy; 2024 Docify AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
