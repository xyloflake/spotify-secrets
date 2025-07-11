# spotify-secrets

A Spotify secrets scraper that updates hourly to monitor and extract secrets from Spotify's infrastructure.

Original method by [misiektoja/spotify_monitor](https://github.com/misiektoja/spotify_monitor/blob/dev/debug/spotify_monitor_secret_grabber.py), converted to TypeScript.

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

## Using the JSON Data

The scraper generates two JSON files that are updated hourly:

### Raw JSON URLs

- `https://github.com/Thereallo1026/spotify-secrets/blob/main/secrets/secrets.json?raw=true`
- `https://github.com/Thereallo1026/spotify-secrets/blob/main/secrets/secretBytes.json?raw=true`

### TypeScript Interface

Both files use the same unified format:

```typescript
interface SpotifySecrets {
	secret: string | number[];
	version: number;
}[];
```

### Usage Example

```typescript
// Fetch secrets
const response = await fetch('https://github.com/Thereallo1026/spotify-secrets/blob/main/secrets/secrets.json?raw=true');
const secrets: SpotifySecrets = await response.json();

// Get latest version
const latestSecret = secrets[secrets.length - 1];
console.log(`Version ${latestSecret.version}: ${latestSecret.secret}`);
```

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
