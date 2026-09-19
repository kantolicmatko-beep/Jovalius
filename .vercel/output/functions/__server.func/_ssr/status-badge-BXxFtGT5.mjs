import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Slot, N as require_jsx_runtime, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, l as Dialog$1, m as DialogPortal$1, p as DialogOverlay$1, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as Check, g as ChevronDown, o as Plus, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useKapela } from "./router-pGsD67Ot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { a as format, r as parseISO, t as hr, u as isValid } from "../_libs/date-fns.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-BXxFtGT5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-foreground hover:bg-accent",
			outline: "bg-transparent text-foreground shadow-[var(--shadow-border)] hover:bg-accent",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
			link: "text-foreground underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 rounded-md px-4",
			sm: "h-9 rounded-sm px-3 text-[13px]",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11 rounded-md",
			"icon-sm": "size-9 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function AppHeader({ onNewGig, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			className: "group flex min-w-0 items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex size-11 items-center justify-center rounded-lg bg-card shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl leading-none tracking-tight",
				children: "KAPELA"
			}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs font-medium tracking-widest text-muted-foreground uppercase",
				children: "Knjiga nastupa"
			})] })]
		}), onNewGig && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: onNewGig,
			className: "shrink-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "Nova svirka"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sm:hidden",
					children: "Nova"
				})
			]
		})]
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5 text-primary",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "4",
				y: "7",
				width: "2.2",
				height: "10",
				rx: "1",
				fill: "currentColor",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "10",
				y: "4",
				width: "2.2",
				height: "16",
				rx: "1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "16",
				y: "9",
				width: "2.2",
				height: "8",
				rx: "1",
				fill: "currentColor",
				opacity: "0.75"
			})
		]
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-[var(--shadow-lift)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
		className: cn("p-1", position === "popper" && "w-full min-w-[var(--radix-select-trigger-width)]"),
		children
	})
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-pointer items-center rounded-sm py-2 pr-8 pl-2 text-sm outline-none select-none focus:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex size-4 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-accent text-accent-foreground",
		outline: "shadow-[var(--shadow-border)] text-muted-foreground",
		success: "bg-success/15 text-success",
		warning: "bg-warning/15 text-warning",
		destructive: "bg-destructive/15 text-destructive",
		muted: "bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-[var(--shadow-lift)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.96] data-[state=open]:zoom-in-[0.96] max-h-[90dvh] overflow-y-auto", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-3 right-3 rounded-sm p-2 text-muted-foreground opacity-80 hover:bg-accent hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Zatvori"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-8", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("font-display text-2xl leading-tight font-medium", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var GIG_TYPES = [
	"svadba",
	"krstenje",
	"korporativ",
	"koncert",
	"privatna",
	"ostalo"
];
var GIG_STATUSES = [
	"upit",
	"potvrdeno",
	"odradeno",
	"otkazano"
];
var DOC_KINDS = [
	"ugovor",
	"predracun",
	"racun",
	"setlista",
	"rider",
	"tlocrt",
	"ostalo"
];
var GIG_TYPE_LABEL = {
	svadba: "Svadba",
	krstenje: "Krštenje",
	korporativ: "Korporativ",
	koncert: "Koncert",
	privatna: "Privatna proslava",
	ostalo: "Ostalo"
};
var GIG_STATUS_LABEL = {
	upit: "Upit",
	potvrdeno: "Potvrđeno",
	odradeno: "Odrađeno",
	otkazano: "Otkazano"
};
var DOC_KIND_LABEL = {
	ugovor: "Ugovor",
	predracun: "Predračun",
	racun: "Račun",
	setlista: "Setlista",
	rider: "Tehnički rider",
	tlocrt: "Tlocrt sale",
	ostalo: "Ostalo"
};
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-none transition-[box-shadow,border-color] duration-150 placeholder:text-muted-foreground/70 focus-visible:border-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-[13px] font-medium text-muted-foreground", className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function parseGigDate(iso) {
	const d = parseISO(iso);
	return isValid(d) ? d : /* @__PURE__ */ new Date();
}
function formatLongDate(iso) {
	return format(parseGigDate(iso), "EEEE, d. MMMM yyyy.", { locale: hr });
}
function formatMonthTitle(date) {
	return format(date, "LLLL yyyy", { locale: hr });
}
function formatTimeRange(gig) {
	if (!gig.startTime && !gig.endTime) return "Vrijeme nije upisano";
	if (gig.startTime && gig.endTime) return `${gig.startTime}–${gig.endTime}`;
	return gig.startTime || gig.endTime;
}
function formatEur(amount) {
	if (amount == null) return "—";
	return new Intl.NumberFormat("hr-HR", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0
	}).format(amount);
}
function todayIso() {
	const n = /* @__PURE__ */ new Date();
	return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}
var empty = (date) => ({
	title: "",
	type: "svadba",
	date,
	startTime: "18:00",
	endTime: "02:00",
	venue: "",
	city: "",
	address: "",
	contactName: "",
	contactPhone: "",
	fee: null,
	deposit: null,
	status: "upit",
	notes: "",
	setlist: ""
});
function GigFormDialog({ open, onOpenChange, gig, defaultDate }) {
	const upsertGig = useKapela((s) => s.upsertGig);
	const [form, setForm] = (0, import_react.useState)(empty(defaultDate || todayIso()));
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (gig) {
			const { id: _id, createdAt: _c, ...rest } = gig;
			setForm(rest);
		} else setForm(empty(defaultDate || todayIso()));
	}, [
		open,
		gig,
		defaultDate
	]);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (form.title.trim().length < 2) {
			toast.error("Upiši ime para ili naziv nastupa.");
			return;
		}
		if (!form.date) {
			toast.error("Odaberi datum.");
			return;
		}
		const next = {
			...gig ?? {
				id: crypto.randomUUID(),
				createdAt: Date.now()
			},
			...form,
			title: form.title.trim(),
			venue: form.venue.trim(),
			city: form.city.trim()
		};
		await upsertGig(next);
		toast.success(gig ? "Svirka je spremljena." : "Svirka je dodana u kalendar.");
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: gig ? "Uredi svirku" : "Nova svirka" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Datum, mjesto i detalji nastupa. Dokumente dodaješ unutar svirke." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Par / naziv",
							htmlFor: "title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "title",
								value: form.title,
								onChange: (e) => set("title", e.target.value),
								placeholder: "Ana & Marko",
								autoFocus: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Vrsta",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.type,
								onValueChange: (v) => set("type", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									"aria-label": "Vrsta nastupa",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: GIG_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: t,
									children: GIG_TYPE_LABEL[t]
								}, t)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Datum",
							htmlFor: "date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "date",
								type: "date",
								value: form.date,
								onChange: (e) => set("date", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Status",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.status,
								onValueChange: (v) => set("status", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									"aria-label": "Status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: GIG_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: GIG_STATUS_LABEL[s]
								}, s)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Početak",
							htmlFor: "start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "start",
								type: "time",
								value: form.startTime,
								onChange: (e) => set("startTime", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Kraj",
							htmlFor: "end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "end",
								type: "time",
								value: form.endTime,
								onChange: (e) => set("endTime", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mjesto",
							htmlFor: "venue",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "venue",
								value: form.venue,
								onChange: (e) => set("venue", e.target.value),
								placeholder: "Restoran Dvorac"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Grad",
							htmlFor: "city",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "city",
								value: form.city,
								onChange: (e) => set("city", e.target.value),
								placeholder: "Zagreb"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Adresa",
							htmlFor: "address",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "address",
								value: form.address,
								onChange: (e) => set("address", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Kontakt",
							htmlFor: "contact",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "contact",
								value: form.contactName,
								onChange: (e) => set("contactName", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Telefon",
							htmlFor: "phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "phone",
								value: form.contactPhone,
								onChange: (e) => set("contactPhone", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Naknada (€)",
							htmlFor: "fee",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "fee",
								type: "number",
								min: 0,
								inputMode: "numeric",
								value: form.fee ?? "",
								onChange: (e) => set("fee", e.target.value === "" ? null : Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Predujam (€)",
							htmlFor: "deposit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "deposit",
								type: "number",
								min: 0,
								inputMode: "numeric",
								value: form.deposit ?? "",
								onChange: (e) => set("deposit", e.target.value === "" ? null : Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Bilješke",
							htmlFor: "notes",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "notes",
								value: form.notes,
								onChange: (e) => set("notes", e.target.value),
								rows: 3,
								placeholder: "Soundcheck, parking, posebni zahtjevi…"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Setlista",
							htmlFor: "setlist",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "setlist",
								value: form.setlist,
								onChange: (e) => set("setlist", e.target.value),
								rows: 4,
								placeholder: "Prvi ples, ceremonija, after…"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Odustani"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: gig ? "Spremi" : "Dodaj svirku"
				})] })]
			})]
		})
	});
}
function Field({ label, htmlFor, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `grid gap-1.5 ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor,
			children: label
		}), children]
	});
}
function statusBadgeVariant(status) {
	switch (status) {
		case "potvrdeno": return "success";
		case "upit": return "warning";
		case "otkazano": return "destructive";
		default: return "muted";
	}
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: statusBadgeVariant(status),
		children: GIG_STATUS_LABEL[status]
	});
}
//#endregion
export { formatLongDate as C, todayIso as E, formatEur as S, formatTimeRange as T, SelectValue as _, DOC_KIND_LABEL as a, cn as b, DialogDescription as c, GIG_TYPE_LABEL as d, GigFormDialog as f, SelectTrigger as g, SelectItem as h, DOC_KINDS as i, DialogHeader as l, SelectContent as m, Badge as n, Dialog as o, Select as p, Button as r, DialogContent as s, AppHeader as t, DialogTitle as u, StatusBadge as v, formatMonthTitle as w, formatBytes as x, buttonVariants as y };
