# Dancer App

A mobile app for salsa dancers to find local salsa socials and purchase tickets.

## Tech Stack
- React + TypeScript (Vite)
- Supabase (database, auth, Edge Functions)
- Stripe (payments)
- Capacitor (Android/iOS native wrapper)

## Local Development

1. Install dependencies:
   npm install

2. Create a `.env` file in the project root with:
   VITE_SUPABASE_URL=located at Integrations -> Data API -> Overview
   VITE_SUPABASE_ANON_KEY= Project Settings -> API Keys -> Legacy anon, service_role API keys
   VITE_STRIPE_PUBLISHABLE_KEY= on Stripe dashboard (sandbox for the demo)

3. Run the dev server:
   npm run dev

## Rebuilding the Android App

After making code changes, the Android app won't update automatically. Run:

   npm run build
   npx cap sync
   npx cap open android

Then re-run from Android Studio.

## Backend

Stripe secret key and checkout logic live in a Supabase Edge Function
(`supabase/functions/create-checkout-session`), deployed via:

   npx supabase functions deploy create-checkout-session --use-api