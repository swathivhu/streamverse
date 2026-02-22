# **App Name**: StreamVerse

## Core Features:

- User Registration: Allow users to register with User ID, Username, Email, Phone Number, and Password, storing details (with hashed passwords) in Firestore.
- Secure Login: Authenticate users by verifying username and hashed password against stored values in Firestore. Redirect to the landing page on success.
- Landing Page Authentication: Protect the landing page, ensuring only logged-in users can access it. Redirect unauthorized users to the login page.
- Netflix-style Landing Page: Display a hero section with a banner and rows of movie content.
- Logout Functionality: Enable users to log out and redirect them to the login page.
- Trailer Generation Tool: AI-powered tool to generate personalized trailer snippets based on user viewing history. LLM will reason when user data is sufficient for trailer generation and when a generic trailer should be shown instead.

## Style Guidelines:

- Primary color: Deep, rich red (#B81D24), inspired by Netflix, represents drama, energy, and passion.
- Background color: Dark, almost black (#121212), analogous to the primary hue, provides high contrast.
- Accent color: Subtle grey (#A9A9A9), lighter analogous to the primary hue, to add highlight and visual interest without distracting from the content.
- Body and headline font: 'Inter', a sans-serif font known for its legibility and modern feel, suitable for both headlines and body text.
- Use a set of simple, minimalist icons for navigation and controls.
- Responsive, grid-based layout with a focus on large, edge-to-edge content displays.
- Subtle transition effects and animations to enhance the user experience without being intrusive.