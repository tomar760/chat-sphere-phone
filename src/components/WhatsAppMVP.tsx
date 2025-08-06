import { useState } from "react";
import { AuthScreen } from "./AuthScreen";
import { ContactList, Contact } from "./ContactList";
import { ChatInterface } from "./ChatInterface";

export const WhatsAppMVP = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle authentication
  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  // Mobile view with navigation
  if (isMobileView && selectedContact) {
    return (
      <div className="h-screen">
        <ChatInterface
          contact={selectedContact}
          onBack={() => setSelectedContact(null)}
        />
      </div>
    );
  }

  // Desktop view or mobile contact list
  return (
    <div className="h-screen flex">
      {/* Contact List - Always visible on desktop, only when no contact selected on mobile */}
      <div className={`${isMobileView ? 'w-full' : 'w-80'} ${selectedContact && isMobileView ? 'hidden' : 'block'}`}>
        <ContactList
          onContactSelect={setSelectedContact}
          selectedContactId={selectedContact?.id}
        />
      </div>

      {/* Chat Interface - Only visible on desktop or when contact selected on mobile */}
      {selectedContact && !isMobileView && (
        <div className="flex-1">
          <ChatInterface contact={selectedContact} />
        </div>
      )}

      {/* Empty state for desktop when no contact selected */}
      {!selectedContact && !isMobileView && (
        <div className="flex-1 flex items-center justify-center bg-chat-bg">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-whatsapp-green rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl text-white">💬</span>
            </div>
            <h3 className="text-2xl font-semibold text-muted-foreground">
              Welcome to ChatSphere
            </h3>
            <p className="text-muted-foreground max-w-md">
              Select a conversation from the sidebar to start messaging with your contacts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};