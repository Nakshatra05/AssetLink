import { Building2, Github, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">AssetLink</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Institutional-grade Real-World Asset tokenization platform on Kadena EVM.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/issuer" className="hover:text-foreground transition-colors">Issuer Dashboard</a></li>
              <li><a href="/investor" className="hover:text-foreground transition-colors">Investor Dashboard</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Asset Passport</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Compliance Suite</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Whitepaper</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security Audit</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <FileText className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 AssetLink. Built for Kadena EVM Hackathon.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}