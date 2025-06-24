import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnimatedSection from '../AnimatedSection';

const FaqSection = React.forwardRef((props, ref) => (
  <section id="faq" ref={ref} className="w-full max-w-3xl mx-auto py-16 px-4">
    <AnimatedSection>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is Vava Classroom free?</AccordionTrigger>
          <AccordionContent>
            Yes! The core features for students and teachers are completely free. We plan to introduce premium features for institutions in the future.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What languages does the code editor support?</AccordionTrigger>
          <AccordionContent>
            The editor supports a wide range of languages including JavaScript, Python, Java, C++, and more, with syntax highlighting and autocompletion.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I use this on mobile?</AccordionTrigger>
          <AccordionContent>
            Absolutely. The platform is fully responsive and designed to work seamlessly across desktops, tablets, and mobile devices.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AnimatedSection>
  </section>
));

export default FaqSection; 