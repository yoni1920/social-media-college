export const enhanceOptions = ["PARAPHRASE", "ELABORATE", "CONCISE"] as const;

export type EnhanceOption = (typeof enhanceOptions)[number];
