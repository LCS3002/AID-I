import React, { createContext, useContext, useState } from 'react';
import type { ViewKey, PendingAction, Resource } from '../types';

interface AppState {
  activeView: ViewKey;
  navigate: (v: ViewKey) => void;
  cityName: string;
  setCityName: (c: string) => void;
  userLocation: [number, number] | null;
  setUserLocation: (loc: [number, number]) => void;
  resources: Resource[];
  setResources: (r: Resource[]) => void;
  resourcesLoading: boolean;
  setResourcesLoading: (v: boolean) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  transcript: string;
  setTranscript: (t: string) => void;
  recSecs: number;
  setRecSecs: (s: number) => void;
  aedIdx: number;
  setAedIdx: (i: number) => void;
  pendingAction: PendingAction;
  setPendingAction: (a: PendingAction) => void;
  vcListening: boolean;
  setVcListening: (v: boolean) => void;
  cmdToast: string;
  showCmdToast: (phrase: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ViewKey>('map');
  const [cityName, setCityName] = useState('Detecting location…');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recSecs, setRecSecs] = useState(0);
  const [aedIdx, setAedIdx] = useState(0);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [vcListening, setVcListening] = useState(false);
  const [cmdToast, setCmdToast] = useState('');

  function navigate(v: ViewKey) { setActiveView(v); }
  function openModal() { setIsModalOpen(true); }
  function closeModal() { setIsModalOpen(false); }

  function showCmdToast(phrase: string) {
    setCmdToast(`→ "${phrase}"`);
    setTimeout(() => setCmdToast(''), 1600);
  }

  return (
    <AppContext.Provider value={{
      activeView, navigate,
      cityName, setCityName,
      userLocation, setUserLocation,
      resources, setResources,
      resourcesLoading, setResourcesLoading,
      isModalOpen, openModal, closeModal,
      transcript, setTranscript,
      recSecs, setRecSecs,
      aedIdx, setAedIdx,
      pendingAction, setPendingAction,
      vcListening, setVcListening,
      cmdToast, showCmdToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppContextProvider');
  return ctx;
}
