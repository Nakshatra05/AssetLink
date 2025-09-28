import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';

export function WhitelistTable() {
  const [newAddress, setNewAddress] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const { whitelistAddresses, addToWhitelist, removeFromWhitelist } = useAppStore();

  const handleAddAddress = () => {
    if (!newAddress.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid address',
        variant: 'destructive',
      });
      return;
    }

    if (whitelistAddresses.includes(newAddress)) {
      toast({
        title: 'Error',
        description: 'Address already whitelisted',
        variant: 'destructive',
      });
      return;
    }

    addToWhitelist(newAddress);
    setNewAddress('');
    setIsOpen(false);
    toast({
      title: 'Success',
      description: 'Address added to whitelist',
    });
  };

  const handleRemoveAddress = (address: string) => {
    removeFromWhitelist(address);
    toast({
      title: 'Success',
      description: 'Address removed from whitelist',
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Investor Whitelist</span>
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="btn-glow">
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border">
              <DialogHeader>
                <DialogTitle>Add to Whitelist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Wallet Address</Label>
                  <Input
                    id="address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="0x..."
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleAddAddress} className="w-full btn-glow">
                  Add to Whitelist
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {whitelistAddresses.map((address, index) => (
            <div
              key={address}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-card/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground font-mono text-sm">
                    {address}
                  </p>
                  <Badge variant="outline" className="status-approved text-xs mt-1">
                    Verified
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveAddress(address)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          {whitelistAddresses.length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Addresses Whitelisted</h3>
              <p className="text-muted-foreground">Add investor addresses to enable compliant transfers.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}