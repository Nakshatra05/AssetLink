import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeatureCard } from '@/components/FeatureCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Building2, 
  UserCheck, 
  ArrowRightLeft, 
  FileCheck, 
  TrendingUp,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const features = [
    {
      icon: Building2,
      title: 'Compliant Issuance',
      description: 'Tokenize real-world assets with built-in regulatory compliance and automated legal frameworks.'
    },
    {
      icon: UserCheck,
      title: 'On-chain KYC',
      description: 'Streamlined identity verification with privacy-preserving technology and instant approval workflows.'
    },
    {
      icon: ArrowRightLeft,
      title: 'Cross-chain Scalability',
      description: 'Seamless asset transfers across multiple blockchains with unified liquidity and instant settlements.'
    },
    {
      icon: FileCheck,
      title: 'Asset Passport',
      description: 'Immutable document verification with cryptographic proofs and transparent ownership history.'
    }
  ];

  const stats = [
    { value: '$280B', label: 'Real Estate Tokenization by 2030' },
    { value: '15%', label: 'Lower Transaction Costs' },
    { value: '24/7', label: 'Global Market Access' },
    { value: '99.9%', label: 'Compliance Success Rate' }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              <Zap className="w-3 h-3 mr-1" />
              Powered by Kadena EVM
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Tokenizing{' '}
              <span className="gradient-text">real-world assets</span>{' '}
              with compliance
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform traditional assets into digital tokens while maintaining regulatory compliance 
              and enabling seamless cross-chain transfers for institutional investors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/issuer">
                <Button size="lg" className="btn-glow text-lg px-8 py-4">
                  <Building2 className="w-5 h-5 mr-2" />
                  Issuer Dashboard
                </Button>
              </Link>
              <Link to="/investor">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 glass-card border-primary/30">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Investor Dashboard
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Built for{' '}
              <span className="gradient-text">institutional grade</span>{' '}
              tokenization
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to tokenize, trade, and manage real-world assets 
              with enterprise-level security and compliance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold mb-4">The Problem</h3>
                <p className="text-muted-foreground">
                  Traditional asset markets are fragmented, illiquid, and accessible 
                  only to high-net-worth individuals.
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <ArrowRightLeft className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
                <p className="text-muted-foreground">
                  Fractional ownership through compliant tokenization with 
                  global access and instant liquidity.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Regulatory Compliant</h4>
              <p className="text-muted-foreground text-sm">
                Built with SEC, MiCA, and international standards in mind
              </p>
            </div>
            
            <div className="text-center">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Global Access</h4>
              <p className="text-muted-foreground text-sm">
                24/7 trading with instant cross-border settlements
              </p>
            </div>
            
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Enhanced Liquidity</h4>
              <p className="text-muted-foreground text-sm">
                Fractional ownership opens assets to broader markets
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
