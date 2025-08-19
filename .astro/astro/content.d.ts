declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"ac-blowing-warm-air.mdx": {
	id: "ac-blowing-warm-air.mdx";
  slug: "ac-blowing-warm-air";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"ac-leaking-water-what-to-do.mdx": {
	id: "ac-leaking-water-what-to-do.mdx";
  slug: "ac-leaking-water-what-to-do";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"ac-lifespan-dfw.mdx": {
	id: "ac-lifespan-dfw.mdx";
  slug: "ac-lifespan-dfw";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"ac-maintenance-checklist-spring.mdx": {
	id: "ac-maintenance-checklist-spring.mdx";
  slug: "ac-maintenance-checklist-spring";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"ac-repair-cost-north-texas-2025.mdx": {
	id: "ac-repair-cost-north-texas-2025.mdx";
  slug: "ac-repair-cost-north-texas-2025";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"ac-short-cycling-diagnostics.mdx": {
	id: "ac-short-cycling-diagnostics.mdx";
  slug: "ac-short-cycling-diagnostics";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"ac-smells-from-vents.mdx": {
	id: "ac-smells-from-vents.mdx";
  slug: "ac-smells-from-vents";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"ac-warranty-basics.mdx": {
	id: "ac-warranty-basics.mdx";
  slug: "ac-warranty-basics";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"addison-hvac-knowledge-hub.mdx": {
	id: "addison-hvac-knowledge-hub.mdx";
  slug: "addison-hvac-knowledge-hub";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"allen-hvac-knowledge-hub.mdx": {
	id: "allen-hvac-knowledge-hub.mdx";
  slug: "allen-hvac-knowledge-hub";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"attic-duct-improvements.mdx": {
	id: "attic-duct-improvements.mdx";
  slug: "attic-duct-improvements";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"best-filters-for-cooling.mdx": {
	id: "best-filters-for-cooling.mdx";
  slug: "best-filters-for-cooling";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"best-schedules-texas-summer.mdx": {
	id: "best-schedules-texas-summer.mdx";
  slug: "best-schedules-texas-summer";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"bill-impact-calculator-explainer.mdx": {
	id: "bill-impact-calculator-explainer.mdx";
  slug: "bill-impact-calculator-explainer";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"co-safety-basics.mdx": {
	id: "co-safety-basics.mdx";
  slug: "co-safety-basics";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"cold-weather-heat-pumps-ntx.mdx": {
	id: "cold-weather-heat-pumps-ntx.mdx";
  slug: "cold-weather-heat-pumps-ntx";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"common-ac-parts-failures.mdx": {
	id: "common-ac-parts-failures.mdx";
  slug: "common-ac-parts-failures";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"condenser-cleaning-safe-steps.mdx": {
	id: "condenser-cleaning-safe-steps.mdx";
  slug: "condenser-cleaning-safe-steps";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"dehumidifier-sizing.mdx": {
	id: "dehumidifier-sizing.mdx";
  slug: "dehumidifier-sizing";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"duct-cleaning-vs-sealing.mdx": {
	id: "duct-cleaning-vs-sealing.mdx";
  slug: "duct-cleaning-vs-sealing";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"duct-sizing-basics.mdx": {
	id: "duct-sizing-basics.mdx";
  slug: "duct-sizing-basics";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"ductless-for-garages.mdx": {
	id: "ductless-for-garages.mdx";
  slug: "ductless-for-garages";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"dust-issues-real-causes.mdx": {
	id: "dust-issues-real-causes.mdx";
  slug: "dust-issues-real-causes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"energy-saving-ac-settings-texas.mdx": {
	id: "energy-saving-ac-settings-texas.mdx";
  slug: "energy-saving-ac-settings-texas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"flame-sensor-cleaning.mdx": {
	id: "flame-sensor-cleaning.mdx";
  slug: "flame-sensor-cleaning";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"frisco-hvac-knowledge-hub.mdx": {
	id: "frisco-hvac-knowledge-hub.mdx";
  slug: "frisco-hvac-knowledge-hub";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"frozen-coil-emergency-steps.mdx": {
	id: "frozen-coil-emergency-steps.mdx";
  slug: "frozen-coil-emergency-steps";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"frozen-evaporator-coil-enhanced.mdx": {
	id: "frozen-evaporator-coil-enhanced.mdx";
  slug: "frozen-evaporator-coil-enhanced";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"frozen-evaporator-coil.mdx": {
	id: "frozen-evaporator-coil.mdx";
  slug: "frozen-evaporator-coil";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"furnace-maintenance-fall.mdx": {
	id: "furnace-maintenance-fall.mdx";
  slug: "furnace-maintenance-fall";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"furnace-not-igniting.mdx": {
	id: "furnace-not-igniting.mdx";
  slug: "furnace-not-igniting";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"furnace-repair-cost-2025.mdx": {
	id: "furnace-repair-cost-2025.mdx";
  slug: "furnace-repair-cost-2025";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"furnace-short-cycling.mdx": {
	id: "furnace-short-cycling.mdx";
  slug: "furnace-short-cycling";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"gas-smell-steps.mdx": {
	id: "gas-smell-steps.mdx";
  slug: "gas-smell-steps";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"heat-pump-install-cost-2025.mdx": {
	id: "heat-pump-install-cost-2025.mdx";
  slug: "heat-pump-install-cost-2025";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"heat-pump-noise-expectations.mdx": {
	id: "heat-pump-noise-expectations.mdx";
  slug: "heat-pump-noise-expectations";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"heat-pump-vs-ac-gas-texas.mdx": {
	id: "heat-pump-vs-ac-gas-texas.mdx";
  slug: "heat-pump-vs-ac-gas-texas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"heat-pump-winter-normal.mdx": {
	id: "heat-pump-winter-normal.mdx";
  slug: "heat-pump-winter-normal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"heat-pumps-in-dfw-fit.mdx": {
	id: "heat-pumps-in-dfw-fit.mdx";
  slug: "heat-pumps-in-dfw-fit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"humidity-control-texas-summer.mdx": {
	id: "humidity-control-texas-summer.mdx";
  slug: "humidity-control-texas-summer";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"leaky-ducts-symptoms.mdx": {
	id: "leaky-ducts-symptoms.mdx";
  slug: "leaky-ducts-symptoms";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"little-elm-hvac-knowledge-hub.mdx": {
	id: "little-elm-hvac-knowledge-hub.mdx";
  slug: "little-elm-hvac-knowledge-hub";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"manual-j-plain-english.mdx": {
	id: "manual-j-plain-english.mdx";
  slug: "manual-j-plain-english";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"mckinney-hvac-knowledge-hub.mdx": {
	id: "mckinney-hvac-knowledge-hub.mdx";
  slug: "mckinney-hvac-knowledge-hub";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"merv-ratings-explained.mdx": {
	id: "merv-ratings-explained.mdx";
  slug: "merv-ratings-explained";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"no-cooling-today-checklist.mdx": {
	id: "no-cooling-today-checklist.mdx";
  slug: "no-cooling-today-checklist";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"noisy-ac-sounds-and-causes.mdx": {
	id: "noisy-ac-sounds-and-causes.mdx";
  slug: "noisy-ac-sounds-and-causes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"office-pm-plans.mdx": {
	id: "office-pm-plans.mdx";
  slug: "office-pm-plans";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"outdoor-unit-wont-start.mdx": {
	id: "outdoor-unit-wont-start.mdx";
  slug: "outdoor-unit-wont-start";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"plano-hvac-knowledge-hub.mdx": {
	id: "plano-hvac-knowledge-hub.mdx";
  slug: "plano-hvac-knowledge-hub";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"pre-summer-tune-up.mdx": {
	id: "pre-summer-tune-up.mdx";
  slug: "pre-summer-tune-up";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"prosper-hvac-knowledge-hub.mdx": {
	id: "prosper-hvac-knowledge-hub.mdx";
  slug: "prosper-hvac-knowledge-hub";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"reading-hvac-proposals.mdx": {
	id: "reading-hvac-proposals.mdx";
  slug: "reading-hvac-proposals";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"replace-vs-repair-ac.mdx": {
	id: "replace-vs-repair-ac.mdx";
  slug: "replace-vs-repair-ac";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"restaurant-makeup-air-basics.mdx": {
	id: "restaurant-makeup-air-basics.mdx";
  slug: "restaurant-makeup-air-basics";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"returns-vs-supplies-balance.mdx": {
	id: "returns-vs-supplies-balance.mdx";
  slug: "returns-vs-supplies-balance";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"rtu-maintenance-small-retail.mdx": {
	id: "rtu-maintenance-small-retail.mdx";
  slug: "rtu-maintenance-small-retail";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"seer2-texas-guide.mdx": {
	id: "seer2-texas-guide.mdx";
  slug: "seer2-texas-guide";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"staging-options-comparison.mdx": {
	id: "staging-options-comparison.mdx";
  slug: "staging-options-comparison";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"static-pressure-comfort.mdx": {
	id: "static-pressure-comfort.mdx";
  slug: "static-pressure-comfort";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"the-colony-hvac-knowledge-hub.mdx": {
	id: "the-colony-hvac-knowledge-hub.mdx";
  slug: "the-colony-hvac-knowledge-hub";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"thermostat-compatibility-guide.mdx": {
	id: "thermostat-compatibility-guide.mdx";
  slug: "thermostat-compatibility-guide";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"thermostat-says-cooling-not-cooling.mdx": {
	id: "thermostat-says-cooling-not-cooling.mdx";
  slug: "thermostat-says-cooling-not-cooling";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"thermostat-sensor-placement.mdx": {
	id: "thermostat-sensor-placement.mdx";
  slug: "thermostat-sensor-placement";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"thermostats-for-heat-pumps.mdx": {
	id: "thermostats-for-heat-pumps.mdx";
  slug: "thermostats-for-heat-pumps";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"two-stage-vs-variable.mdx": {
	id: "two-stage-vs-variable.mdx";
  slug: "two-stage-vs-variable";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
};
"pages": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">;
  render(): Render[".md"];
}>;

	};

	type DataEntryMap = {
		"cities": {
"cities": {
	id: "cities";
  collection: "cities";
  data: InferEntrySchema<"cities">
};
};
"services": {
"services": {
	id: "services";
  collection: "services";
  data: InferEntrySchema<"services">
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
