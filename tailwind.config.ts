import { type Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: ["./src/**/*.tsx"],
  theme: {},
  daisyui: {
    themes: ["emerald", "dark"],
  },
  plugins: [daisyui],
} satisfies Config;
