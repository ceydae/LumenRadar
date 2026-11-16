"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Accordion } from "@animate-ui/react/primitives/radix-ui/accordion";

export function InstallationBanner({ domain }: { domain: string }) {
  return (
      <div className="installation-banner">
        <div>
          <h1>Your website workspace.</h1>
          <p>Your project for <strong>{domain}</strong> is ready. Website tracking and installation are coming soon.</p>
        </div>
        <Image src="/brand/symbol-white.svg" alt="" width={72} height={84} />
      </div>
  );
}

export default function InstallationGuide() {
  return (
      <section className="installation-guide" aria-labelledby="installation-guide-title">
        <h2 id="installation-guide-title">What happens next?</h2>
        <p>Keep your project ready while website tracking is being prepared.</p>
        <Accordion.Root type="single" collapsible className="installation-faq">
          <Accordion.Item value="placement" className="installation-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="installation-faq-trigger">
                Can I install tracking now?
                <ChevronDown size={16} aria-hidden="true" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="installation-faq-content">
              <p>Not yet. There is no tracking script to install in this release. Return to this page for installation instructions when tracking becomes available.</p>
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
              <p>No. Creating a project saves its details. Website visits are not being collected, and analytics reports are not available yet.</p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="publishing" className="installation-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="installation-faq-trigger">
                Do I need to change my website?
                <ChevronDown size={16} aria-hidden="true" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="installation-faq-content">
              <p>No changes are needed at this stage. You can leave your website as it is until the tracking script and installation instructions are available.</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </section>
  );
}
