import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { KycStatus } from '@/components/KycStatus';
import { HoldingsTable } from '@/components/HoldingsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { mockKYCSubmit, mockTransfer, demoAssets, demoHoldings } from '@/lib/demo';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  ShoppingCart, 
  Wallet,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

const Investor = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [kycForm, setKycForm] = useState({
    name: '',
    country: '',
    taxId: ''
  });
  const [transferForm, setTransferForm] = useState({
    recipient: '',
    amount: '',
    assetId: ''
  });
  const [selectedAsset, setSelectedAsset] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  
  const { toast } = useToast();
  const { kycStatus, setKycStatus, setKycData } = useAppStore();

  // Initialize with demo holdings if KYC approved
  const [holdings, setHoldings] = useState(kycStatus === 'approved' ? demoHoldings : []);

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycForm.name || !kycForm.country || !kycForm.taxId) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setKycStatus('pending');
    setKycData(kycForm);
    
    try {
      await mockKYCSubmit(kycForm);
      setKycStatus('approved');
      setHoldings(demoHoldings);
      toast({
        title: 'KYC Approved!',
        description: 'Your identity has been verified. You can now trade assets.',
      });
    } catch (error) {
      setKycStatus('rejected');
      toast({
        title: 'KYC Failed',
        description: 'Please contact support for assistance.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrade = async (type: 'buy' | 'sell') => {
    if (!selectedAsset || !tradeAmount) {
      toast({
        title: 'Error',
        description: 'Please select an asset and enter amount',
        variant: 'destructive',
      });
      return;
    }

    const asset = demoAssets.find(a => a.id === selectedAsset);
    if (!asset) return;

    setIsLoading(true);
    try {
      // Simulate trade
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const amount = parseFloat(tradeAmount);
      const cost = amount * asset.price;
      
      if (type === 'buy') {
        // Update holdings
        const existingHolding = holdings.find(h => h.assetId === selectedAsset);
        if (existingHolding) {
          setHoldings(holdings.map(h => 
            h.assetId === selectedAsset 
              ? { ...h, amount: h.amount + amount, value: h.value + cost }
              : h
          ));
        } else {
          setHoldings([...holdings, {
            assetId: selectedAsset,
            assetName: asset.name,
            symbol: asset.symbol,
            amount,
            chain: asset.chain,
            value: cost
          }]);
        }
        
        toast({
          title: 'Purchase Successful',
          description: `Bought ${amount} ${asset.symbol} for $${cost.toLocaleString()}`,
        });
      } else {
        // Sell logic
        const existingHolding = holdings.find(h => h.assetId === selectedAsset);
        if (existingHolding && existingHolding.amount >= amount) {
          setHoldings(holdings.map(h => 
            h.assetId === selectedAsset 
              ? { ...h, amount: h.amount - amount, value: h.value - cost }
              : h
          ));
          
          toast({
            title: 'Sale Successful',
            description: `Sold ${amount} ${asset.symbol} for $${cost.toLocaleString()}`,
          });
        } else {
          toast({
            title: 'Error',
            description: 'Insufficient balance',
            variant: 'destructive',
          });
        }
      }
      
      setTradeAmount('');
    } catch (error) {
      toast({
        title: 'Trade Failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferForm.recipient || !transferForm.amount || !transferForm.assetId) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockTransfer(
        transferForm.recipient, 
        parseFloat(transferForm.amount), 
        transferForm.assetId
      );
      
      if (result.success) {
        toast({
          title: 'Transfer Successful',
          description: `Transaction: ${result.txHash}`,
        });
      } else {
        toast({
          title: 'Transfer Blocked',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Transfer Failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPassport = (assetId: string) => {
    const cid = assetId === '1' ? 'QmDemo123KadenaTowerREIT' : 'QmDemo456GreenEnergyCompliance';
    navigate(`/passport/${cid}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Investor Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your RWA portfolio and compliance status
              </p>
            </div>
            <KycStatus status={kycStatus} />
          </div>
        </motion.div>

        {kycStatus === 'not-started' || kycStatus === 'pending' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>KYC Verification</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kycStatus === 'pending' ? (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-warning mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Verification in Progress</h3>
                    <p className="text-muted-foreground">
                      Your KYC application is being reviewed. This usually takes 5-10 minutes.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleKycSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={kycForm.name}
                        onChange={(e) => setKycForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country of Residence</Label>
                      <Select onValueChange={(value) => setKycForm(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border">
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="SG">Singapore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taxId">Tax ID / SSN</Label>
                      <Input
                        id="taxId"
                        value={kycForm.taxId}
                        onChange={(e) => setKycForm(prev => ({ ...prev, taxId: e.target.value }))}
                        placeholder="123-45-6789"
                        className="mt-1"
                      />
                    </div>
                    
                    <Button type="submit" disabled={isLoading} className="w-full btn-glow">
                      {isLoading ? 'Submitting...' : 'Submit KYC Application'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 glass-card">
              <TabsTrigger value="portfolio" className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="trade" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Trade</span>
              </TabsTrigger>
              <TabsTrigger value="transfer" className="flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Transfer</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <HoldingsTable holdings={holdings} onViewPassport={handleViewPassport} />
            </TabsContent>

            <TabsContent value="trade">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Buy/Sell Assets</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Select Asset</Label>
                      <Select onValueChange={setSelectedAsset}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose asset to trade" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border">
                          {demoAssets.map(asset => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.name} ({asset.symbol}) - ${asset.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Amount (tokens)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder="100"
                        className="mt-1"
                      />
                    </div>
                    
                    {selectedAsset && tradeAmount && (
                      <div className="p-3 bg-card/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Estimated Cost: <span className="font-semibold text-foreground">
                            ${(parseFloat(tradeAmount) * (demoAssets.find(a => a.id === selectedAsset)?.price || 0)).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleTrade('buy')} 
                        disabled={isLoading || !selectedAsset || !tradeAmount}
                        className="flex-1 btn-glow"
                      >
                        Buy
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleTrade('sell')} 
                        disabled={isLoading || !selectedAsset || !tradeAmount}
                        className="flex-1"
                      >
                        Sell
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Available Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {demoAssets.map(asset => (
                        <div
                          key={asset.id}
                          className="p-3 border border-border rounded-lg hover:bg-card/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{asset.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {asset.symbol}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {asset.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">${asset.price}</p>
                              <p className="text-xs text-muted-foreground">{asset.chain}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transfer">
              <Card className="glass-card max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Transfer Assets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-warning">Compliance Notice</p>
                        <p className="text-muted-foreground">
                          Transfers are only allowed to whitelisted addresses for regulatory compliance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                      <Label>Asset to Transfer</Label>
                      <Select onValueChange={(value) => setTransferForm(prev => ({ ...prev, assetId: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select asset from your holdings" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border">
                          {holdings.map(holding => (
                            <SelectItem key={holding.assetId} value={holding.assetId}>
                              {holding.assetName} ({holding.amount} available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Input
                        id="recipient"
                        value={transferForm.recipient}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, recipient: e.target.value }))}
                        placeholder="0x..."
                        className="mt-1 font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Demo whitelisted: 0x111111111111111111111111111111111111111111
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="transferAmount">Amount</Label>
                      <Input
                        id="transferAmount"
                        type="number"
                        value={transferForm.amount}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="10"
                        className="mt-1"
                      />
                    </div>
                    
                    <Button type="submit" disabled={isLoading} className="w-full btn-glow">
                      {isLoading ? 'Processing...' : 'Transfer Asset'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Investor;