import { AppContextProvider } from './context/AppContext';
import { AppShellWithVoice } from './AppShellWithVoice';

export default function App() {
  return (
    <AppContextProvider>
      <AppShellWithVoice />
    </AppContextProvider>
  );
}
