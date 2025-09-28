import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { demoDocuments } from '@/lib/demo';
import { 
  FileText, 
  Shield, 
  Calendar, 
  Hash, 
  Building2,
  CheckCircle,
  ExternalLink,
  Download,
  Clock
} from 'lucide-react';

const AssetPassport = () => {
  const { cid } = useParams();
  
  // Find document by CID
  const document = demoDocuments.find(doc => doc.cid === cid);
  
  if (!document) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Document Not Found</h1>
          <p className="text-muted-foreground">The requested asset passport could not be located.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const verificationData = [
    {
      label: 'Document Hash',
      value: document.hash,
      type: 'hash' as const
    },
    {
      label: 'IPFS CID',
      value: document.cid,
      type: 'cid' as const
    },
    {
      label: 'Upload Date',
      value: document.uploadedAt.toLocaleDateString(),
      type: 'date' as const
    },
    {
      label: 'Issuing Entity',
      value: document.issuer,
      type: 'issuer' as const
    }
  ];

  const complianceChecks = [
    { label: 'Document Integrity', status: 'verified', description: 'Cryptographic hash verified' },
    { label: 'Issuer Verification', status: 'verified', description: 'Authorized issuing entity' },
    { label: 'Regulatory Compliance', status: 'verified', description: 'SEC filing requirements met' },
    { label: 'Chain of Custody', status: 'verified', description: 'Complete ownership history' }
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
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Asset Passport</h1>
              <p className="text-muted-foreground">Immutable document verification</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className={document.verified ? 'status-approved' : 'status-blocked'}>
              {document.verified ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Document Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{document.name}</h3>
                
                <div className="space-y-4">
                  {verificationData.map((item, index) => (
                    <div key={index} className="border-l-2 border-primary/30 pl-4">
                      <label className="text-sm text-muted-foreground">{item.label}</label>
                      <div className="flex items-center space-x-2 mt-1">
                        {item.type === 'hash' && <Hash className="w-4 h-4 text-muted-foreground" />}
                        {item.type === 'cid' && <FileText className="w-4 h-4 text-muted-foreground" />}
                        {item.type === 'date' && <Calendar className="w-4 h-4 text-muted-foreground" />}
                        {item.type === 'issuer' && <Building2 className="w-4 h-4 text-muted-foreground" />}
                        <span className={`${item.type === 'hash' || item.type === 'cid' ? 'font-mono text-sm' : 'font-medium'}`}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="btn-glow">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on IPFS
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Verification */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Compliance Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceChecks.map((check, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 border border-border rounded-lg"
                  >
                    <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{check.label}</h4>
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-success/10 border border-success/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h4 className="font-semibold text-success">Fully Compliant</h4>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This document meets all regulatory requirements and has been cryptographically verified.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blockchain Timeline */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Document Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Document Created</h4>
                  <p className="text-sm text-muted-foreground">
                    Original document generated and signed by {document.issuer}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {document.uploadedAt.toLocaleDateString()} - {document.uploadedAt.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Hash className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Hash Generated</h4>
                  <p className="text-sm text-muted-foreground">
                    Cryptographic fingerprint created for document integrity
                  </p>
                  <span className="text-xs text-muted-foreground font-mono">
                    {document.hash}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Blockchain Anchored</h4>
                  <p className="text-sm text-muted-foreground">
                    Document hash permanently recorded on Kadena EVM
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Tx: 0xDEMO789...anchor
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AssetPassport;