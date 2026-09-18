import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({ ...base, testIgnore: undefined, testMatch: '**/ux-audit.spec.ts' });
