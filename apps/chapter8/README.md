# Chapter 8: Forms and Authentication

## Overview

This chapter focuses on handling forms and authentication in web scraping. The companion website is a travel booking platform that requires user authentication to access premium content and features.

## Website Features

- **User Authentication System**: Registration and login flows with CSRF protection
- **Multi-step Booking Form**: Destination search with autocomplete, date selection, filtering options, and results display
- **Session Management**: Cookie-based authentication with session timeout
- **Protected Content**: Premium listings only accessible to authenticated users
- **User Profiles**: Save search preferences to user accounts

## Learning Objectives

1. Automate form submissions for search, filtering, and authentication
2. Handle login flows and maintain authenticated sessions
3. Extract data from protected areas of websites
4. Work with multi-step processes and form workflows
5. Manage cookies and session state across multiple requests

## Technical Implementation

- Built with Next.js and NextAuth.js for authentication
- Uses Prisma with SQLite for data storage
- Implements form validation and CSRF protection
- Demonstrates proper session management techniques

## Scraping Challenge

Create a scraper that can:

1. Register a new user account (or log in with existing credentials)
2. Navigate through the multi-step booking form to search for travel options
3. Apply filters such as date range, price, and amenities
4. Extract both public and premium listing details
5. Save search preferences to the user's profile
6. Handle session timeouts by re-authenticating when necessary

## Solution Approach

Students should use Playwright or a similar tool that can:

- Manage browser sessions and cookies
- Fill and submit forms with proper validation handling
- Extract and utilize CSRF tokens
- Navigate through multi-step processes
- Handle conditional logic based on authentication state

## Running the Website

```bash
# From the chapter8 directory
npm install
npm run setup    # Sets up the database with sample data
npm run dev      # Starts the development server on port 3008
```

The site will be available at http://localhost:3008

Demo user credentials:
- Email: demo@example.com
- Password: password123