import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PesertaArisan from "./pages/PesertaArisan";
import Setoran from "./pages/Setoran";
import Undian from "./pages/Undian";
import Laporan from "./pages/Laporan";
import AdminIuran from "@/pages/AdminIuran";
import Pengeluaran from "./pages/Pengeluaran";
import Import from "./pages/Import";
import ManualMigration from "./pages/ManualMigration";
import MigrasiSaldo from "./pages/MigrasiSaldo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/peserta-arisan" element={<PesertaArisan />} />
          <Route path="/setoran" element={<Setoran />} />
          <Route path="/undian" element={<Undian />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/admin/iuran" element={<AdminIuran />} />
          <Route path="/pengeluaran" element={<Pengeluaran />} />
          <Route path="/import" element={<Import />} />
          <Route path="/manual-migration" element={<ManualMigration />} />
          <Route path="/migrasi-saldo" element={<MigrasiSaldo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
