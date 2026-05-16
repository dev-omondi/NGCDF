import React from 'react'
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {ShieldCheck,FileText,Clock3,Smartphone,SearchCheck,Users} 
from "lucide-react";
import { Link } from "react-router-dom";
import image1 from "@/assets/image1.png"
import image2 from "@/assets/image2.png"

const slides = [
  { img: image1 },
  { img: image2 },
];
 const features = [
    {
      icon: <Clock3 className="w-10 h-10 text-blue-600" />,
      title: "Fast Application Process",
      description:
        "Apply for bursary online within minutes without visiting offices physically.",
    },
    {
      icon: <FileText className="w-10 h-10 text-blue-600" />,
      title: "Easy Document Upload",
      description:
        "Upload all required documents securely through the platform.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
      title: "Secure & Reliable",
      description:
        "Your information and documents are protected with secure storage.",
    },
    {
      icon: <SearchCheck className="w-10 h-10 text-blue-600" />,
      title: "Transparent Review",
      description:
        "Applications are reviewed fairly and applicants receive feedback.",
    },
    {
      icon: <Smartphone className="w-10 h-10 text-blue-600" />,
      title: "Mobile Friendly",
      description:
        "Access the bursary platform easily using your phone or computer.",
    },
    {
      icon: <Users className="w-10 h-10 text-blue-600" />,
      title: "Accessible to Everyone",
      description:
        "Students and parents can apply anytime from anywhere.",
    },
  ];

const Homepage = () => {
  return (
    <div className="overflow-hidden w-full">
      <div className="relative w-full px-0.5">
        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
            }),
          ]}
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[560px] overflow-hidden">
                  <img
                    src={slide.img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Floating buttons */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-0 right-0 flex justify-center gap-3 sm:gap-4 z-10 pointer-events-none px-4">
          <Link
            to="/bursary/apply"
            className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 md:px-7 rounded-lg text-xs sm:text-sm shadow-lg transition-all duration-300"
          >
            Apply Now
          </Link>
          <Link
            to="/bursary/status"
            className="pointer-events-auto bg-white/90 hover:bg-white text-blue-700 font-semibold px-4 py-2 sm:px-6 sm:py-3 md:px-7 rounded-lg text-xs sm:text-sm shadow-lg transition-all duration-300 border border-blue-300"
          >
            Check Status
          </Link>
        </div>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10 bg-gray-50">
  
  {/* Application Process */}
  <div className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-2xl transition duration-300">
    <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
      Application Process
    </h2>
    <div className="space-y-4 text-gray-700">
      <div className="flex items-start gap-3">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">
          1
        </span>
        <p>Choose the bursary type suitable for your application.</p>
      </div>
      <div className="flex items-start gap-3">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">
          2
        </span>
        <p>Fill in all application forms accurately and completely.</p>
      </div>
      <div className="flex items-start gap-3">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">
          3
        </span>
        <p>Upload and verify all required supporting documents.</p>
      </div>
      <div className="flex items-start gap-3">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">
          4
        </span>
        <p>Wait for review and feedback from the Muhoroni NG-CDF office.</p>
      </div>
      <div className="mt-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
        Applications submitted after the deadline will not be considered.
      </div>
    </div>
  </div>

  {/* FAQ Section */}
  <div className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-2xl transition duration-300">
    <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
      Frequently Asked Questions
    </h2>
      <Accordion type="single" collapsible className="w-full space-y-3">
        
        <AccordionItem value="item-1" >
          <AccordionTrigger>
            Who is eligible for the bursary?
          </AccordionTrigger>

          <AccordionContent className="text-gray-600">
            Students residing within Muhoroni Constituency and enrolled in recognized institutions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" >
          <AccordionTrigger>
            When is the application deadline?
          </AccordionTrigger>

          <AccordionContent className="text-gray-600">
            The deadline will be communicated officially on the platform homepage.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" >
          <AccordionTrigger>
            What is the application cost on this platform?
          </AccordionTrigger>

          <AccordionContent className="text-gray-600">
            the bursary application process is completely free.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Can I edit my details later?
          </AccordionTrigger>

          <AccordionContent className="text-gray-600">
            Yes, you can edit your details before final submission.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            How do i know that my application is verified?
          </AccordionTrigger>
          <AccordionContent className={"text-shadow-gray-600"}>
            Continuosly check on your application status for the updates
          </AccordionContent>
        </AccordionItem>

      </Accordion>
  </div>

  {/* Documents Checklist */}
  <div className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-2xl transition duration-300">
    <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
      Required Documents
    </h2>
    <ul className="space-y-4 text-gray-700">
      <li className="flex items-center gap-3">
        <span className="text-green-500 text-xl">✔</span>
        National ID / Birth Certificate
      </li>
      <li className="flex items-center gap-3">
        <span className="text-green-500 text-xl">✔</span>
        Admission Letter
      </li>
      <li className="flex items-center gap-3">
        <span className="text-green-500 text-xl">✔</span>
        School Fee Structure
      </li>
      <li className="flex items-center gap-3">
        <span className="text-green-500 text-xl">✔</span>
        Parent/Guardian ID Copy
      </li>
      <li className="flex items-center gap-3">
        <span className="text-green-500 text-xl">✔</span>
        KCSE Result Slip / Academic Transcript
      </li>
      <li className="flex items-center gap-3">
        <span className="text-green-500 text-xl">✔</span>
        National Votter Card
      </li>
      <li className="flex items-center gap-3">
        <span className="text-green-500 text-xl">✔</span>
        Admision Number
      </li>
    </ul>
    <div className="mt-6 bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-700">
      Ensure all uploaded documents are clear and valid.
    </div>
  </div>
</section>

{/*Why muhoroni bursary eservice*/}
<section className="py-4 px-4 bg-gray-50">
      
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-4">
          Why Muhoroni Bursary eService?
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          The Muhoroni NG-CDF Bursary eService simplifies the bursary
          application process by making it faster, transparent, and accessible
          to all students.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition duration-300 border border-gray-100"
          >
            <div className="mb-5">{feature.icon}</div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {feature.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}

      </div>
    </section>
    </div>
  )
}

export default Homepage
