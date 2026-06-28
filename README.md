# 👨‍🍳 Flavora (Rasoi AI)

![Flavora Hero](public/logo.png)

**Flavora (Rasoi AI)** is a next-generation AI-powered premium kitchen assistant built to revolutionize your cooking experience. By leveraging the power of Google's Gemini AI and dynamic image generation, Flavora provides authentic, culturally rich, and incredibly accurate recipes based on what you crave or what ingredients you have in your fridge.

## ✨ Features

- **🧠 AI Recipe Generator:** Tell the AI what you want to eat (e.g., "Authentic Butter Chicken"), and it will generate a complete, traditional recipe with precise measurements and steps.
- **📸 Dynamic AI Plating:** Every generated recipe instantly fetches a stunning, high-quality, cinematic AI-generated photo of the exact dish using Pollinations AI.
- **🧅 Smart Ingredient Scanner (Pantry Mode):** Input whatever leftovers you have in your fridge, and the AI will figure out the most delicious meal you can make with them to prevent food waste.
- **🔥 Firebase Authentication:** Secure, seamless email & password login with route protection.
- **🔖 Saved Recipes Collection:** Loved a recipe? Save it directly to your digital cookbook (Firestore database) and access it anytime in your dashboard.
- **🌊 Beautiful UI/UX:** Built with Tailwind CSS, Glassmorphism design principles, Framer Motion page transitions, and an interactive 3D WebGL background using Three.js.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Backend/DB:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **AI Models:** Google [Gemini API](https://ai.google.dev/) (Text) & [Pollinations AI](https://pollinations.ai/) (Images)

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/flavora-ai.git
cd flavora-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your keys:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
GEMINI_API_KEY="your-gemini-key"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌍 Deployment (Vercel)

The easiest way to deploy this Next.js app is to use [Vercel](https://vercel.com/):
1. Connect your GitHub repository to Vercel.
2. In the Vercel dashboard, add all the environment variables from your `.env.local` file.
3. Click **Deploy**. Vercel will automatically build and host the application!

---

*Built with ❤️ and AI.*
