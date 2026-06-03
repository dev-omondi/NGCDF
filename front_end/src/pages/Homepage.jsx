import React,{useState,useEffect} from 'react'
import { useOpenCycleQuery } from '@/cycleRedux/cycleBase.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {ShieldCheck,FileText,Clock3,Smartphone,SearchCheck,Users
  ,Building2,Landmark,CheckCircle, Calendar, Clock, Timer
} 
from "lucide-react";
import { Link } from "react-router-dom";


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
const {data,isLoading,isError}=useOpenCycleQuery()

const cycle=data?.data ||[]
console.log("cycle",cycle)

const Countdown = ({ endDate }) => {
   if (!endDate) {
    return "Application Closed";
  }
  const difference = new Date(endDate).getTime() - Date.now();
  if (isNaN(difference) || difference <= 0) {
    return "Application Closed";
  }

  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const updateCountdown = () => {
      const difference = new Date(endDate).getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (difference % (1000 * 60 * 60)) /
            (1000 * 60)
        ),
        seconds: Math.floor(
          (difference % (1000 * 60)) / 1000
        ),
      });
    };

    updateCountdown(); // run immediately

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return <span>Application Closed</span>;
  }

  return (
    <span>
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
      {timeLeft.seconds}s
    </span>
  );
};


  return (
    <div className="overflow-hidden w-full">
       <section className="relative w-full min-h-[60vh] flex items-center bg-gradient-to-r
        from-blue-950 via-blue-900 to-blue-700 text-white overflow-hidden">

      {/* Decorative background shapes */}
      <div className="absolute inset-0">
        <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl top-10 left-10"> </div>
        <div className="absolute w-80 h-80 bg-blue-300/10 rounded-full blur-3xl bottom-10 right-10"> </div>
        <div className="absolute w-60 h-60 bg-white/5 rounded-full blur-2xl top-1/2 left-1/3"> </div>
      </div>

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE TEXT */}
          <div className="space-y-6 text-center p-4 lg:text-left">
            <div className="inline-block px-4 py-2 text-white bg-green-700 border  border-white/20 rounded text-sm tracking-wide">
              Muhoroni NG-CDF Bursary Portal
            </div>
            <h1 className="text-3xl md:text-3xl font-semibold leading-tight">
              Apply for Bursary Support <br />
              <span className="text-blue-200">Quickly, Securely & Transparently</span>
            </h1>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-xl">
              This platform allows students to submit bursary applications,
              track their status, and receive updates in a simple and secure way.
              Built to ensure fairness and transparency in allocation.
            </p>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center lg:justify-start pt-2">
              <button className="px-6 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-red-400 transition duration-300 shadow-lg">
                Get Guide
              </button>
              <button className="px-6 py-3 border border-white/30 bg-green-600 rounded-lg hover:bg-white/10 transition duration-300">
                Apply Now
              </button>
            </div>
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 py-4 text-xs text-blue-100 justify-center lg:justify-start">
              <span>✔ Secure System</span>
              <span>✔ Transparent Process</span>
              <span>✔ Fast Processing</span>
            </div>
          </div>

          {/* RIGHT SIDE (SYSTEM CARD MOCKUP instead of image) */}
          <div className="hidden lg:flex justify-center">
            <div className="w-[340px] bg-white/10 border border-white/20 backdrop-blur-xl 
            rounded-2xl p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="h-3 w-24 bg-white/30 rounded"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-white/20 rounded-lg"></div>
                  <div className="h-10 bg-white/20 rounded-lg"></div>
                  <div className="h-10 bg-white/20 rounded-lg"></div>
                </div>
                <div className="h-10 bg-blue-300/40 rounded-lg mt-4"></div>
                <div className="text-xs text-blue-100 pt-2">
                  Sample Application Form Preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>  
         <section className="w-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-4">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

         {/* System Guidelines */}
  <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-200">
    
  <h2 className="text-2xl font-semibold text-green-600 mb-4 ">
      System Guidelines
    </h2>

    <ul className="space-y-3 text-gray-500 text-sm sm:text-xl leading-relaxed">

      <li className="flex gap-2">
        <span className="text-blue-600">•</span>
        <p>
        First-time applicants should visit the <strong className='text-green-500'>Get Guided</strong> 
        section for assistance.
        </p>
       
      </li>

          <li className="flex gap-2">
            <span className="text-blue-600">•</span>
            Ensure all details are accurate before submission.
             No updates are allowed after submission.
          </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              Applications cannot be completed after the cycle deadline.
            </li>

            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              Some Links require authentication. Please create an account 
              to access all services.
            </li>
          </ul>
        </div>

          {/* APPROVED BY */} 
          <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">

            <h2 className="text-xl md:text-2xl font-semibold text-green-600">
              Approved By
            </h2>
            <p className="text-sm text-gray-500">
              This bursary portal is officially supported
               by recognized government and constituency bodies.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <Building2 className="w-8 h-8 text-blue-700" />
                <span className="text-sm font-medium text-gray-700">
                  NG-CDF Office
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <Landmark className="w-8 h-8 text-blue-700" />
                <span className="text-sm font-medium text-gray-700">
                  Government of Kenya
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <ShieldCheck className="w-8 h-8 text-blue-700" />
                <span className="text-sm font-medium text-gray-700">
                  Education Board
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="w-8 h-8 text-blue-700" />
                <span className="text-sm font-medium text-gray-700">
                  Muhoroni Constituency
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
    
{/* ================= APPLICATION CYCLE ================= */}
<div className="bg-green-600 rounded-2xl shadow-sm border border-green-100 p-5 space-y-6">

  {/* Header */}
  <div className="flex items-center justify-center gap-2">
    <Calendar className="text-blue-700 w-5 h-5" />
    <h2 className="text-xl md:text-2xl font-semibold text-green-900">
      Application Cycle Info
    </h2>
  </div>

  {/* Dynamic Data Section */}
  {cycle ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Status */}
      <div className="p-4 bg-white rounded-xl border border-green-100 shadow-sm flex items-start gap-3">
        <CheckCircle className="text-green-600 w-5 h-5 mt-1" />
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="text-sm font-semibold text-blue-500 capitalize">
            {cycle?.status ||"Application Closed"}
          </p>
        </div>
      </div>

      {/* Opening Date */}
      <div className="p-4 bg-white rounded-xl border border-green-100 shadow-sm flex items-start gap-3">
        <Calendar className="text-green-600 w-5 h-5 mt-1" />
        <div>
          <p className="text-xs text-gray-500">Opening Date</p>
          <p className="text-sm font-medium text-blue-500">
            { cycle?.openingDate?new Date(cycle.openingDate).toDateString():"Application Closed"}
          </p>
        </div>
      </div>

      {/* Closing Date */}
      <div className="p-4 bg-white rounded-xl border border-green-100 shadow-sm flex items-start gap-3">
        <Clock className="text-green-600 w-5 h-5 mt-1" />
        <div>
          <p className="text-xs text-gray-500">Closing Date</p>
          <p className="text-sm font-medium text-blue-500">
            { cycle.clossingDate?new Date(cycle.clossingDate).toDateString():"Application Closed"}
          </p>
        </div>
      </div>

      {/* Countdown (placeholder) */}
      <div className="p-4 bg-white rounded-xl border border-green-100 shadow-sm flex items-start gap-3">
        <Timer className="text-green-600 w-5 h-5 mt-1" />
        <div>
          <p className="text-xs text-gray-500">Countdown</p>
          <p className="text-sm font-medium text-blue-500">            
              <Countdown endDate={cycle?.clossingDate} />
              </p>
            </div>
          </div>

          </div>
        ) : (
          <div className="p-5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
            No active application cycle at the moment.
          </div>
        )}
      </div>

      {/*Why muhoroni bursary eservice*/}
      <section className="py-4 px-4 bg-gray-50">      
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-green-700 mb-4">
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
