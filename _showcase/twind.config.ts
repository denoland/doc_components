import { Options } from "$fresh/plugins/twind.ts";
import { plugins, theme } from "../services.ts";

export default {
  selfURL: import.meta.url,
  plugins,
  theme,
  darkMode: "class",
} as Options;
