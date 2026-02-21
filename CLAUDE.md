# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GR attitude** is a structured mutual aid platform — an action-oriented social network for organizing help requests (Missions) and help offers (Offres). The platform transforms needs into structured "tickets" that can be tracked from creation to resolution.

This project is currently in the **planning/specification phase** with a comprehensive PRD but no implemented code yet.

## Core Concepts

- **Mission**: A structured help request with fields for title, description, category, help_type (financière/conseil/matériel/relation), urgency, location, and status (ouverte → en_cours → résolue/expirée)
- **Offre**: A help offer that auto-correlates with matching Missions
- **Contribution**: User engagement on a Mission (types: participe/propose/finance/conseille)
- **Matching**: Algorithm correlating Missions ↔ Offres based on tags, geography, help type, and recency

## Planned Technology Stack

### Backend
- Node.js / NestJS for API
- PostgreSQL with PostGIS for geospatial features
- Redis for caching and sessions
- Stripe for payments (cagnottes)

### Frontend
- React Native or Flutter (mobile)
- React/Next.js (web)

### Infrastructure
- AWS/GCP/Azure (containerized)
- Cloudflare CDN/WAF
- GitHub Actions for CI/CD

## Key Architecture Decisions

- PostgreSQL GEOGRAPHY type with GIST indexes for location-based queries
- JWT + OAuth2 authentication with bcrypt/Argon2 password hashing
- Missions expire automatically at J+30 with J+25 reminder notification
- Only Mission creator can close it
- Private user statistics (no public competitive scoring)
- All data must comply with RGPD (EU hosting, consent, right to erasure)

## Database Schema

The PRD (§11.3) contains complete SQL schema with tables: users, missions, offers, contributions, correlations, groups, group_members, fundraisers, donations, notifications, badges, user_badges.

Key indexes are defined for geospatial queries (GIST on location), tag search (GIN on tags array), and common lookups.

## API Structure

Full endpoint specification in PRD (§11.4). Main resource groups:
- `/auth/*` - Authentication and RGPD account deletion
- `/missions/*` - Mission CRUD, closure, contributions, correlations
- `/offers/*` - Offer CRUD and correlations
- `/contributions/*` - Engagement management
- `/fundraisers/*` - Cagnotte (crowdfunding) operations
- `/groups/*` - Private group management
- `/users/me/*` - Profile, stats, badges, notifications
- `/matching/suggestions` - Personalized correlations

## MVP Priorities (in order)

1. Mission creation with guided form
2. 4-type engagement system on Missions
3. Simple correlation (tags + geography)
4. Closure workflow with notifications
5. Exploration feed with filters
6. Offer creation
7. User profile + history

## Product Principles

- Radical simplicity — minimal friction to publish a need
- Bilateral responsibility — both requester and helper are actors
- Non-toxic gamification — private stats only, no public leaderboards
- No humiliation of help-seekers
- Action over scroll — this is not a social feed
