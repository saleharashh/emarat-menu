import { Route, Switch, Redirect } from "wouter";

import Home from "@/app/page";
import AdminPage from "@/app/admin/page";
import AdminLoginPage from "@/app/admin/login/page";
import { CartProvider } from "@/components/cart-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { AmbientGlassBackground } from "@/components/ui/ambient-glass-background";
import { Toaster } from "@/components/ui/toast";

export function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
        <AmbientGlassBackground />
        <CartProvider>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/admin/login" component={AdminLoginPage} />
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </CartProvider>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
