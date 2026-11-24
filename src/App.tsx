import { AuthProvider } from './app/providers/AuthProvider';
import { CurrencyProvider } from './app/providers/CurrencyProvider';
import { NavigationProvider } from './app/providers/NavigationProvider';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AppShellLayout } from './app/layouts/AppShellLayout';
import { AppRouter } from './app/router';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <NavigationProvider>
              <AppShellLayout>
                <AppRouter />
              </AppShellLayout>
            </NavigationProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
