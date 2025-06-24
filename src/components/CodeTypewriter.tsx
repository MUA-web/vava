import { useState } from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';

const CodeTypewriter = ({ lines, output }) => {
  const [showOutput, setShowOutput] = useState(false);

  return (
    <div className="w-full h-full">
      <div className="flex-1 text-white min-h-[80px]">
        <Typewriter
          options={{
            delay: 40,
            cursor: '▋',
            loop: true,
          }}
          onInit={(typewriter) => {
            let chain = typewriter.pauseFor(1000);
            lines.forEach((line, index) => {
                chain = chain.typeString(line);
                if (index < lines.length - 1) {
                    chain = chain.typeString('<br/>').pauseFor(300);
                }
            });
            chain
              .callFunction(() => {
                setShowOutput(true)
              })
              .pauseFor(3000)
              .callFunction(() => {
                  setShowOutput(false)
              })
              .deleteAll(1)
              .start();
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showOutput ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        dangerouslySetInnerHTML={{ __html: output }}
      />
    </div>
  );
};

export default CodeTypewriter; 