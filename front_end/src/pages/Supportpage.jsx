import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";


const faqs = [
  {
    question: "Who is eligible to apply for the Mohoroni Constituency Bursary?",
    answer:
      "Applicants must be residents of Mohoroni Constituency and enrolled in a recognized institution such as secondary school, college, or university.",
  },
  {
    question: "What documents are required when applying?",
    answer:
      "You need a national ID or birth certificate, admission letter, fee structure, and proof of residence or school confirmation.",
  },
  {
    question: "How do I apply for the bursary?",
    answer:
      "You can apply through the official eCitizen bursary portal by creating an account, filling in the application form, and uploading the required documents.",
  },
  {
    question: "When is the application deadline?",
    answer:
      "Application deadlines are announced each academic cycle. Always check the bursary portal or local constituency office for updated dates.",
  },
  {
    question: "How will I know if I have been awarded the bursary?",
    answer:
      "Successful applicants will be notified through SMS, email, or by checking the status on the application portal.",
  },
  {
    question: "Can I apply again if I was not successful before?",
    answer:
      "Yes. Applicants who were not successful in previous cycles are encouraged to reapply in the next available cycle.",
  },
];

 export const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full px-4 md:px-16 py-12">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-green-500 mb-8 text-center">
        FAQs - Mohoroni Constituency Bursary
      </h2>

      {/* FAQ List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-xl overflow-hidden shadow-sm"
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-slate-50 transition"
            >
              <span className="font-semibold text-blue-800">
                {item.question}
              </span>

              {activeIndex === index ? (
                <Minus className="w-5 h-5 text-slate-600" />
              ) : (
                <Plus className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Answer */}
            {activeIndex === index && (
              <div className="px-4 md:px-5 pb-4 text-slate-600 text-sm md:text-base leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};



/* CONTACT SECTION */
export const ContactSection = () => {
  return (
    <section className="w-full py-10 px-4 ">

      {/* TITLE */}
      <h2 className="text-3xl text-center font-bold text-green-500 mb-8">
        Help & Support
      </h2>

      {/* CARDS WRAPPER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* CALL US */}
        <div className="flex flex-col items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">

          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
            📞
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            Call us
          </h3>

          <p className="text-sm text-slate-500">
            24 Hrs a day, 7 Days a week
          </p>

          <a
            href="tel:+254207903260"
            className="text-green-600 font-semibold hover:underline"
          >
            +254748626181
          </a>
        </div>

        {/* WRITE US */}
        <div className="flex flex-col items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">

          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
            @
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            Write us
          </h3>

          <p className="text-sm text-slate-500">
            Email:
          </p>

          <a
            href="mailto:support@ecitizen.go.ke"
            className="text-green-600 font-semibold hover:underline break-all"
          >
            harryventary@gmail.com
          </a>
        </div>

        {/* VISIT US */}
        <div className="flex flex-col items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">

          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
            📍
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            Visit us
          </h3>

          <p className="text-sm text-slate-500">
            Find us at:
          </p>

          <p className="text-green-700 font-semibold">
            Chemelil Chiro 
          </p>

        </div>

      </div>
    </section>
  );
};


/* Teh main page that is being rendered*/
const SupportPage = () => {

  const navigate=useNavigate()

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-12">

        {/* APPLICATION GUIDE */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border text-center space-y-4">

          <h1 className="text-3xl font-bold text-green-400">
            Application Guide
          </h1>

          <p className="text-slate-500 max-w-xl mx-auto">
            Learn how to successfully complete your bursary application.
          </p>

          <button
            onClick={() =>navigate("/application/guide")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Get Application Guide
          </button>

        </section>

        {/* CONTACT + FAQ */}
        <section className="flex flex-col gap-6">

            {<ContactSection/>}
            {<FAQSection/>}

        </section>

      </div>
    </div>
  );
};

export default SupportPage;