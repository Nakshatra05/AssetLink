import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, User } from 'lucide-react';

interface KycStatusProps {
  status: 'not-started' | 'pending' | 'approved' | 'rejected';
  className?: string;
}

export function KycStatus({ status, className }: KycStatusProps) {
  const statusConfig = {
    'not-started': {
      icon: User,
      label: 'Not Started',
      className: 'bg-muted text-muted-foreground border-muted'
    },
    pending: {
      icon: Clock,
      label: 'Pending Review',
      className: 'status-pending'
    },
    approved: {
      icon: CheckCircle,
      label: 'Verified',
      className: 'status-approved'
    },
    rejected: {
      icon: XCircle,
      label: 'Rejected',
      className: 'status-blocked'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} ${className}`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {config.label}
    </Badge>
  );
}