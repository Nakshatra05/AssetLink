import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye } from 'lucide-react';
import { Holding } from '@/lib/demo';

interface HoldingsTableProps {
  holdings: Holding[];
  onViewPassport: (assetId: string) => void;
}

export function HoldingsTable({ holdings, onViewPassport }: HoldingsTableProps) {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  if (holdings.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Holdings</h3>
            <p className="text-muted-foreground">Complete KYC verification to start investing in tokenized assets.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Portfolio Holdings</CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold gradient-text">${totalValue.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {holdings.map((holding) => (
            <div
              key={`${holding.assetId}-${holding.chain}`}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="font-medium text-foreground">{holding.assetName}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {holding.symbol}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {holding.chain}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right mr-4">
                <p className="font-medium text-foreground">{holding.amount.toLocaleString()} tokens</p>
                <p className="text-sm text-muted-foreground">${holding.value.toLocaleString()}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewPassport(holding.assetId)}
                  className="h-8"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Passport
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}