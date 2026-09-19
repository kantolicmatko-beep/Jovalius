import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-pGsD67Ot.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function pdfEscape(text) {
	return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
function toWinAnsi(text) {
	return text.replaceAll("č", "c").replaceAll("ć", "c").replaceAll("š", "s").replaceAll("ž", "z").replaceAll("đ", "d").replaceAll("Č", "C").replaceAll("Ć", "C").replaceAll("Š", "S").replaceAll("Ž", "Z").replaceAll("Đ", "D");
}
/** Build a one-page Helvetica PDF (A4) from ASCII-safe lines. */
function makeSamplePdf(title, lines) {
	const heading = pdfEscape(toWinAnsi(title));
	const body = lines.map((line) => pdfEscape(toWinAnsi(line)));
	const contentLines = [
		"BT",
		"/F1 18 Tf",
		"56 780 Td",
		`(${heading}) Tj`,
		"/F1 10 Tf",
		"0 -28 Td"
	];
	body.forEach((line, i) => {
		if (i > 0) contentLines.push("0 -15 Td");
		contentLines.push(`(${line}) Tj`);
	});
	contentLines.push("ET");
	const stream = contentLines.join("\n");
	const objects = [
		"<< /Type /Catalog /Pages 2 0 R >>",
		"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
		"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
		`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
	];
	let out = "%PDF-1.4\n";
	const offsets = [0];
	objects.forEach((obj, i) => {
		offsets.push(out.length);
		out += `${i + 1} 0 obj\n${obj}\nendobj\n`;
	});
	const xrefAt = out.length;
	out += `xref\n0 ${objects.length + 1}\n`;
	out += "0000000000 65535 f \n";
	for (let i = 1; i <= objects.length; i += 1) out += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
	out += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\n`;
	out += `startxref\n${xrefAt}\n%%EOF`;
	return new Blob([out], { type: "application/pdf" });
}
function inferDocKind(filename) {
	const n = filename.toLowerCase();
	if (n.includes("ugovor") || n.includes("contract")) return "ugovor";
	if (n.includes("predracun") || n.includes("predračun") || n.includes("ponuda")) return "predracun";
	if (n.includes("racun") || n.includes("račun") || n.includes("invoice")) return "racun";
	if (n.includes("setlist") || n.includes("repertoar")) return "setlista";
	if (n.includes("rider")) return "rider";
	if (n.includes("tlocrt") || n.includes("layout") || n.includes("mapa")) return "tlocrt";
	return "ostalo";
}
var t = Date.UTC(2026, 7, 1);
var DEMO_GIGS = [
	{
		id: "gig-maja-ivan",
		title: "Maja & Ivan",
		type: "svadba",
		date: "2026-08-15",
		startTime: "18:00",
		endTime: "02:00",
		venue: "Restoran Panorama",
		city: "Zagreb",
		address: "Sljemenska cesta 4",
		contactName: "Ivan Babić",
		contactPhone: "+385 91 200 1100",
		fee: 1800,
		deposit: 500,
		status: "odradeno",
		notes: "Ceremonija na terasi u 18:30. Mladi su tražili tiši prvi sat, pa puni ples od 21:00.",
		setlist: "Klasični prvi ples: Perfect — Ed Sheeran\nDalmatina, starogradske, disco od ponoći.",
		createdAt: t
	},
	{
		id: "gig-petra-tomislav",
		title: "Petra & Tomislav",
		type: "svadba",
		date: "2026-08-29",
		startTime: "17:30",
		endTime: "01:30",
		venue: "Hotel Palace",
		city: "Opatija",
		address: "Maršala Tita 108",
		contactName: "Petra Kovač",
		contactPhone: "+385 98 441 221",
		fee: 2200,
		deposit: 700,
		status: "odradeno",
		notes: "Malo akustično slavlje u salonu, pa velika dvorana. Clavinova je na pozornici.",
		setlist: "Prvi ples: At Last\nJazz standardi, onda zabava.",
		createdAt: t
	},
	{
		id: "gig-spaladium",
		title: "Ljetni korporativ — Adriatica",
		type: "korporativ",
		date: "2026-09-05",
		startTime: "20:00",
		endTime: "00:30",
		venue: "Spaladium Arena lounge",
		city: "Split",
		address: "Zrinsko-Frankopanska 211",
		contactName: "Martina Vuković",
		contactPhone: "+385 21 555 019",
		fee: 1500,
		deposit: 400,
		status: "odradeno",
		notes: "Pozadinska glazba za networking, pa 45 min show set.",
		setlist: "Lounge 20:00–22:00, show 22:15.",
		createdAt: t
	},
	{
		id: "gig-lucija-filip",
		title: "Lucija & Filip",
		type: "svadba",
		date: "2026-09-12",
		startTime: "18:00",
		endTime: "02:00",
		venue: "Vila Elera",
		city: "Zagreb",
		address: "Gornje Prekrižje 12",
		contactName: "Filip Horvat",
		contactPhone: "+385 91 777 0102",
		fee: 2e3,
		deposit: 600,
		status: "odradeno",
		notes: "Kišni plan: dvorana umjesto vrta. Ozvučenje kuće je dovoljno.",
		setlist: "Prvi ples: Thinking Out Loud",
		createdAt: t
	},
	{
		id: "gig-ana-marko",
		title: "Ana & Marko",
		type: "svadba",
		date: "2026-09-19",
		startTime: "18:00",
		endTime: "02:00",
		venue: "Restoran Dvorac",
		city: "Bedekovčina",
		address: "Trakošćanska 1",
		contactName: "Marko Jurić",
		contactPhone: "+385 95 333 4411",
		fee: 2500,
		deposit: 800,
		status: "potvrdeno",
		notes: "Dolazak u 16:30 za soundcheck. Ceremonija u parku dvorca 17:45. Večera u velikoj sali, ples od 21:30. Parking iza kuhinje.",
		setlist: "Ulazak: Canon in D (kvartet + vokal)\nPrvi ples: La vie en rose\nStarogradske, dalmatina, 80s/90s, after od 00:30.",
		createdAt: t
	},
	{
		id: "gig-iva-luka",
		title: "Iva & Luka",
		type: "svadba",
		date: "2026-09-26",
		startTime: "19:00",
		endTime: "03:00",
		venue: "Villa Magnolia",
		city: "Split",
		address: "Šetalište Marina 8",
		contactName: "Iva Radić",
		contactPhone: "+385 91 612 8800",
		fee: 2300,
		deposit: 700,
		status: "potvrdeno",
		notes: "Open-air terasa do 23:00, zatim zimski vrt. Traže klape i moderni pop.",
		setlist: "Prvi ples: Rewrite the Stars\nKlape, then party.",
		createdAt: t
	},
	{
		id: "gig-kovac-krstenje",
		title: "Krštenje obitelj Kovač",
		type: "krstenje",
		date: "2026-10-03",
		startTime: "13:00",
		endTime: "17:00",
		venue: "Restoran Vinodol",
		city: "Zagreb",
		address: "Nikole Tesle 10",
		contactName: "Ana Kovač",
		contactPhone: "+385 1 481 339",
		fee: 800,
		deposit: 200,
		status: "potvrdeno",
		notes: "Akustični trio. Crkva sv. Marka u 11:30 — samo orgulje, mi sviramo na slavlju.",
		setlist: "Lagani jazz, starogradske, dječje pjesme 20 min.",
		createdAt: t
	},
	{
		id: "gig-esplanade",
		title: "20 godina tvrtke Norda",
		type: "korporativ",
		date: "2026-10-10",
		startTime: "19:30",
		endTime: "23:30",
		venue: "Hotel Esplanade",
		city: "Zagreb",
		address: "Mihanovićeva 1",
		contactName: "Ivana Šimić",
		contactPhone: "+385 1 456 1919",
		fee: 1800,
		deposit: 500,
		status: "upit",
		notes: "Još čekamo potvrdu setliste od marketinga. Dress code: black tie.",
		setlist: "Swing i bossa, bez vokala u prvom satu.",
		createdAt: t
	},
	{
		id: "gig-petra-josip",
		title: "Petra & Josip",
		type: "svadba",
		date: "2026-10-17",
		startTime: "18:00",
		endTime: "02:00",
		venue: "Restoran Dubravkin put",
		city: "Zagreb",
		address: "Dubravkin put 2",
		contactName: "Josip Novak",
		contactPhone: "+385 98 200 331",
		fee: 2100,
		deposit: 600,
		status: "potvrdeno",
		notes: "Mali prostor — akustika pažljivo. Max 6 na pozornici.",
		setlist: "Prvi ples: Can't Help Falling in Love",
		createdAt: t
	},
	{
		id: "gig-roden-50",
		title: "50. rođendan — g. Babić",
		type: "privatna",
		date: "2026-10-24",
		startTime: "19:00",
		endTime: "00:00",
		venue: "Konoba Didov san",
		city: "Zagreb",
		address: "Mletačka 11",
		contactName: "Lana Babić",
		contactPhone: "+385 91 555 0198",
		fee: 1200,
		deposit: 300,
		status: "upit",
		notes: "Žele starogradske i narodnjake, bez preglasnog bubnja.",
		setlist: "Tamburaški set + vokal.",
		createdAt: t
	},
	{
		id: "gig-elena-nikola",
		title: "Elena & Nikola",
		type: "svadba",
		date: "2026-11-07",
		startTime: "17:00",
		endTime: "01:00",
		venue: "Hotel Ambasador",
		city: "Opatija",
		address: "F. Supila 19",
		contactName: "Nikola Marić",
		contactPhone: "+385 51 710 444",
		fee: 2600,
		deposit: 900,
		status: "potvrdeno",
		notes: "Dva seta: cocktail na terasi i večera u Crystal hall.",
		setlist: "Prvi ples: Fly Me to the Moon",
		createdAt: t
	},
	{
		id: "gig-zkm",
		title: "Večer dalmatinskih pjesama",
		type: "koncert",
		date: "2026-11-21",
		startTime: "20:00",
		endTime: "22:30",
		venue: "ZKM — dvorana",
		city: "Zagreb",
		address: "Trg žrtava fašizma 10",
		contactName: "Tehnička produkcija ZKM",
		contactPhone: "+385 1 461 0777",
		fee: 900,
		deposit: 0,
		status: "potvrdeno",
		notes: "Kućno ozvučenje. Soundcheck 17:00. Dress: tamno, bez sjaja.",
		setlist: "Klape aranžmani, 90 minuta bez pauze.",
		createdAt: t
	},
	{
		id: "gig-sara-mateo",
		title: "Sara & Mateo",
		type: "svadba",
		date: "2026-12-12",
		startTime: "18:30",
		endTime: "02:00",
		venue: "Dvorac Samobor",
		city: "Samobor",
		address: "Giznik 1",
		contactName: "Sara Vuk",
		contactPhone: "+385 91 404 2288",
		fee: 2400,
		deposit: 800,
		status: "upit",
		notes: "Zimska svadba, kamin u sali. Potvrda do 1. studenoga.",
		setlist: "Prvi ples: All of Me",
		createdAt: t
	},
	{
		id: "gig-newyear",
		title: "Novogodišnji ball",
		type: "korporativ",
		date: "2026-12-31",
		startTime: "21:00",
		endTime: "03:00",
		venue: "Hotel Westin",
		city: "Zagreb",
		address: "Kršnjavoga 1",
		contactName: "Events desk Westin",
		contactPhone: "+385 1 682 2000",
		fee: 3200,
		deposit: 1200,
		status: "potvrdeno",
		notes: "Countdown set 23:50. Midnight: Auld Lang Syne pa disco. Extra naknada za after 03:00.",
		setlist: "Swing, disco, pop hits, midnight anthem.",
		createdAt: t
	}
];
function demoDocumentsFor(gig) {
	if (gig.id === "gig-ana-marko") return [
		{
			id: "doc-ana-ugovor",
			filename: "Ugovor-Ana-Marko.pdf",
			kind: "ugovor",
			title: "Ugovor o nastupu",
			lines: [
				"Kapela  /  knjiga nastupa",
				"",
				"Narucitelj: Ana Petrovic i Marko Juric",
				"Datum: 19. rujna 2026.",
				"Mjesto: Restoran Dvorac, Bedekovcina",
				"Vrijeme: 18:00 - 02:00",
				"Naknada: 2.500 EUR  /  predujam 800 EUR",
				"",
				"Sastav: vokal, klavijature, gitara, bas, bubanj, sax.",
				"Dolazak za soundcheck: 16:30.",
				"",
				"Potpisi: ________________      ________________"
			]
		},
		{
			id: "doc-ana-predracun",
			filename: "Predracun-Ana-Marko.pdf",
			kind: "predracun",
			title: "Predracun br. 2026-0919",
			lines: [
				"Kapela",
				"",
				"Za: svadba Ana i Marko",
				"Nastup 19.09.2026. Restoran Dvorac",
				"",
				"Honorari benda                  2.200 EUR",
				"Prijevoz i smjestaj               300 EUR",
				"Ukupno                          2.500 EUR",
				"Predujam (placen)                 800 EUR",
				"Za platiti do 12.09.            1.700 EUR"
			]
		},
		{
			id: "doc-ana-setlista",
			filename: "Setlista-Ana-Marko.pdf",
			kind: "setlista",
			title: "Setlista — Ana i Marko",
			lines: [
				"Ceremonija",
				"  Canon in D   /   A Thousand Years",
				"",
				"Prvi ples",
				"  La vie en rose",
				"",
				"Vecera (pozadina)",
				"  jazz standardi, bossa, chanson",
				"",
				"Ples 21:30",
				"  Starogradske, Dalmatina, 80s, 90s",
				"After 00:30  —  disco i zahtjevi gostiju"
			]
		}
	];
	if (gig.id === "gig-iva-luka") return [{
		id: "doc-iva-ugovor",
		filename: "Ugovor-Iva-Luka.pdf",
		kind: "ugovor",
		title: "Ugovor o nastupu",
		lines: [
			"Narucitelj: Iva Radic i Luka Peric",
			"Datum: 26. rujna 2026.",
			"Mjesto: Villa Magnolia, Split",
			"Naknada: 2.300 EUR"
		]
	}, {
		id: "doc-iva-rider",
		filename: "Rider-Villa-Magnolia.pdf",
		kind: "rider",
		title: "Tehnicki rider",
		lines: [
			"Pozornica min. 4 x 3 m",
			"Napajanje 2 x 16A, odvojeno od rasvjete",
			"Monitori: 3 puta",
			"Open-air do 23:00, zatim zimski vrt"
		]
	}];
	if (gig.id === "gig-lucija-filip") return [{
		id: "doc-lucija-racun",
		filename: "Racun-Lucija-Filip.pdf",
		kind: "racun",
		title: "Racun br. 2026-0912",
		lines: [
			"Svadba Lucija i Filip",
			"Vila Elera, 12. rujna 2026.",
			"Iznos: 2.000 EUR — placeno u cijelosti."
		]
	}];
	if (gig.id === "gig-newyear") return [{
		id: "doc-ny-ugovor",
		filename: "Ugovor-Westin-NYE.pdf",
		kind: "ugovor",
		title: "Ugovor — Novogodisnji ball",
		lines: [
			"Hotel Westin, Zagreb",
			"31. prosinca 2026.  21:00 - 03:00",
			"Naknada 3.200 EUR, predujam 1.200 EUR",
			"Countdown set obavezan u 23:50."
		]
	}];
	return [];
}
var DB_NAME = "kapela";
var DB_VERSION = 1;
var SEED_KEY = "kapela:seeded";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains("gigs")) db.createObjectStore("gigs", { keyPath: "id" }).createIndex("date", "date");
			if (!db.objectStoreNames.contains("docs")) db.createObjectStore("docs", { keyPath: "id" }).createIndex("gigId", "gigId");
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("IndexedDB nije dostupan"));
	});
}
function idbReq(req) {
	return new Promise((resolve, reject) => {
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function txDone(tx) {
	return new Promise((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.onabort = () => reject(tx.error ?? /* @__PURE__ */ new Error("Transakcija prekinuta"));
	});
}
async function getAll(storeName) {
	const db = await openDb();
	try {
		return await idbReq(db.transaction(storeName, "readonly").objectStore(storeName).getAll());
	} finally {
		db.close();
	}
}
function toMeta(record) {
	const { blob: _blob, ...meta } = record;
	return meta;
}
function sortGigs(a, b) {
	return a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);
}
async function seedIfNeeded() {
	if (typeof localStorage === "undefined") return;
	if (localStorage.getItem(SEED_KEY) === "1") return;
	if ((await getAll("gigs")).length > 0) {
		localStorage.setItem(SEED_KEY, "1");
		return;
	}
	const db = await openDb();
	try {
		const tx = db.transaction(["gigs", "docs"], "readwrite");
		const gigs = tx.objectStore("gigs");
		const docs = tx.objectStore("docs");
		for (const gig of DEMO_GIGS) gigs.put(gig);
		for (const gig of DEMO_GIGS) for (const spec of demoDocumentsFor(gig)) {
			const blob = makeSamplePdf(spec.title, spec.lines);
			const record = {
				id: spec.id,
				gigId: gig.id,
				name: spec.filename,
				kind: spec.kind,
				mimeType: "application/pdf",
				size: blob.size,
				createdAt: gig.createdAt,
				blob
			};
			docs.put(record);
		}
		await txDone(tx);
		localStorage.setItem(SEED_KEY, "1");
	} finally {
		db.close();
	}
}
function demoDocMetas() {
	const out = [];
	for (const gig of DEMO_GIGS) for (const spec of demoDocumentsFor(gig)) out.push({
		id: spec.id,
		gigId: gig.id,
		name: spec.filename,
		kind: spec.kind,
		mimeType: "application/pdf",
		size: 1200,
		createdAt: gig.createdAt
	});
	return out;
}
var useKapela = create((set, get) => ({
	hydrated: true,
	gigs: [...DEMO_GIGS].sort(sortGigs),
	docs: demoDocMetas(),
	hydrate: async () => {
		if (typeof indexedDB === "undefined") return;
		const seeded = typeof localStorage !== "undefined" && localStorage.getItem(SEED_KEY) === "1";
		try {
			if (!seeded) {
				await new Promise((resolve) => setTimeout(resolve, 0));
				await seedIfNeeded();
				set({ docs: (await getAll("docs")).map(toMeta) });
				return;
			}
			const [gigs, records] = await Promise.all([getAll("gigs"), getAll("docs")]);
			set({
				gigs: gigs.sort(sortGigs),
				docs: records.map(toMeta)
			});
		} catch {}
	},
	upsertGig: async (gig) => {
		const db = await openDb();
		try {
			const tx = db.transaction("gigs", "readwrite");
			tx.objectStore("gigs").put(gig);
			await txDone(tx);
		} finally {
			db.close();
		}
		set({ gigs: [...get().gigs.filter((g) => g.id !== gig.id), gig].sort(sortGigs) });
	},
	deleteGig: async (id) => {
		const db = await openDb();
		try {
			const tx = db.transaction(["gigs", "docs"], "readwrite");
			tx.objectStore("gigs").delete(id);
			const related = await idbReq(tx.objectStore("docs").index("gigId").getAllKeys(id));
			for (const key of related) tx.objectStore("docs").delete(key);
			await txDone(tx);
		} finally {
			db.close();
		}
		set({
			gigs: get().gigs.filter((g) => g.id !== id),
			docs: get().docs.filter((d) => d.gigId !== id)
		});
	},
	addDocument: async (gigId, file, kind) => {
		const blob = file.slice(0, file.size, file.type || "application/pdf");
		const record = {
			id: crypto.randomUUID(),
			gigId,
			name: file.name,
			kind,
			mimeType: file.type || "application/pdf",
			size: file.size,
			createdAt: Date.now(),
			blob
		};
		const db = await openDb();
		try {
			const tx = db.transaction("docs", "readwrite");
			tx.objectStore("docs").put(record);
			await txDone(tx);
		} finally {
			db.close();
		}
		set({ docs: [...get().docs, toMeta(record)] });
	},
	deleteDocument: async (id) => {
		const db = await openDb();
		try {
			const tx = db.transaction("docs", "readwrite");
			tx.objectStore("docs").delete(id);
			await txDone(tx);
		} finally {
			db.close();
		}
		set({ docs: get().docs.filter((d) => d.id !== id) });
	},
	getDocumentBlob: async (id) => {
		const db = await openDb();
		try {
			return (await idbReq(db.transaction("docs", "readonly").objectStore("docs").get(id)))?.blob;
		} finally {
			db.close();
		}
	},
	restoreDemo: async () => {
		const db = await openDb();
		try {
			const tx = db.transaction(["gigs", "docs"], "readwrite");
			tx.objectStore("gigs").clear();
			tx.objectStore("docs").clear();
			await txDone(tx);
		} finally {
			db.close();
		}
		localStorage.removeItem(SEED_KEY);
		set({
			gigs: [...DEMO_GIGS].sort(sortGigs),
			docs: demoDocMetas(),
			hydrated: true
		});
		await get().hydrate();
	}
}));
var styles_default = "/assets/styles-C4o4ytEF.css";
var APP_NAME = "KAPELA";
var Route$2 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Knjiga nastupa — kalendar svirki i dokumenti uz svaku svadbu."
			},
			{
				name: "theme-color",
				content: "#0c0b0a"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Figtree:ital,wght@0,400;0,500;0,600;1,400&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const hydrate = useKapela((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "hr",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					theme: "dark",
					position: "bottom-center",
					toastOptions: { className: "bg-card text-card-foreground border-border" }
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$1 = () => import("./routes-DlDUpQBM.mjs");
var Route$1 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./gigs._id-CGxYJ6JB.mjs");
var Route = createFileRoute("/gigs/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	GigsIdRoute: Route.update({
		id: "/gigs/$id",
		path: "/gigs/$id",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { inferDocKind as i, Route as n, useKapela as r, router_exports as t };
