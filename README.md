# Quick Don't Draw

A single-player social-deduction drawing game where one human plays alongside three AI players. Most players receive the same secret prompt while one player receives a different prompt. After drawing, everyone discusses the evidence and votes on the odd one out.

## Current prototype

- Next.js 14 + TypeScript
- Browser drawing canvas
- Three AI-player placeholders with distinct personalities
- Discussion/chat UI
- Responsive layout
- Server-side AI keys planned through environment variables

## Planned AI architecture

The game will use a provider abstraction so OpenAI, Anthropic/Claude, and Google/Gemini can be swapped or used as fallbacks. Provider failures such as rate limits, quota exhaustion, timeouts, and temporary server errors should degrade gracefully rather than breaking the game.

Never put real API keys in client-side code or commit them to Git.
