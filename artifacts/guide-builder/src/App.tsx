import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/app-layout";

import Dashboard from "@/pages/dashboard";
import GuidesList from "@/pages/guides";
import GuideBuilder from "@/pages/guide-new";
import GuideDetail from "@/pages/guide-detail";
import GuideEditor from "@/pages/guide-edit";
import PublicFormPage from "@/pages/public-form";
import ScribePage from "@/pages/scribe";
import RdqaPortalPage from "@/pages/rdqa-portal";
import RdqaConditionsPage from "@/pages/rdqa-conditions";
import RdqaChecklistPage from "@/pages/rdqa-checklist";
import RdqaProviderLetterPage from "@/pages/rdqa-provider-letter";
import RdqaReadinessPage from "@/pages/rdqa-readiness";
import RdqaTimelinePage from "@/pages/rdqa-timeline";
import RdqaReportingPage from "@/pages/rdqa-reporting";
import RdqaResourcesPage from "@/pages/rdqa-resources";
import RdqaStatusPage from "@/pages/rdqa-status";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public form page — no sidebar/layout */}
      <Route path="/forms/:token" component={PublicFormPage} />

      {/* App pages inside layout */}
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/guides" component={GuidesList} />
            <Route path="/guides/new" component={GuideBuilder} />
            <Route path="/guides/:id" component={GuideDetail} />
            <Route path="/guides/:id/edit" component={GuideEditor} />
            <Route path="/scribe" component={ScribePage} />
            <Route path="/rdqa" component={RdqaPortalPage} />
            <Route path="/rdqa/conditions" component={RdqaConditionsPage} />
            <Route path="/rdqa/checklist" component={RdqaChecklistPage} />
            <Route path="/rdqa/provider-letter" component={RdqaProviderLetterPage} />
            <Route path="/rdqa/resources" component={RdqaResourcesPage} />
            <Route path="/rdqa/readiness" component={RdqaReadinessPage} />
            <Route path="/rdqa/timeline" component={RdqaTimelinePage} />
            <Route path="/rdqa/status" component={RdqaStatusPage} />
            <Route path="/rdqa/reporting" component={RdqaReportingPage} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
