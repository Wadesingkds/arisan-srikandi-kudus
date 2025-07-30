import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, Settings, HelpCircle } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import SimpleDashboard from "@/components/SimpleDashboard";
import MobileDashboard from "@/components/MobileDashboard";
import { useState, useEffect } from "react";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [useSimpleMode, setUseSimpleMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  // Return mobile dashboard for mobile devices
  if (isMobile) {
    return <MobileDashboard />;
  }

  return (
    <div className="relative">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={useSimpleMode ? "default" : "outline"}
            size="sm"
            onClick={() => setUseSimpleMode(!useSimpleMode)}
            className="bg-white/80 backdrop-blur-sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            {useSimpleMode ? "Mode Lengkap" : "Mode Sederhana"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelp(true)}
            className="bg-white/80 backdrop-blur-sm"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Bantuan
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Link to="/admin/iuran">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              Admin Iuran
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </div>
      
      {useSimpleMode ? (
        <SimpleDashboard />
      ) : (
        <Dashboard />
      )}
      
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
            <h3 className="text-lg font-semibold mb-4">Panduan Cepat</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                <p>Untuk user awam, gunakan "Mode Sederhana" dengan tombol yang lebih besar</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">2</div>
                <p>Klik "Bantuan" untuk panduan langkah demi langkah</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">3</div>
                <p>Semua tombol memiliki petunjuk yang jelas</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => setShowHelp(false)}
            >
              Mengerti
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
