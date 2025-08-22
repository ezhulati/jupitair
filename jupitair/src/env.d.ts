/// <reference path="../.astro/types.d.ts" />

declare global {
  function gtag(command: string, eventName: string, parameters?: Record<string, any>): void;
}