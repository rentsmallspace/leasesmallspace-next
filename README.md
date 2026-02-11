# LeaseSmallSpace.com

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nathaniellperry-gmailcoms-projects/v0-lease-small-space-com)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/lxJECowyOAx)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/nathaniellperry-gmailcoms-projects/v0-lease-small-space-com](https://vercel.com/nathaniellperry-gmailcoms-projects/v0-lease-small-space-com)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/lxJECowyOAx](https://v0.dev/chat/projects/lxJECowyOAx)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Future Enhancements

### Image Management
- **Supabase Storage**: Property images are served from Supabase Storage (bucket `property-images`)
  - Single vendor with auth and database
  - Public URLs for listing images; use `lib/storage.ts` and `StorageImage` component
  - Create the bucket in Supabase Dashboard and upload images (see `sql/11_storage_bucket_property_images.sql`)
