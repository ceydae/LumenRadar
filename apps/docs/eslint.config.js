/**
 * ESLint flat config for LumenRadar Docs
 */
import nextvitals from "eslint-config-next/core-web-vitals";

const config = Array.isArray(nextvitals) ? nextvitals : [nextvitals];

export default config;
