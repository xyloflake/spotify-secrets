import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { secretBytesToB32 } from "./utils";

puppeteer.use(StealthPlugin());

const BUNDLE_RE =
	/(?:vendor~web-player|encore~web-player|web-player)\.[0-9a-f]{4,}\.(?:js|mjs)/;
const TIMEOUT = 45000; // 45s

interface Secret {
	version: number;
	secret: string;
}

interface SecretBytes {
	version: number;
	secret: number[];
}

interface SecretBase32 {
	version: number;
	secret: string;
}

type SecretDict = Record<string, number[]>;

function summarise(caps: any[]): void {
	const real: Record<string, string> = {};

	for (const cap of caps) {
		const sec = cap.secret;
		if (typeof sec !== "string") {
			continue;
		}

		const ver =
			cap.version ||
			(typeof cap.obj === "object" && cap.obj !== null && cap.obj.version);

		if (ver == null) {
			continue;
		}

		real[String(ver)] = sec;
	}

	if (Object.keys(real).length === 0) {
		console.log("No real secrets with version.");
		return;
	}

	const sortedEntries = Object.entries(real).sort(
		(a, b) => parseInt(a[0]) - parseInt(b[0]),
	);

	const formattedData: Secret[] = sortedEntries.map(([version, secret]) => ({
		version: parseInt(version),
		secret,
	}));

	const secretBytes: SecretBytes[] = formattedData.map(
		({ version, secret }) => ({
			version,
			secret: Array.from(secret).map((c) => c.charCodeAt(0)),
		}),
	);

	const secretDict: SecretDict = Object.fromEntries(
		formattedData.map(({ version, secret }) => [
			String(version),
			Array.from(secret).map((c) => c.charCodeAt(0)),
		]),
	);

	const secretBase32: SecretBase32 = {
		secret: secretBytesToB32(secretBytes[secretBytes.length - 1]?.secret),
		version: secretBytes[secretBytes.length - 1]?.version,
	};

	Bun.write("secrets/secrets.json", JSON.stringify(formattedData, null, 2));
	Bun.write(
		"secrets/secretsBase32.json",
		JSON.stringify(secretBase32, null, 2),
	);
	Bun.write("secrets/secretBytes.json", JSON.stringify(secretBytes));
	Bun.write("secrets/secretDict.json", JSON.stringify(secretDict));

	console.log(formattedData);
	console.log(secretBytes);
	console.log(secretDict);
}

async function grabLive(): Promise<any[]> {
	const hook = `(()=>{if(globalThis.__secretHookInstalled)return;globalThis.__secretHookInstalled=true;globalThis.__captures=[];
Object.defineProperty(Object.prototype,'secret',{configurable:true,set:function(v){try{__captures.push({secret:v,version:this.version,obj:this});}catch(e){}
Object.defineProperty(this,'secret',{value:v,writable:true,configurable:true,enumerable:true});}});})();`;

	const browser = await puppeteer.launch({
		headless: true,
		executablePath: process.env.CHROMIUM_PATH || undefined,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		const page = await browser.newPage();

		await page.evaluateOnNewDocument(hook);

		page.on("response", (response) => {
			const url = response.url();
			const filename = url.split("/").pop() || "";
			if (BUNDLE_RE.test(filename)) {
				console.log(`${filename}: ${response.status()}`);
			}
		});

		console.log("Opening Spotify...");
		await page.goto("https://open.spotify.com", {
			waitUntil: "networkidle2",
			timeout: TIMEOUT,
		});

		await page.waitForTimeout(3000);

		const caps = (await page.evaluate(() => {
			return (globalThis as any).__captures || [];
		})) as any[];

		if (caps.length > 0) {
			for (const c of caps) {
				if (typeof c.secret === "string" && c.version != null) {
					console.log(`Secret(${c.version}): ${c.secret}`);
				}
			}
		}

		return caps;
	} finally {
		await browser.close();
	}
}

async function main(): Promise<void> {
	try {
		const caps = await grabLive();
		summarise(caps);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

main();
