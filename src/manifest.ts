import packageJson from "../package.json";
import type { ManifestType } from "./manifest-type";

const manifest: ManifestType = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  permissions: [
    "activeTab",
    "scripting",
    "contextMenus",
    "notifications",
    "storage"
  ],
  background: { service_worker: "src/background/index.js" },
  action: {
    default_popup: "src/popup/index.html",
    default_icon: "32.png",
  },
  icons: {
    "128": "128.png",
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
      resources: ["128.png", "48.png"],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
