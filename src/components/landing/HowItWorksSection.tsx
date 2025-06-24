import React from 'react';
import { motion } from 'framer-motion';
import { Presentation, Code2Icon, VideoIcon, MessageSquare } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';

const interactiveSteps = [
  {
    id: "create",
    title: "Launch a Classroom Instantly",
    description: "No complex setup. Create a new, secure classroom session with a single click. Your collaborative space is ready when you are.",
    icon: <Presentation className="w-8 h-8 text-indigo-600" />,
    visual: (
      <motion.div
        className="w-full h-full bg-slate-200 p-4 rounded-lg flex flex-col"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.6 }}
        variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
      >
        <motion.div
          className="font-mono text-sm text-slate-500"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <p>&gt; vava create:classroom "CS101 Intro to Python"</p>
          <p className="text-green-500">Success! Classroom "CS101 Intro to Python" created.</p>
        </motion.div>
        <motion.div
          className="mt-4 p-4 bg-white rounded shadow-inner flex-1 flex flex-col justify-center items-center"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
          }}
        >
            <motion.h3
              className="text-xl font-bold text-slate-700"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              CS101 Intro to Python
            </motion.h3>
            <motion.p
              className="text-sm text-slate-500"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              Your session is now live.
            </motion.p>
        </motion.div>
      </motion.div>
    ),
  },
  {
    id: "share",
    title: "Share & Edit Code in Real-Time",
    description: "Utilize the power of the Monaco Editor (the heart of VS Code) to write, edit, and run code live. Students see every keystroke, making for a truly interactive lesson.",
    icon: <Code2Icon className="w-8 h-8 text-indigo-600" />,
    visual: (
     <motion.div
       className="w-full h-full bg-gray-800 p-4 rounded-lg flex flex-col font-mono text-sm"
       initial="hidden"
       whileInView="visible"
       viewport={{ amount: 0.8 }}
       variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
     >
       <motion.div
         className="flex-1 text-white"
         variants={{ visible: { transition: { staggerChildren: 0.5 } } }}
       >
         <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
           <span className="text-blue-400">def</span> <span className="text-yellow-300">hello_vava</span>():
         </motion.p>
         <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
           &nbsp;&nbsp;message = <span className="text-green-400">"Hello, Interactive Classroom!"</span>
         </motion.p>
         <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
           &nbsp;&nbsp;<span className="text-blue-400">print</span>(message)
         </motion.p>
       </motion.div>
       <motion.div
         className="mt-2 p-2 bg-black rounded text-green-400 text-xs"
         variants={{
           hidden: { opacity: 0, y: 10 },
           visible: { opacity: 1, y: 0, transition: { delay: 1.5 } }
         }}
       >
           &gt; Hello, Interactive Classroom!
       </motion.div>
     </motion.div>
    ),
  },
  {
    id: "video",
    title: "Integrate Seamless Video Lessons",
    description: "No need to juggle multiple apps. Embed video lessons directly into your posts. Perfect for pre-recorded lectures, tutorials, or supplementary material.",
    icon: <VideoIcon className="w-8 h-8 text-indigo-600" />,
    visual: (
       <motion.div
         className="w-full h-full bg-slate-900 p-4 rounded-lg flex flex-col items-center justify-center text-white overflow-hidden"
         initial="hidden"
         whileInView="visible"
         viewport={{ amount: 0.6 }}
         variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
       >
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 400 } } }}>
           <VideoIcon className="w-16 h-16 text-slate-500 mb-4"/>
          </motion.div>
          <div className="w-full h-4 bg-slate-700 rounded-full">
            <motion.div
             className="h-full bg-indigo-500 rounded-full"
             variants={{
               hidden: { width: "0%" },
               visible: { width: "50%", transition: { duration: 1, ease: 'circOut' } }
             }}
            />
          </div>
          <motion.p
           className="text-sm mt-3 text-slate-400"
           variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
           Lecture 5: Asynchronous Functions
          </motion.p>
      </motion.div>
    ),
  },
   {
    id: "collab",
    title: "Collaborate with Rich Content",
    description: "Go beyond just code. Create comprehensive posts with rich text, formatted notes, images, and voice recordings to create a multi-faceted learning experience.",
    icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
    visual: (
      <motion.div
       className="w-full h-full bg-white p-4 rounded-lg flex flex-col"
       initial="hidden"
       whileInView="visible"
       viewport={{ amount: 0.6 }}
       variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
      >
        <motion.h3
         className="text-lg font-bold text-slate-800 border-b pb-2 mb-2"
         variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
        >
         Weekly Announcement
        </motion.h3>
        <motion.p
         className="text-sm text-slate-600"
         variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        >
         Don't forget to review the notes on <span className="font-semibold text-indigo-600">Big O notation</span> before our next session!
        </motion.p>
        <motion.div
         className="mt-4 p-3 bg-slate-100 rounded-lg text-xs text-slate-500"
         variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
        >
          Attached: Big_O_Cheatsheet.pdf
        </motion.div>
      </motion.div>
    ),
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="w-full py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
    <div className="max-w-6xl mx-auto text-center mb-24">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">See Vava in Action</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">From creating a class to collaborating in real-time, see how our platform transforms the educational experience step-by-step.</p>
    </div>
    <div className="max-w-6xl mx-auto space-y-24">
      {interactiveSteps.map((step, index) => (
        <AnimatedSection key={step.id}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`text-center md:text-left ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
              <div className="p-4 inline-block rounded-full bg-indigo-100 mb-6 ring-8 ring-indigo-50">
                  {step.icon}
              </div>
              <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-600 text-lg">{step.description}</p>
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              <div className="relative w-full h-80 md:h-96">
                <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl border p-2">
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="w-full h-full pt-8">
                    {step.visual}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  </section>
);

export default HowItWorksSection; 