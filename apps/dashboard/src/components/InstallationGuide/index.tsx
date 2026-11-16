"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@animate-ui/react/primitives/buttons/button";
import { Accordion } from "@animate-ui/react/primitives/radix-ui/accordion";

export function InstallationBanner({
  domain,
  websiteUrl,
}: {
  domain: string;
  websiteUrl?: string;
}) {
  return (
    <div className="installation-banner">
      <div>
        <h1>Website analytics</h1>
        <p>
          Track activity, manage installation, and review page views for{" "}
          <strong>{domain}</strong>.
        </p>
      </div>
      {websiteUrl && (
        <Button asChild className="banner-website-link">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open website (opens in a new tab)"
          >
            Open website
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </Button>
      )}
    </div>
  );
}

export default function InstallationGuide() {
  return (
    <section
      className="installation-guide"
      aria-labelledby="installation-guide-title"
    >
      <h2 id="installation-guide-title" tabIndex={-1}>
        Installation guide
      </h2>
      <p>Everything you need to start recording visits.</p>
      <Accordion.Root type="single" collapsible className="installation-faq">
        <Accordion.Item value="placement" className="installation-faq-item">
          <Accordion.Header>
            <Accordion.Trigger className="installation-faq-trigger">
              Where do I install the script?
              <ChevronDown size={16} aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="installation-faq-content">
            <p>
              After analytics setup succeeds, copy the script above into your
              website’s head element. Publish your changes so the script loads
              on the pages you want to measure.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="single-page" className="installation-faq-item">
          <Accordion.Header>
            <Accordion.Trigger className="installation-faq-trigger">
              Is my project collecting data?
              <ChevronDown size={16} aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="installation-faq-content">
            <p>
              A website ID means the script is ready to install. A positive
              pageview count confirms recorded traffic for the selected period.
              A zero count may mean no visits, an uninstalled script, or
              tracking blocked in the browser.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="publishing" className="installation-faq-item">
          <Accordion.Header>
            <Accordion.Trigger className="installation-faq-trigger">
              How do I check my installation?
              <ChevronDown size={16} aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="installation-faq-content">
            <p>
              Visit your published website after installing the script, then
              return here and select Refresh page views. Choose All time to
              check all recorded visits. If the count stays at zero, check that
              the script loads and that your browser allows tracking requests.
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </section>
  );
}
