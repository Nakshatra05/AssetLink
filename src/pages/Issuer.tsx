import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhitelistTable } from '@/components/WhitelistTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockMintAsset, mockUploadDocument, generateTxHash } from '@/lib/demo';
import { 
  Coins, 
  Upload, 
  Activity, 
  Shield,
  FileText,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

const Issuer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mintForm, setMintForm] = useState({
    name: '',
    symbol: '',
    type: '',
    jurisdiction: ''
  });
  const [uploadedDocs, setUploadedDocs] = useState<Array<{
    name: string;
    cid: string;
    hash: string;
    timestamp: Date;
  }>>([]);
  
  const { toast } = useToast();

  const handleMintAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintForm.name || !mintForm.symbol || !mintForm.type || !mintForm.jurisdiction) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockMintAsset(mintForm);
      toast({
        title: 'Asset Deployed Successfully!',
        description: `Transaction: ${result.txHash}`,
      });
      setMintForm({ name: '', symbol: '', type: '', jurisdiction: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to deploy asset',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const result = await mockUploadDocument(file);
      const newDoc = {
        name: file.name,
        cid: result.cid,
        hash: result.hash,
        timestamp: new Date()
      };
      setUploadedDocs(prev => [...prev, newDoc]);
      toast({
        title: 'Document Uploaded',
        description: `CID: ${result.cid}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activityItems = [
    {
      type: 'mint',
      title: 'Asset Minted: Kadena Tower REIT',
      description: 'Successfully deployed KTREIT token contract',
      timestamp: '2 hours ago',
      txHash: '0xDEMO123...abc'
    },
    {
      type: 'whitelist',
      title: 'Investor Whitelisted',
      description: 'Added 0x742d35Cc... to approved investors',
      timestamp: '4 hours ago',
      txHash: '0xDEMO456...def'
    },
    {
      type: 'document',
      title: 'Document Uploaded',
      description: 'Property deed verified and stored on IPFS',
      timestamp: '1 day ago',
      txHash: 'QmDemo123...'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Issuer Dashboard</h1>
          <p className="text-muted-foreground">
            Mint assets, manage compliance, and track investor activity
          </p>
        </motion.div>

        <Tabs defaultValue="mint" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="mint" className="flex items-center space-x-2">
              <Coins className="w-4 h-4" />
              <span>Mint Asset</span>
            </TabsTrigger>
            <TabsTrigger value="whitelist" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Whitelist</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mint">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Coins className="w-5 h-5" />
                  <span>Mint New Asset</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMintAsset} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Asset Name</Label>
                      <Input
                        id="name"
                        value={mintForm.name}
                        onChange={(e) => setMintForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Kadena Tower REIT"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="symbol">Token Symbol</Label>
                      <Input
                        id="symbol"
                        value={mintForm.symbol}
                        onChange={(e) => setMintForm(prev => ({ ...prev, symbol: e.target.value }))}
                        placeholder="KTREIT"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Asset Type</Label>
                      <Select onValueChange={(value) => setMintForm(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border">
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="commodities">Commodities</SelectItem>
                          <SelectItem value="art">Art & Collectibles</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="private-equity">Private Equity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="jurisdiction">Jurisdiction</Label>
                      <Select onValueChange={(value) => setMintForm(prev => ({ ...prev, jurisdiction: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border">
                          <SelectItem value="delaware">Delaware, USA</SelectItem>
                          <SelectItem value="singapore">Singapore</SelectItem>
                          <SelectItem value="cayman">Cayman Islands</SelectItem>
                          <SelectItem value="switzerland">Switzerland</SelectItem>
                          <SelectItem value="bermuda">Bermuda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isLoading} className="w-full btn-glow">
                    {isLoading ? 'Deploying...' : 'Deploy Asset Contract'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whitelist">
            <WhitelistTable />
          </TabsContent>

          <TabsContent value="documents">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Asset Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Asset Documentation</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload legal documents, property deeds, compliance certificates
                    </p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <Label htmlFor="file-upload">
                      <Button variant="outline" disabled={isLoading} className="cursor-pointer">
                        {isLoading ? 'Uploading...' : 'Choose File'}
                      </Button>
                    </Label>
                  </div>

                  {uploadedDocs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold">Uploaded Documents</h4>
                      {uploadedDocs.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-success" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                CID: {doc.cid}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="status-approved">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 border border-border rounded-lg"
                    >
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.type === 'mint' && <Coins className="w-5 h-5 text-primary" />}
                        {item.type === 'whitelist' && <Shield className="w-5 h-5 text-primary" />}
                        {item.type === 'document' && <FileText className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{item.timestamp}</span>
                          <span className="font-mono">{item.txHash}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Issuer;