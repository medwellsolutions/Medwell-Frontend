import React from "react";

const About = () => {
  return (
    <section id = 'about' className="relative bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Image */}
        <div className="flex justify-center md:justify-start">
          <img
            src="https://images.squarespace-cdn.com/content/v1/5e335c197ce81d501c607a07/9cf078ff-1f69-4202-9111-af2e26e4cae6/male-corporate-headshots-tips"
            alt="About us"
            className="max-h-[500px] object-contain"
          />
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-gray-600 text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wide mb-6">
            About Us
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
            Turpis cursus in hac habitasse platea dictumst iaculis urna id 
            volutpat lacus.
          </p>

          {/* Quote */}
          <div className="border-l-4 border-orange-500 pl-4 mb-8">
            <p className="italic text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              “Sit amet risus nullam eget felis eget nunc. Et ligula ullamcor
              malesuada proin libero nunc consequat interdum. Tortor aliquam
              nulla facilisi cras fermentum diam sollicitudin tempor. Feugiat in
              fermentum posuere urna nec tincidunt praesent semper. Molestie
              nunc non blandit massa enim nec dui. Lectus arcu bibendum at varius
              vel pharetra vel turpis nunc. Commodo sed egestas egestas fringilla
              phasellus.”
            </p>
          </div>

          {/* Author */}
          <div className="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Jeremy Murphy"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-gray-400 font-bold text-lg sm:text-xl lg:text-2xl">Jeremy Murphy</p>
              <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
                CEO & Founder ChariHope
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Signature_of_William_Shakespeare.svg/1920px-Signature_of_William_Shakespeare.svg.png"
              alt="Signature"
              className="h-12 sm:h-14 lg:h-16"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
