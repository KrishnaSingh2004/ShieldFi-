import { useEffect } from "react";
import { Shield, Bell, User } from "lucide-react";
import MetricsGrid from "@/components/MetricsGrid";
import TransactionDecisionPanel from "@/components/TransactionDecisionPanel";
import TransactionLog from "@/components/TransactionLog";
import AIChat from "@/components/AIChat";
import NotificationPanel from "@/components/NotificationPanel";
import SimulationPanel from "@/components/SimulationPanel";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
 
export default function Dashboard() {
  const { isConnected, lastMessage } = useWebSocket();
  const { toast } = useToast();
 
  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === 'transaction_alert') {
      toast({
        title: lastMessage.data?.title || "Transaction Alert",
        description: lastMessage.data?.message,
        variant: lastMessage.data?.priority === 'critical' ? 'destructive' : 'default'
      });
    }
  }, [lastMessage, toast]);
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="text-primary text-2xl" />
              <h1 className="text-2xl font-bold text-foreground">ShieldFi</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              <a 
                href="#" 
                className="text-sm font-medium text-primary border-b-2 border-primary pb-1"
                data-testid="nav-dashboard"
              >
                Dashboard
              </a>
              <a 
                href="#" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-transactions"
              >
                Transactions
              </a>
              <a 
                href="#" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-analytics"
              >
                Analytics
              </a>
              <a 
                href="#" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-settings"
              >
                Settings
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span 
                className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}
                data-testid="connection-status"
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Bell className="text-muted-foreground" size={20} />
              <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
                3
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User size={16} className="text-muted-foreground" />
              </div>
              <span className="text-sm font-medium" data-testid="user-name">Admin User</span>
            </div>
          </div>
        </div>
      </header>
 
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border hidden lg:block">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Overview
                </h3>
                <nav className="space-y-1">
                  <a 
                    href="#" 
                    className="flex items-center space-x-3 px-3 py-2 bg-primary/10 text-primary rounded-md"
                    data-testid="sidebar-dashboard"
                  >
                    <Shield size={20} />
                    <span className="font-medium">Dashboard</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </aside>
 
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Metrics Grid */}
            <MetricsGrid />
 
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Transaction Decision Panel and Log */}
              <div className="lg:col-span-2 space-y-6">
                <TransactionDecisionPanel />
                <TransactionLog />
              </div>
 
              {/* Right Column - AI Chat, Notifications, Simulation */}
              <div className="space-y-6">
                <AIChat />
                <NotificationPanel />
                <SimulationPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
