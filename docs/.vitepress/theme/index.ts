import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "../style/main.css";
import "../style/vars.css";

export default {
  extends: DefaultTheme,
} satisfies Theme;
