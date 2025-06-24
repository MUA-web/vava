import React from 'react';
import { motion } from 'framer-motion';
import { TerminalSquare, Video, BookOpen } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';

const FeaturesSection = React.forwardRef((props, ref) => (
  <section id="features" ref={ref} className="w-full max-w-5xl mx-auto py-20 px-4">
    <AnimatedSection>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Why Vava Classroom?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-slate-50">
          <div className="p-4 inline-block rounded-full bg-indigo-100 mb-4">
            <TerminalSquare className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Live Code Editing</h3>
          <p>Share and edit code in real-time with Monaco Editor, the engine behind VS Code.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-slate-50">
          <div className="p-4 inline-block rounded-full bg-indigo-100 mb-4">
            <Video className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Video Integration</h3>
          <p>Embed video lessons directly into your posts for a complete learning experience.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-slate-50">
          <div className="p-4 inline-block rounded-full bg-indigo-100 mb-4">
            <BookOpen className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Rich Content Creation</h3>
          <p>Create engaging posts with rich text, images, and embedded content.</p>
        </div>
      </div>
    </AnimatedSection>
  </section>
));

export default FeaturesSection; 