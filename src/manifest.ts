import packageJson from "../package.json";
import type { ManifestType } from "./manifest-type";

const manifest: ManifestType = {
  manifest_version: 3,
  name: "Udemy Translate",
  version: packageJson.version,
  description: packageJson.description,
  permissions: [
    "storage"
  ],
  background: { service_worker: "src/background/index.js" },
  action: {
    default_popup: "src/popup/index.html",
    default_icon: "32.png",
  },
  icons: {
    "16": "16.png",
    "32": "32.png",
    "192": "192.png"
  },
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'"
  },
  content_scripts: [
    {
      all_frames: true,
      matches: ["https://www.udemy.com/*"],
      js: ["src/content/index.js"],
      run_at: "document_idle"
    },
  ],
  web_accessible_resources: [
    {
      resources: ["192.png", "32.png"],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
