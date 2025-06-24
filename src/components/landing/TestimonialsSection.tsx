import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AnimatedSection from '../AnimatedSection';

const testimonials = [
    {
        quote: "Vava Classroom has transformed my remote teaching. The real-time code editor is a game-changer!",
        name: "Mr. Bello",
        role: "CS Teacher",
        borderColor: "border-indigo-500",
        textColor: "text-indigo-600"
    },
    {
        quote: "I can finally code along with my instructor without screen sharing lag. It's so much more interactive.",
        name: "Aisha",
        role: "University Student",
        borderColor: "border-green-500",
        textColor: "text-green-600"
    },
    {
        quote: "The platform is intuitive, stable, and has all the features I need to manage my programming course.",
        name: "Dr. Eze",
        role: "Bootcamp Instructor",
        borderColor: "border-purple-500",
        textColor: "text-purple-600"
    },
    {
        quote: "The ability to drop in voice notes and video clips directly into the lesson feed is fantastic for asynchronous learning.",
        name: "Sofia",
        role: "EdTech Coordinator",
        borderColor: "border-sky-500",
        textColor: "text-sky-600"
    }
];

const TestimonialsSection = React.forwardRef((props, ref) => (
  <section id="testimonials" ref={ref} className="w-full bg-white py-20 px-4">
    <AnimatedSection>
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by Educators & Students</h2>
        <p className="text-gray-600 mb-12">Here's what people are saying about Vava Classroom.</p>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className={`bg-slate-50 border-l-4 ${testimonial.borderColor} p-6 text-left shadow-lg h-full flex flex-col`}>
                    <CardContent className="p-0 flex-grow">
                      <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                    </CardContent>
                    <footer className="mt-4">
                      <div className={`font-bold ${testimonial.textColor}`}>{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </footer>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </AnimatedSection>
  </section>
));

export default TestimonialsSection; 