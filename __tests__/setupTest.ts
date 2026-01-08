import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";

expect.extend(matchers);

// Global mocks for URL handling (used in timeline exporting testing)
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();
