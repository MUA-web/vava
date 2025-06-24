import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, Code, Clock, Monitor, FileText, ArrowRight } from 'lucide-react';
import StudentAuth from '@/components/StudentAuth';
import TeacherAuth from '@/components/TeacherAuth';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  if (selectedRole === 'student') {
    return <StudentAuth onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === 'teacher') {
    return <TeacherAuth onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Modern Nav Bar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 bg-white/90 shadow-sm">
        <div className="flex items-center gap-2">
          <Code className="h-7 w-7 text-blue-700" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight">Vava Classroom</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#about" className="hover:text-blue-700 transition">About</a>
          <a href="#features" className="hover:text-blue-700 transition">Features</a>
          <a href="#contact" className="hover:text-blue-700 transition">Contact</a>
        </div>
        <Button className="bg-blue-700 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-800 transition">Free Assessment</Button>
      </nav>

      {/* Wavy Header Background */}
      <div className="relative bg-blue-700">
        <svg className="absolute top-0 left-0 w-full h-32 md:h-40" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#2563eb" fillOpacity="1" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,181.3C1200,192,1320,192,1380,192L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
        <div className="relative z-10 flex flex-col items-center justify-center pt-16 pb-24 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow">Empowering Teachers. Inspiring Students.</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow">A modern platform for interactive learning, live coding, and seamless classroom communication.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow hover:bg-blue-50 transition" onClick={() => setSelectedRole('student')}>
              I'm a Student
            </Button>
            <Button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-blue-800 transition" onClick={() => setSelectedRole('teacher')}>
              I'm a Teacher
            </Button>
          </div>
        </div>
      </div>

      {/* Role Selection Section - well organized */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-[-60px]">
        <section className="w-full max-w-3xl py-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Get Started</h2>
          <p className="text-gray-600 mb-8">Choose your role to access the platform</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-blue-100" onClick={() => setSelectedRole('student')}>
              <CardHeader className="items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <GraduationCap className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl">I'm a Student</CardTitle>
                <CardDescription>Join a session and start coding.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setSelectedRole('student')}>
                  Enter Session <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-blue-100" onClick={() => setSelectedRole('teacher')}>
              <CardHeader className="items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <Users className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl">I'm a Teacher</CardTitle>
                <CardDescription>Manage your class and students.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full" onClick={() => setSelectedRole('teacher')}>
                  Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* About/Company Section */}
      <section id="about" className="w-full max-w-3xl mx-auto mt-16 bg-white/90 rounded-2xl shadow-lg p-8 border border-blue-100">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl">🏢</span>
          <h2 className="text-2xl font-bold text-blue-700">MUA Global Tech</h2>
        </div>
        <p className="text-lg font-semibold mb-2">Empowering Africa Through Innovation</p>
        <div className="flex flex-wrap gap-6 text-gray-600 text-sm mb-4">
          <span>📍 <b>Kano State, Nigeria</b></span>
          <span>👤 <b>Founder: Muhammad Usman Abdullahi</b></span>
        </div>
        <hr className="my-4" />
        <div className="mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-2 flex items-center gap-2">🌍 Vision</h3>
          <p className="text-gray-700">To become Africa's leading force in software development, AI innovation, and digital transformation by the year 2030.</p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-2 flex items-center gap-2">🎯 Missions</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Build powerful, user-friendly software for education, business, and daily life.</li>
            <li>Teach tech in Hausa and English to empower the next generation.</li>
            <li>Create world-class platforms like mini websites, smart POS agents, and AI content tools.</li>
            <li>Tackle real Nigerian problems with smart, affordable tech.</li>
            <li>Design tools that support African startups and small businesses.</li>
            <li>Push the limits of innovation by exploring advanced technologies like AI, Web3, and secure systems.</li>
            <li>Research and design defensive technologies in line with national regulations.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-2 flex items-center gap-2">💼 Focus Areas</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Web & Mobile App Development</li>
            <li>AI-powered Tools & Education Platforms</li>
            <li>Custom Business Solutions for Nigeria & Africa</li>
            <li>Localized Tech (Hausa/Multilingual Interfaces)</li>
            <li>Software-as-a-Service (SaaS)</li>
            <li>Digital Education & E-learning</li>
            <li>Innovation Labs and Hackathon Participation</li>
          </ul>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section className="w-full bg-blue-700 py-10 mt-16 flex flex-col items-center justify-center text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Empower Your Learning or Teaching?</h2>
        <p className="mb-6 text-lg">Join MUA Global Tech today and be part of Africa's digital transformation.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow hover:bg-blue-50 transition" onClick={() => setSelectedRole('student')}>
            Get Started as Student
          </Button>
          <Button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-blue-800 transition" onClick={() => setSelectedRole('teacher')}>
            Get Started as Teacher
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-4xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-4xl mb-2">🌟</span>
            <p className="text-gray-700 italic mb-2">"This platform made coding so much easier to learn. I love the live feedback!"</p>
            <span className="text-blue-700 font-semibold">Aisha, Student</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-4xl mb-2">🌟</span>
            <p className="text-gray-700 italic mb-2">"Managing my class and sharing assignments is a breeze. Highly recommended!"</p>
            <span className="text-blue-700 font-semibold">Mr. Bello, Teacher</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-4xl mb-2">🌟</span>
            <p className="text-gray-700 italic mb-2">"The support team is fantastic and the tools are so easy to use."</p>
            <span className="text-blue-700 font-semibold">Ngozi, Parent</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-3xl mx-auto mt-16 px-4" id="faq">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-blue-600 mb-1">Is MUA Global Tech free to use?</h3>
            <p className="text-gray-700">Yes! Students and teachers can get started for free. Premium features may be available in the future.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-blue-600 mb-1">Can I use the platform on my phone?</h3>
            <p className="text-gray-700">Absolutely. The platform is fully responsive and works on all devices.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-blue-600 mb-1">How do I get support?</h3>
            <p className="text-gray-700">You can contact our support team via the contact section or email us at <a href="mailto:support@muaglobaltech.com" className="text-blue-600 underline">support@muaglobaltech.com</a>.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="w-full max-w-2xl mx-auto mt-16 px-4">
        <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
          <h2 className="text-xl font-bold text-blue-700 mb-2">Stay Updated</h2>
          <p className="text-gray-600 mb-4">Subscribe to our newsletter for updates, tips, and resources.</p>
          <form className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            <Button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* Modern Footer with Links */}
      <footer className="w-full bg-blue-900 text-white text-sm py-8 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Code className="h-6 w-6 text-blue-200" />
            <span className="font-bold text-lg">Vava Classroom</span>
          </div>
          <div className="flex gap-6">
            <a href="#about" className="hover:underline">About</a>
            <a href="#faq" className="hover:underline">FAQ</a>
            <a href="mailto:support@muaglobaltech.com" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
          <div className="text-blue-200">&copy; {new Date().getFullYear()} MUA Global Tech. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
