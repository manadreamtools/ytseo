import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CRM from './components/CRM';
import Auth from './components/Auth';
import VoiceControl from './components/VoiceControl';
import { User } from './types';
import { loadUsers, getCurrentUser, logoutUser } from './services/authService';
import { CRMContact } from './types';
import { loadCRM, saveCRM } from './services/storageService';

type View = 'dashboard' | 'crm' | 'auth';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [crmData, setCrmData] = useState<CRMContact[]>([]);
  // State to pass voice commands to Dashboard
  const [autoSearchQuery, setAutoSearchQuery] = useState<string | null>(null);

  useEffect(() => {
    // Initialize mock users if empty
    loadUsers();
    
    // Check for active session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCrmData(loadCRM(currentUser.username));
    }
  }, []);

  // Effect to handle view protection
  useEffect(() => {
    if (currentView === 'crm' && !user) {
      setCurrentView('auth');
    }
  }, [currentView, user]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCrmData(loadCRM(loggedInUser.username));
    setCurrentView('crm');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCrmData([]);
    setCurrentView('dashboard');
  };

  const handleCrmUpdate = (newData: CRMContact[]) => {
    if (user) {
      setCrmData(newData);
      saveCRM(user.username, newData);
    }
  };
  
  const handleVoiceAnalyze = (query: string) => {
      setCurrentView('dashboard');
      // Slight delay to ensure view mount
      setTimeout(() => {
          setAutoSearchQuery(query);
      }, 100);
  };

  return (
    <>
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        user={user}
      />
      
      <main className="flex-grow p-4 sm:p-8 relative max-w-7xl mx-auto w-full">
        {currentView === 'dashboard' && (
          <Dashboard 
            user={user} 
            onAddToCrm={(contact) => {
              if (!user) return;
              const exists = crmData.some(c => c.id === contact.id);
              if (!exists) {
                const newData = [...crmData, contact];
                handleCrmUpdate(newData);
              }
            }}
            autoSearchQuery={autoSearchQuery}
            onSearchComplete={() => setAutoSearchQuery(null)}
          />
        )}
        
        {currentView === 'crm' && user && (
          <CRM 
            data={crmData} 
            onUpdate={handleCrmUpdate} 
            onLogout={handleLogout}
          />
        )}

        {currentView === 'auth' && !user && (
          <Auth onLogin={handleLogin} />
        )}
      </main>

      <VoiceControl 
        onNavigate={(view) => {
            // If user asks for CRM but isn't logged in, it will redirect to Auth automatically via the useEffect
            setCurrentView(view);
        }}
        onAnalyze={handleVoiceAnalyze}
      />

      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="text-center text-gray-500 text-sm">
          Powered by ManaDream.in
        </div>
      </footer>
    </>
  );
};

export default App;