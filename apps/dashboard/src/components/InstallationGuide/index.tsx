"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Accordion } from "@animate-ui/react/primitives/radix-ui/accordion";

export function InstallationBanner({ domain }: { domain: string }) {
  return (
      <div className="installation-banner">
        <div>
          <h1>Connect your website.</h1>
          <p>Add Lumen Radar to <strong>{domain}</strong> with a single script. Start with installation, then publish your website.</p>
        </div>
        <Image src="/brand/symbol-white.svg" alt="" width={72} height={84} />
      </div>
  );
}

export default function InstallationGuide() {
  return (
      <section className="installation-guide" aria-labelledby="installation-guide-title">
        <h2 id="installation-guide-title">A quick setup, in your own stack.</h2>
        <p>Use your project’s script with a website builder, a shared HTML template, or your app’s main layout.</p>
        <Accordion.Root type="single" collapsible className="installation-faq">
          <Accordion.Item value="placement" className="installation-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="installation-faq-trigger">
                Where should I put the script?
                <ChevronDown size={16} aria-hidden="true" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="installation-faq-content">
              <p>Place it before the closing <code>&lt;/head&gt;</code> tag in your shared layout so it loads on every page. Add it once per page and keep the <code>defer</code> attribute.</p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="single-page" className="installation-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="installation-faq-trigger">
                Does it work with single-page websites?
                <ChevronDown size={16} aria-hidden="true" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="installation-faq-content">
              <p>Yes. The script records the first page view and follows path changes made with the browser’s History API. You don’t need to add a new script for every route.</p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="publishing" className="installation-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="installation-faq-trigger">
                What should I check after publishing?
                <ChevronDown size={16} aria-hidden="true" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="installation-faq-content">
              <p>Open a page on your configured website and check that your browser can load <code>tracker.js</code>. If your website uses a Content Security Policy, allow the API origin in both <code>script-src</code> and <code>connect-src</code>.</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </section>
  );
}
