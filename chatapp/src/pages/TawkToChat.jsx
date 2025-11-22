import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';


const TawkToChat = () => {
  const { user, loading: authLoading } = useAuthStore();
  const PROPERTY_ID = '6918ea4d4f9eb4194d957cfb';
  const WIDGET_ID = '1ja4l6gnt';
  const SCRIPT_URL = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;

  useEffect(() => {
    // Skip during auth loading
    if (authLoading) return;

    // Prevent multiple loads
    if (window.Tawk_API && window.Tawk_LoadStart) {
      console.log('Tawk.to already loaded—updating attributes if user changed');
      updateUserAttributes();
      return;
    }

    // ✅ CRITICAL: Set up API and onLoad BEFORE script load (per docs)
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Define onLoad callback here—fires once widget renders
    window.Tawk_API.onLoad = function() {
      console.log('Tawk.to widget fully loaded and ready');
      // Initial attributes if user exists
      if (user) {
        updateUserAttributes();
      }
      // Adjust widget position to move up (avoid overlap with bottom nav/profile)
      adjustWidgetPosition();
    };

    // Dynamically load script (your exact snippet)
    (function() {
      var s1 = document.createElement('script');
      var s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src = SCRIPT_URL;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();

    // Helper to safely set attributes (call only when ready)
    function updateUserAttributes() {
      // Poll briefly to ensure API is ready (avoids "not a function" error)
      const pollForReady = setInterval(() => {
        if (window.Tawk_API && typeof window.Tawk_API.setAttributes === 'function') {
          clearInterval(pollForReady);
          window.Tawk_API.setAttributes({
            name: user.name || 'Visitor',
            email: user.email || null,
            // hash: 'your-hmac-sha256-here-if-secure-mode-enabled', // Add server-generated hash
            // Add custom: e.g., county: user.county || 'Nairobi'
          }, function(error) {
            if (error) {
              console.error('Tawk.to setAttributes error:', error);
            } else {
              console.log('User attributes set successfully');
            }
          });
        }
      }, 500); // Poll every 500ms, max ~2s

      // Timeout to stop polling
      setTimeout(() => clearInterval(pollForReady), 5000);
    }

    // Helper to adjust widget position (move up by ~70px to clear h-16 bottom nav)
    function adjustWidgetPosition() {
      // Poll for widget element to exist
      const pollForWidget = setInterval(() => {
        const widget = document.querySelector('#tawk_6918ea4d4f9eb4194d957cfb_1ja4l6gnt, .tawkto-widget');
        if (widget) {
          clearInterval(pollForWidget);
          // Apply custom styles to move up
          widget.style.bottom = '70px !important'; // Adjust as needed (h-16 ~64px + padding)
          widget.style.right = '16px'; // Optional: fine-tune horizontal if needed
          console.log('Tawk.to widget position adjusted');
        }
      }, 500);

      // Timeout to stop polling
      setTimeout(() => clearInterval(pollForWidget), 5000);
    }

    // Cleanup: Reset on unmount (optional, for route changes)
    return () => {
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };
  }, [user, authLoading]); // Re-run on user/auth change

  return null; // Invisible—widget floats
};

export default TawkToChat;