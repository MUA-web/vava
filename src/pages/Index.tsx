import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { GraduationCap, Users, Code, Clock, Monitor, FileText, ArrowRight, BookOpen, Video, TerminalSquare, Rocket, UserPlus, Presentation, LogIn, PenTool, Twitter, Github, Linkedin, MessageSquare, VideoIcon, Code2Icon } from 'lucide-react';
import StudentAuth from '@/components/StudentAuth';
import TeacherAuth from '@/components/TeacherAuth';
import Typewriter from 'typewriter-effect';
import { AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const AnimatedSection = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={mainControls}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      {children}
    </motion.div>
  );
};

const interactiveSteps = [
  {
    id: "create",
    title: "Launch a Classroom Instantly",
    description: "No complex setup. Create a new, secure classroom session with a single click. Your collaborative space is ready when you are.",
    icon: <Presentation />,
    visual: (
      <div className="w-full h-full bg-slate-200 p-4 rounded-lg flex flex-col">
        <div className="font-mono text-sm text-slate-500">
          <p>&gt; vava create:classroom "CS101 Intro to Python"</p>
          <p className="text-green-500">Success! Classroom "CS101 Intro to Python" created.</p>
        </div>
        <div className="mt-4 p-4 bg-white rounded shadow-inner flex-1 flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-slate-700">CS101 Intro to Python</h3>
            <p className="text-sm text-slate-500">Your session is now live.</p>
        </div>
      </div>
    ),
  },
  {
    id: "share",
    title: "Share & Edit Code in Real-Time",
    description: "Utilize the power of the Monaco Editor (the heart of VS Code) to write, edit, and run code live. Students see every keystroke, making for a truly interactive lesson.",
    icon: <Code2Icon />,
    visual: (
      <div className="w-full h-full bg-gray-800 p-4 rounded-lg flex flex-col font-mono text-sm">
        <div className="flex-1 text-white">
          <span className="text-blue-400">def</span> <span className="text-yellow-300">hello_vava</span>():<br/>
          &nbsp;&nbsp;message = <span className="text-green-400">"Hello, Interactive Classroom!"</span><br/>
          &nbsp;&nbsp;<span className="text-blue-400">print</span>(message)
        </div>
        <div className="mt-2 p-2 bg-black rounded text-green-400 text-xs">
            &gt; Hello, Interactive Classroom!
        </div>
      </div>
    ),
  },
  {
    id: "video",
    title: "Integrate Seamless Video Lessons",
    description: "No need to juggle multiple apps. Embed video lessons directly into your posts. Perfect for pre-recorded lectures, tutorials, or supplementary material.",
    icon: <VideoIcon />,
    visual: (
       <div className="w-full h-full bg-slate-900 p-4 rounded-lg flex flex-col items-center justify-center text-white">
          <VideoIcon className="w-16 h-16 text-slate-500 mb-4"/>
          <div className="w-full h-4 bg-slate-700 rounded-full">
            <div className="w-1/2 h-full bg-indigo-500 rounded-full"></div>
          </div>
          <p className="text-sm mt-3 text-slate-400">Lecture 5: Asynchronous Functions</p>
      </div>
    ),
  },
   {
    id: "collab",
    title: "Collaborate with Rich Content",
    description: "Go beyond just code. Create comprehensive posts with rich text, formatted notes, images, and voice recordings to create a multi-faceted learning experience.",
    icon: <MessageSquare />,
    visual: (
      <div className="w-full h-full bg-white p-4 rounded-lg flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-2">Weekly Announcement</h3>
        <p className="text-sm text-slate-600">Don't forget to review the notes on <span className="font-semibold text-indigo-600">Big O notation</span> before our next session!</p>
        <div className="mt-4 p-3 bg-slate-100 rounded-lg text-xs text-slate-500">
          Attached: Big_O_Cheatsheet.pdf
        </div>
      </div>
    ),
  },
];

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

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [activeStep, setActiveStep] = useState(interactiveSteps[0].id);

  const sectionRefs = {
    features: useRef(null),
    testimonials: useRef(null),
    faq: useRef(null),
  };

  const stepRefs = {
    create: useRef(null),
    share: useRef(null),
    video: useRef(null),
    collab: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      // Handle navbar background change
      setScrolled(window.scrollY > 10);

      // Handle active link highlighting
      let currentSection = '';
      for (const [id, ref] of Object.entries(sectionRefs)) {
        const section = ref.current;
        if (section) {
          const sectionTop = section.offsetTop - 100; //-100 to trigger a bit earlier
          const sectionBottom = sectionTop + section.offsetHeight;
          if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = id;
          }
        }
      }
      setActiveLink(currentSection);

      // Handle interactive section steps
      let currentStep = activeStep;
      for (const [id, ref] of Object.entries(stepRefs)) {
        const section = ref.current;
        if (section) {
          const sectionTop = section.offsetTop - window.innerHeight / 2;
          const sectionBottom = sectionTop + section.offsetHeight;
           if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentStep = id;
          }
        }
      }
      setActiveStep(currentStep);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRefs, activeStep, stepRefs]);

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
  };

  const handleCloseDialog = () => {
    setSelectedRole(null);
  };

  return (
    <>
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2">
          <Code className={`h-7 w-7 transition-colors ${scrolled ? 'text-indigo-600' : 'text-white'}`} />
          <span className={`text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-indigo-600' : 'text-white'}`}>Vava Classroom</span>
        </div>
        <div className="hidden md:flex gap-6 font-medium">
          <a href="#features" className={`transition-all ${activeLink === 'features' ? 'text-indigo-600 font-semibold' : (scrolled ? 'text-gray-600' : 'text-white')} hover:text-indigo-600`}>Features</a>
          <a href="#testimonials" className={`transition-all ${activeLink === 'testimonials' ? 'text-indigo-600 font-semibold' : (scrolled ? 'text-gray-600' : 'text-white')} hover:text-indigo-600`}>Testimonials</a>
          <a href="#faq" className={`transition-all ${activeLink === 'faq' ? 'text-indigo-600 font-semibold' : (scrolled ? 'text-gray-600' : 'text-white')} hover:text-indigo-600`}>FAQ</a>
        </div>
        <Button onClick={() => handleRoleSelect('teacher')} className="bg-indigo-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
          Get Started
        </Button>
      </nav>

      {/* Animated Gradient Hero Section */}
      <header className="relative flex flex-col items-center justify-center min-h-screen pt-20 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 animate-gradient-xy"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-xl">
            <Typewriter
              options={{
                strings: [
                  'The Future of Interactive Learning is Here',
                  'Empower Your Classroom with Vava',
                  'Code, Collaborate, and Create Together',
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto drop-shadow-lg">
            An all-in-one platform for live coding sessions, real-time collaboration, and seamless classroom management. Built for the modern educator and student.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-full shadow-xl hover:bg-gray-100 transition-transform transform hover:scale-105" onClick={() => handleRoleSelect('student')}>
              Join as a Student
            </Button>
            <Button size="lg" className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-full shadow-xl hover:bg-white/20 transition-transform transform hover:scale-105" onClick={() => handleRoleSelect('teacher')}>
              Lead as a Teacher
            </Button>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section id="features" ref={sectionRefs.features} className="w-full max-w-5xl mx-auto py-20 px-4">
        <AnimatedSection>
          <h2 className="text-4xl font-bold text-center mb-12">Why Vava Classroom?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="p-4 inline-block rounded-full bg-indigo-100 mb-4">
                <TerminalSquare className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Code Editing</h3>
              <p>Share and edit code in real-time with Monaco Editor, the engine behind VS Code.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="p-4 inline-block rounded-full bg-indigo-100 mb-4">
                <Video className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Video Integration</h3>
              <p>Embed video lessons directly into your posts for a complete learning experience.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="p-4 inline-block rounded-full bg-indigo-100 mb-4">
                <BookOpen className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rich Content Creation</h3>
              <p>Create engaging posts with rich text, images, and embedded content.</p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-20 px-4 bg-gray-100">
          <div className="max-w-6xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">See Vava in Action</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">From creating a class to collaborating in real-time, see how our platform transforms the educational experience step-by-step.</p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              {/* Left "Sticky" Column */}
              <div className="sticky top-28 h-[30rem] hidden md:block">
                  <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl border p-2">
                       <div className="absolute top-4 left-4 flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="w-full h-full pt-8">
                        <AnimatePresence mode="wait">
                          <motion.div
                              key={activeStep}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                              className="w-full h-full"
                          >
                              {interactiveSteps.find(s => s.id === activeStep)?.visual}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                  </div>
              </div>
              {/* Right Scrolling Column */}
              <div className="space-y-24 md:space-y-48">
                  {interactiveSteps.map((step) => (
                      <div key={step.id} ref={stepRefs[step.id]} className="md:min-h-[20rem] text-left">
                          {/* Mobile-only Visual */}
                          <div className="block md:hidden mb-10">
                              <AnimatedSection>
                                <div className="relative w-full h-96 bg-white rounded-2xl shadow-2xl border p-2">
                                  <div className="absolute top-4 left-4 flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  </div>
                                  <div className="w-full h-full pt-8">
                                    {step.visual}
                                  </div>
                                </div>
                              </AnimatedSection>
                          </div>

                          {/* Text content for all sizes */}
                          <div className="p-4 inline-block rounded-full bg-indigo-100 mb-4 ring-8 ring-indigo-50">
                              {step.icon}
                          </div>
                          <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Role Selection Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-gray-100 py-16">
        <AnimatedSection>
          <section className="w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Get Started on Your Journey</h2>
            <p className="text-gray-600 mb-10">Choose your role to log in or sign up.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-indigo-500" onClick={() => handleRoleSelect('student')}>
                <CardHeader className="items-center text-center">
                  <div className="p-4 rounded-full bg-indigo-100 mb-4 transition-colors duration-300">
                    <GraduationCap className="w-10 h-10 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Student</CardTitle>
                  <CardDescription>Join a classroom, learn, and collaborate.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    Enter Session <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              <Card className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-indigo-500" onClick={() => handleRoleSelect('teacher')}>
                <CardHeader className="items-center text-center">
                  <div className="p-4 rounded-full bg-indigo-100 mb-4 transition-colors duration-300">
                    <Users className="w-10 h-10 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Teacher</CardTitle>
                  <CardDescription>Create a session and manage your class.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-semibold">
                    Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </AnimatedSection>
      </main>

      {/* Testimonials Section */}
      <section id="testimonials" ref={sectionRefs.testimonials} className="w-full bg-white py-20 px-4">
        <AnimatedSection>
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Loved by Educators & Students</h2>
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

      {/* FAQ Section */}
      <section id="faq" ref={sectionRefs.faq} className="w-full max-w-3xl mx-auto py-16 px-4">
        <AnimatedSection>
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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

      {/* CTA Section */}
      <section className="w-full bg-indigo-600 py-20 mt-16 text-center text-white">
        <AnimatedSection>
          <h2 className="text-4xl font-bold mb-4">Ready to Revolutionize Your Classroom?</h2>
          <p className="text-xl mb-8">Sign up today and experience the future of education.</p>
          <Button size="lg" className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-full shadow-xl hover:bg-gray-100 transition-transform transform hover:scale-105" onClick={() => handleRoleSelect('teacher')}>
            Get Started for Free
          </Button>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-8">
        <AnimatedSection>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Vava Classroom</h3>
              <p className="text-sm text-gray-400">The future of collaborative learning.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Links</h3>
              <ul className="text-sm">
                <li><a href="#features" className="hover:text-indigo-400">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-indigo-400">How it Works</a></li>
                <li><a href="#faq" className="hover:text-indigo-400">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Connect</h3>
              <div className="flex justify-center space-x-4">
                <a href="#" className="hover:text-indigo-400"><Twitter /></a>
                <a href="#" className="hover:text-indigo-400"><Github /></a>
                <a href="#" className="hover:text-indigo-400"><Linkedin /></a>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-8">
            © {new Date().getFullYear()} Vava Classroom. All rights reserved.
          </div>
        </AnimatedSection>
      </footer>
    </div>

    <Dialog open={!!selectedRole} onOpenChange={(open) => !open && handleCloseDialog()}>
      <DialogContent className="sm:max-w-[425px]">
        {selectedRole === 'student' && <StudentAuth onBack={handleCloseDialog} />}
        {selectedRole === 'teacher' && <TeacherAuth onBack={handleCloseDialog} />}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Index;
