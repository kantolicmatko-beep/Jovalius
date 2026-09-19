import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as MapPin, h as ChevronLeft, l as FileText, m as ChevronRight } from "../_libs/lucide-react.mjs";
import { r as useKapela } from "./router-pGsD67Ot.mjs";
import { a as format, c as eachDayOfInterval, d as isSameDay, f as startOfWeek, i as isSameMonth, l as endOfMonth, n as subMonths, o as endOfWeek, p as addMonths, r as parseISO, s as startOfMonth, t as hr } from "../_libs/date-fns.mjs";
import { E as todayIso, T as formatTimeRange, b as cn, d as GIG_TYPE_LABEL, f as GigFormDialog, r as Button, t as AppHeader, v as StatusBadge, w as formatMonthTitle } from "./status-badge-BXxFtGT5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DlDUpQBM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WEEKDAYS = [
	"Pon",
	"Uto",
	"Sri",
	"Čet",
	"Pet",
	"Sub",
	"Ned"
];
function MonthCalendar({ month, onMonthChange, selected, onSelect, gigs }) {
	const monthStart = startOfMonth(month);
	const gridStart = startOfWeek(monthStart, {
		weekStartsOn: 1,
		locale: hr
	});
	const gridEnd = endOfWeek(endOfMonth(month), {
		weekStartsOn: 1,
		locale: hr
	});
	const days = eachDayOfInterval({
		start: gridStart,
		end: gridEnd
	});
	const today = /* @__PURE__ */ new Date();
	const gigsByDay = /* @__PURE__ */ new Map();
	for (const gig of gigs) {
		const list = gigsByDay.get(gig.date) ?? [];
		list.push(gig);
		gigsByDay.set(gig.date, list);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl capitalize sm:text-3xl",
				children: formatMonthTitle(month)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Prethodni mjesec",
						onClick: () => onMonthChange(subMonths(month, 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => {
							onMonthChange(today);
							onSelect(today);
						},
						children: "Danas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Sljedeći mjesec",
						onClick: () => onMonthChange(addMonths(month, 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-7",
			children: [WEEKDAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pb-3 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase",
				children: d
			}, d)), days.map((day) => {
				const key = format(day, "yyyy-MM-dd");
				const dayGigs = gigsByDay.get(key) ?? [];
				const inMonth = isSameMonth(day, month);
				const isToday = isSameDay(day, today);
				const isSelected = selected ? isSameDay(day, selected) : false;
				const countable = dayGigs.filter((g) => g.status !== "otkazano");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSelect(isSelected ? null : day),
					className: cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-md transition-colors duration-150", !inMonth && "text-muted-foreground/35", inMonth && "text-foreground", isSelected && "bg-primary text-primary-foreground", !isSelected && isToday && "ring-1 ring-primary/50 ring-inset", !isSelected && inMonth && "hover:bg-accent"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm leading-none tabular-nums",
						children: format(day, "d")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-1.5 items-center justify-center gap-0.5",
						children: countable.length > 0 ? countable.slice(0, 3).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1 rounded-full", isSelected ? "bg-primary-foreground" : "bg-primary/80", g.status === "upit" && !isSelected && "bg-warning", g.status === "odradeno" && !isSelected && "bg-muted-foreground") }, g.id)) : null
					})]
				}, key);
			})]
		})]
	});
}
function GigRow({ gig, docs, compact }) {
	const day = parseISO(gig.date);
	const count = docs.filter((d) => d.gigId === gig.id).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/gigs/$id",
		params: { id: gig.id },
		className: cn("group flex gap-4 rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-accent", compact && "px-2 py-2.5"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-12 shrink-0 flex-col items-center pt-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-2xl leading-none tabular-nums",
				children: format(day, "d")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 text-[10px] font-medium tracking-wider text-muted-foreground uppercase",
				children: format(day, "LLL", { locale: hr })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-tight",
						children: gig.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: gig.status })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 truncate text-sm text-muted-foreground",
					children: [
						GIG_TYPE_LABEL[gig.type],
						gig.venue ? ` · ${gig.venue}` : "",
						gig.city ? `, ${gig.city}` : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTimeRange(gig) }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3" }),
							count,
							" ",
							count === 1 ? "dokument" : "dokumenta"
						]
					})]
				})
			]
		})]
	});
}
function GigList({ gigs, docs, empty }) {
	if (gigs.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-3 py-8 text-center text-sm text-muted-foreground",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: gigs.map((gig) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GigRow, {
			gig,
			docs
		}) }, gig.id))
	});
}
function NextGigHero({ gig, docs }) {
	const count = docs.filter((d) => d.gigId === gig.id).length;
	const day = parseISO(gig.date);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/gigs/$id",
		params: { id: gig.id },
		className: "block rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase",
				children: "Sljedeća svirka"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-3 text-3xl leading-none",
				children: gig.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground capitalize",
				children: [
					format(day, "EEEE, d. MMMM", { locale: hr }),
					" · ",
					formatTimeRange(gig)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-center gap-2 text-sm text-foreground/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [gig.venue, gig.city ? ` · ${gig.city}` : ""] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: gig.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [GIG_TYPE_LABEL[gig.type], count > 0 ? ` · ${count} PDF` : ""]
				})]
			})
		]
	});
}
function Home() {
	const hydrated = useKapela((s) => s.hydrated);
	const gigs = useKapela((s) => s.gigs);
	const docs = useKapela((s) => s.docs);
	const [month, setMonth] = (0, import_react.useState)(() => startOfMonth(/* @__PURE__ */ new Date()));
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const today = todayIso();
	const upcoming = (0, import_react.useMemo)(() => gigs.filter((g) => g.date >= today && g.status !== "otkazano").sort(byDate), [gigs, today]);
	const next = upcoming[0] ?? null;
	const monthGigs = (0, import_react.useMemo)(() => gigs.filter((g) => isSameMonth(parseISO(g.date), month)), [gigs, month]);
	const selectedKey = selected ? format(selected, "yyyy-MM-dd") : null;
	const selectedGigs = selectedKey ? gigs.filter((g) => g.date === selectedKey).sort(byDate) : null;
	const inquiries = gigs.filter((g) => g.status === "upit" && g.date >= today).length;
	const confirmedMonth = monthGigs.filter((g) => g.status === "potvrdeno").length;
	const listTitle = selectedKey ? selectedGigs && selectedGigs.length > 0 ? "Svirke toga dana" : "Nema svirke" : "Nadolazeće";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { onNewGig: () => setFormOpen(true) }),
			!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Ovaj mjesec",
						value: String(monthGigs.length),
						hint: "svirki u kalendaru"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Potvrđeno",
						value: String(confirmedMonth),
						hint: "u prikazanom mjesecu"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Otvoreni upiti",
						value: String(inquiries),
						hint: "čekaju potvrdu"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthCalendar, {
					month,
					onMonthChange: setMonth,
					selected,
					onSelect: setSelected,
					gigs
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [next && !selectedKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextGigHero, {
						gig: next,
						docs
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card py-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl",
									children: listTitle
								}), selectedKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setSelected(null),
									children: "Sve nadolazeće"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GigList, {
									gigs: selectedGigs ?? upcoming.slice(0, 8),
									docs,
									empty: selectedKey ? "Ovaj dan je slobodan. Dodaj svirku na odabrani datum." : "Nema nadolazećih svirki. Dodaj prvu u kalendar."
								})
							}),
							selectedKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 pt-1 pb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									className: "w-full",
									onClick: () => setFormOpen(true),
									children: ["Dodaj svirku ", format(selected, "d.M.")]
								})
							})
						]
					})]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GigFormDialog, {
				open: formOpen,
				onOpenChange: setFormOpen,
				defaultDate: selectedKey ?? today
			})
		]
	});
}
function byDate(a, b) {
	return a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-5 py-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-2 text-3xl leading-none tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function HomeSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 grid gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-96 animate-pulse rounded-xl bg-card" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-80 animate-pulse rounded-xl bg-card" })]
	});
}
//#endregion
export { Home as component };
