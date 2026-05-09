import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {Check,X,Dot} from "lucide-react"
import exampleImg from "@/assets/example.png"
import mapImg from "@/assets/map.png"
import examle2Img from "@/assets/exampl2.png"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

const slides = [
  {
    img:exampleImg,
    badge: "NG-CDF Portal",
    heading: "Access Constituency Services and Development Updates",
    sub: "Apply for bursary support and view ongoing and completed development projects within your constituency.",
  },
  {
    img:exampleImg,
    badge: "Bursary Applications",
    heading: "Submit and Track Your Bursary Application",
    sub: "Apply for financial support and monitor the status of your bursary application through a transparent online system.",
  },
  {
    img:exampleImg,
    badge: "Constituency Development",
    heading: "Monitor Ongoing and Completed Projects",
    sub: "View funded development projects including schools, roads, water, and health facilities in your constituency.",
  },
];

export default function Homepage() {
  return (
    <div className="w-full">
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
          }),
        ]}
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full h-[580px] overflow-hidden">
                {/* Image — no rounded corners so no white gap */}
                <img
                  src={slide.img}
                  alt={slide.heading}
                  className="w-full h-full object-cover"
                />

                {/* White gradient overlay — left heavy, fades right */}
                <div className="absolute w-full flex justify-center items-center inset-0 " />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center 
                justify-center text-center px-8 md:px-16 w-full">
                  {/* Badge */}
                  <span className="inline-block w-fit  text-blue-600 
                  text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    {slide.badge}
                  </span>

                  {/* Heading */}
                  <h1 className="text-gray-900 text-3xl md:text-5xl font-semibold leading-tight mb-4">
                    {slide.heading}
                  </h1>

                  {/* Sub */}
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                    {slide.sub}
                  </p>

                  {/* Shared buttons — same on every slide */}
                  <div className="flex flex-wrap gap-8">
                    <Link
                      to="/bursary/apply"
                      className="bg-blue-500 hover:bg-blue-600 text-white 
                      font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-300 shadow-md"
                    >
                      Apply Bursary
                    </Link>
                    <Link
                      to="/funding"
                      className="bg-white hover:bg-blue-50 text-blue-600 
                      font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-300 
                      border border-blue-400 shadow-md"
                    >
                      Fundings
                    </Link>
                  </div>
                </div>

                {/* Slide counter */}
                <div className="absolute bottom-5 right-6 text-gray-500 text-xs font-mono">
                  {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <section className="w-full py-10 bg-white">
      <div className="w-full mx-auto ">
        <section className="flex flex-col md:flex-row gap-1 md:gap-12 items-center mx-auto px-6 w-full">
        <div>
        <h2 className="text-xl md:text-2xl font-bold text-blue-500 text-center">
          Why Use Muhoroni e-services?
        </h2>
        <p className="text-center text-green-500 mt-2 font-semibold mb-8 ">
          A faster, transparent and more reliable way to apply for bursary support.
        </p>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-center text-blue-500">
              Why is it an upgarde of NGCDF?
            </h2>
            <p className="text-center text-green-500 font-semibold mt-2 mb-8">
              Its no longer static,allowing the citizens to be able to interact with information.</p>
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 shadow-lg">
          <div className="p-4 rounded-2xl border bg-white text-center">
            <h3 className="font-semibold text-red-600 mb-3">
              Traditional Application (Old System)
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-center gap-2">
                <X className="text-red-600"/>
                <span>Travelling long distance to submit the forms</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="text-red-600"/>
                <span> Paperwork can be lost or damaged</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="text-red-600"/>
                <span>Not sure if approved to wait for disburment</span>
              </li>
              <li className="flex items-start gap-2"> 
               <X className="text-red-600"/>
               <span> Limited transparency</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl border bg-white shadow-lg">
            <h3 className="font-semibold text-blue-600 mb-3">
              Digital Application (New System)
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <Check className="text-blue-700"/>
                <span> Apply anytime from your phone or computer</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-blue-700"/>
                <span>Secure and stored digitally</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-blue-700"/>
                <span>No more long distance for submision</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-blue-700"/>
                <span>Track application status in real time</span>
              </li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-white shadow-lg border">
            <h3 className="text-center text-green-500 font-semibold mb-3">Here are the imporvements</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <Dot className="text-green-600"/>
                <span>One can comment on the on the projects</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot className="text-green-600"/>
                <span>Suggestion on particular development is possible</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot className="text-green-600"/>
                <span>Booking appointments from the site</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot className="text-green-600"/>
                <span>Complaining incase of a poor service from the staff</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <div className=" px-8 py-8 bg-blue-200 mx-auto shadow-md">
  <h1 className="text-center font-bold text-2xl text-white">
    Enjoy Seamless Navigation
  </h1>

  <p className="text-center text-lg italic text-green-600 mt-2 leading-relaxed">
    To submit comments, share suggestions, or access additional constituency
    services, please sign in to your account or register to continue.
  </p>
  <div className="flex justify-center mt-4">
    <Link
      to="/login"
      className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-medium px-6 py-2 rounded-lg shadow-sm"
    >
      Login
    </Link>
  </div>
  <p className="text-center text-sm text-blue-900 mt-4">
    Don't have an account?{" "}
    <Link
      to="/register"
      className="text-blue-700 font-semibold hover:underline"
    >
      Register here
    </Link>
  </p>
</div>
<section className="w-full py-10 px-3 bg-white">

  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-3 items-center">

    {/* LEFT SIDE */}
    <div className="bg-green-200 px-6 py-4 rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800">
        One Constituency, Unlimited Opportunities
      </h2>

      <p className="mt-3 text-gray-600 italic leading-relaxed text-center">
        Serving all wards within Muhoroni Constituency through accessible
        bursary services and community development programs.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-white px-3 text-blue-500 text-center py-2 rounded-lg font-semibold">
          Miwani Ward
        </div>

        <div className="bg-blue-50 px-3 py-2 rounded-lg">
          Ombeyi Ward
        </div>

        <div className="bg-blue-50 px-3 py-2 rounded-lg">
          Chemelil Ward
        </div>

        <div className="bg-blue-50 px-3 py-2 rounded-lg">
          Muhoroni/Koru
        </div>
         <div className="bg-blue-50 px-3 py-2 rounded-lg">
          Masogo/Nyang'oma
        </div>


      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex justify-center">
      <img
        src={mapImg}
        alt="Muhoroni Constituency Map"
        className="w-full max-w-sm rounded-xl shadow-md"
      />
    </div>
  </div>
</section>
</div>
  );
}