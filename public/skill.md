---
name: aiinaction
version: 1.0.0
description: AI In Action - A hands-on AI learning platform. Browse challenges, create challenges, and mark them complete via API.
homepage: https://aiinaction.top
api_base: https://aiinaction.top/api/v1
---

# AI In Action - Agent Skill

AI In Action is a hands-on learning platform for AI builders. You can browse AI challenges across 10 categories, create your own community challenges, and mark challenges as complete to earn XP and achievements.

## Authentication

To use the API, you need an API key:

1. Sign in at https://aiinaction.top with your GitHub account
2. Go to your profile page
3. Click the "API Keys" tab
4. Generate a new API key

Use the key in all requests:

```
Authorization: Bearer aia_your_api_key_here
```

## Base URL

All endpoints are under: `https://aiinaction.top/api/v1`

## Endpoints

### List Challenges

`GET /challenges`

Query parameters:
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 50)
- `search` (string) -- search title and description
- `category` (string) -- filter by category slug (e.g., "ai-web", "ai-game", "ai-agents")
- `difficulty` (string) -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- `official` (string) -- "true" for official only, "false" for community only

No authentication required.

Response:
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": "...",
        "slug": "build-ai-chatbot",
        "title": "Build an AI Chatbot",
        "description": "...",
        "difficulty": "BEGINNER",
        "isOfficial": true,
        "likesCount": 42,
        "estimatedTime": "2-3 hours",
        "category": { "slug": "ai-web", "name": "AI Web" },
        "author": { "id": "...", "name": "...", "image": "..." },
        "tags": ["chatbot", "openai", "nextjs"]
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### Get Challenge Detail

`GET /challenges/:slug`

No authentication required.

Response:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "slug": "build-ai-chatbot",
    "title": "Build an AI Chatbot",
    "description": "Full description...",
    "difficulty": "BEGINNER",
    "objectives": ["Implement chat UI", "Connect to OpenAI API"],
    "hints": ["Use streaming for better UX"],
    "resources": ["https://platform.openai.com/docs"],
    "estimatedTime": "2-3 hours",
    "isOfficial": true,
    "likesCount": 42,
    "category": { "slug": "ai-web", "name": "AI Web" },
    "author": { "id": "...", "name": "...", "image": "..." },
    "tags": ["chatbot", "openai", "nextjs"],
    "forkedFrom": null
  }
}
```

### Create Challenge

`POST /challenges`

**Authentication required.**

Request body:
```json
{
  "title": "My AI Challenge",
  "description": "Build something cool with AI...",
  "difficulty": "INTERMEDIATE",
  "categoryId": "optional-category-id",
  "tags": ["tag1", "tag2"],
  "objectives": ["Objective 1", "Objective 2"],
  "hints": ["Hint 1"],
  "resources": ["https://example.com"],
  "estimatedTime": "1-2 hours"
}
```

Required fields: `title`, `description`, `difficulty`

Response:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "slug": "my-ai-challenge",
    "title": "My AI Challenge",
    "url": "https://aiinaction.top/challenges/my-ai-challenge"
  }
}
```

### Update Challenge

`PUT /challenges/:slug`

**Authentication required.** You can only update challenges you authored.

Request body: Same fields as create (all optional for partial updates).

### Mark Challenge Complete

`POST /challenges/:slug/complete`

**Authentication required.**

Response:
```json
{
  "success": true,
  "data": {
    "completed": true,
    "alreadyCompleted": false,
    "xpGained": 25,
    "achievements": [
      { "name": "First Steps", "icon": "target", "xpReward": 10 }
    ]
  }
}
```

### List Categories

`GET /categories`

No authentication required.

Response:
```json
{
  "success": true,
  "data": [
    { "id": "...", "slug": "ai-web", "name": "AI Web", "description": "...", "icon": "globe" }
  ]
}
```

### Get My Profile

`GET /me`

**Authentication required.**

Response:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Your Name",
    "email": "...",
    "image": "...",
    "stats": { "xp": 150, "level": 3, "currentStreak": 5 },
    "completedChallenges": 10,
    "publishedChallenges": 3
  }
}
```

## Error Format

All errors follow:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

Common error codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `BAD_REQUEST`

## Suggested Workflow

1. **Browse challenges**: `GET /challenges` to find interesting challenges
2. **Read details**: `GET /challenges/:slug` to understand requirements
3. **Complete challenges**: Build the project, then `POST /challenges/:slug/complete`
4. **Create challenges**: `POST /challenges` to share your own challenge ideas
5. **Check progress**: `GET /me` to see your XP, level, and stats

## Rate Limits

No rate limits are currently enforced, but please be respectful with request volume. We recommend keeping reads under 60/min and writes under 30/min.
