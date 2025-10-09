// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- State Management ---
  // State for the TikTok link input
  const [link, setLink] = useState('');
  
  // New state to handle the selected brand (only one can be selected)
  const [selectedBrand, setSelectedBrand] = useState('npBrand'); // 'npBrand' or 'personalBrand'

  // State to manage the button's text and disabled status
  const [buttonState, setButtonState] = useState({
    text: 'Import to ClickUp',
    disabled: false,
  });

  // --- Logic for Handling Shared Links ---
  // This useEffect runs once when the app loads to catch shared links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedText = urlParams.get('text');

    if (sharedText) {
      // If a link was shared, pre-fill the input field
      setLink(sharedText);
      // Clean up the URL so the logic doesn't run again on a refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // --- Form Submission Logic ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    if (!link) {
      alert('A TikTok link is required!');
      return;
    }

    // Disable the button and show a "Sending..." message
    setButtonState({ text: 'Sending...', disabled: true });

    // --- Replace with your actual Make.com webhook URL ---
    const webhookURL = 'https://hook.eu2.make.com/g4fkk3lfcwfy8x9qes56ro7fdovrv9yu';

    // Prepare the data to send to Make.com based on the selected brand
    const payload = {
      link: link,
      isNpBrand: selectedBrand === 'npBrand',
      isPersonalBrand: selectedBrand === 'personalBrand',
    };

    try {
      // Send the data to the webhook
      await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // On success, update the button to "Done!"
      setButtonState({ text: 'Done!', disabled: true });

    } catch (error) {
      console.error('Failed to send to Make.com:', error);
      alert('Sorry, there was an error.');
      // Re-enable the button if there was an error
      setButtonState({ text: 'Import to ClickUp', disabled: false });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Nobody's Princess TikTok Tracker 👑</h1>
      </header>
      <main>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* --- TikTok Link Input --- */}
            <label htmlFor="link-input">TikTok Link</label>
            <input
              id="link-input"
              type="url"
              placeholder="Share from TikTok or paste link here"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />

            {/* --- Brand Radio Button Selector --- */}
            <div className="radio-group-container">
              <label className="radio-label">
                <input
                  type="radio"
                  name="brand"
                  value="npBrand"
                  checked={selectedBrand === 'npBrand'}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                />
                <span className="radio-text">NP Brand</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="brand"
                  value="personalBrand"
                  checked={selectedBrand === 'personalBrand'}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                />
                <span className="radio-text">Personal Brand</span>
              </label>
            </div>
            
            {/* --- Submit Button --- */}
            <button type="submit" disabled={buttonState.disabled}>
              {buttonState.text}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
