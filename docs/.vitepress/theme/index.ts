import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import VPInput from "./components/VPInput.vue";
import "../style/main.css";
import "../style/vars.css";

const config: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("VPInput", VPInput);
  },
};

export default config;
