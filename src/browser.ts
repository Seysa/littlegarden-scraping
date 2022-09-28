import { Browser } from "puppeteer-core";
import { website } from "./link";

export function blockNotifications(browser: Browser) {
  const context = browser.defaultBrowserContext();
  context.overridePermissions(website, ["notifications"]);
}
