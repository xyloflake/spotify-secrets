function base32FromBytes(bytes: Uint8Array, secretSauce: string): string {
	let t = 0;
	let n = 0;
	let r = "";

	for (let i = 0; i < bytes.length; i++) {
		n = (n << 8) | bytes[i];
		t += 8;
		while (t >= 5) {
			r += secretSauce[(n >>> (t - 5)) & 31];
			t -= 5;
		}
	}

	if (t > 0) {
		r += secretSauce[(n << (5 - t)) & 31];
	}

	return r;
}

function cleanBuffer(e: string): Uint8Array {
	e = e.replace(" ", "");
	const buffer = new Uint8Array(e.length / 2);
	for (let i = 0; i < e.length; i += 2) {
		buffer[i / 2] = parseInt(e.substring(i, i + 2), 16);
	}
	return buffer;
}

export function secretBytesToB32(secret: number[]): string {
	const secretSauce = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	const secretCipherBytes = secret.map((e, t) => e ^ ((t % 33) + 9));

	const secretBytes = cleanBuffer(
		new TextEncoder()
			.encode(secretCipherBytes.join(""))
			.reduce((acc, val) => acc + val.toString(16).padStart(2, "0"), ""),
	);

	return base32FromBytes(secretBytes, secretSauce);
}
