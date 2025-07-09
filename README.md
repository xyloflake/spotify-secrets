# spotify-secrets

A Spotify secrets scraper that updates hourly to monitor and extract secrets from Spotify's infrastructure.

Original method by [misiektoja/spotify_monitor](https://github.com/misiektoja/spotify_monitor/blob/dev/debug/spotify_monitor_secret_grabber.py), converted to TypeScript.

## Quick Access (jsDelivr)

Get the latest Spotify secrets directly via CDN:

### JSON Endpoints
- **Raw Secrets**: [`https://cdn.jsdelivr.net/gh/Thereallo1026/spotify-secrets@main/secrets/secrets.json`](https://cdn.jsdelivr.net/gh/Thereallo1026/spotify-secrets@main/secrets/secrets.json)
- **Secret Bytes**: [`https://cdn.jsdelivr.net/gh/Thereallo1026/spotify-secrets@main/secrets/secretBytes.json`](https://cdn.jsdelivr.net/gh/Thereallo1026/spotify-secrets@main/secrets/secretBytes.json)

### Usage Examples
```javascript
// Fetch formatted secrets
const secrets = await fetch('https://cdn.jsdelivr.net/gh/Thereallo1026/spotify-secrets@main/secrets/secrets.json').then(r => r.json());

// Fetch raw secret bytes
const secretBytes = await fetch('https://cdn.jsdelivr.net/gh/Thereallo1026/spotify-secrets@main/secrets/secretBytes.json').then(r => r.json());
```

## Installation

To install dependencies:

```bash
bun install
```

## Usage

To run:

```bash
bun start
```

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.