export default function ApplicationGuidePage() {
  const steps = [
    {
      title: "Step 1 Guide (Personal Information)",
      points: [
        "Fill your full name as it appears in official documents.",
        "Select the correct bursary type.",
        "Provide your ID number or Birth Certificate number (one is required).",
        "Enter correct age, phone number, and gender.",
        "If you have a disability, tick the checkbox and fill in the disability type field. Leave it blank if not applicable.",
        
      ],
      type: "info",
    },
    {
      title: "Step 2&3 Guide (You Address &Instituion info)",
      points: [
        "Choose your area word correctly.",
        "The location address must be as they appear in your Birthcertficate of National ID",
        "Wrong or inavalid address may bring suspision,hence the application can rejected without review.",
        "Fill your school info crrenctly,the school fee details should be as in the school fee reciepts"
        
      ],
      type: "info",
    },
    {
      title:"Step3 Guide (Family Information)",
      points:[
        "Fill your parents details correctly as they appear on their official documents",
        "Parents occupation is very important for parent who is alive",
        "Parental status must be supported with required documents if necessary",
        "If you have sponsor click the has Sposor checkbox ,a lable of sponsor name will appear.Kindley fill it"
      ],
      type:"info"
    },
    {
      title:"step 5 guide(proof of burden)",
      points:[
        "Enter the details of your siblings in highschool or campus ",
        "If you have more than one sibling ,after filling the available section click the add button for a new section and fill it",
        "If your sibling is a Beneficiary click the click the isBeneficiary button ,lable of beneficiary explanation will appear ,fill it ",
        "Proof of burden requires document support i the latter statges ie birth certificate and fee payment receipts "
      ],
      type:"info"
    },
    {
      title:"Step 6&7 (Documents and Documents review)",
      points:[
        "Take a clear pictures of your documents",
        "One document allow for 2 to 3 images so make sure your documents are very clear",
        "Select your document type ",
        "Upload all the images for the document type,",
        "Click the add button for a new document type and repeat the procedure",
        "After uploading all your documents, click the next button for document preview",
        "The images will appear in the preview page ,click th image for proper preview",
        "A image-modal will appear,if its not the correct image delete it",
        "Incase you have deleted go back,check the image title and upload a nw image  ",
        "If the image is correct click cancel on the modal,and submit the application form"

      ],
      type:"info"
    }
  ];

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50";
      case "warning":
        return "border-red-200 bg-red-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Application Guide
        </h1>
        <p className="text-slate-600 mt-2">
          Follow these structured steps carefully to complete your application successfully.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`rounded-2xl border shadow-sm p-6 hover:shadow-md transition ${getStyles(
              step.type
            )}`}
          >
            {/* TITLE */}
            <h3 className="font-semibold text-lg text-slate-800 mb-4">
              {step.title}
            </h3>

            {/* POINTS */}
            <ul className="space-y-2 text-slate-700 text-sm">
              {step.points.map((point, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FOOTER WARNING */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm">
          <p>⚠️ Make sure you have selected the correct application type,Not every applicant i eligible for scholarship.</p>
          <p>⚠️ Ensure all information is correct. False or incomplete details may lead to automatic rejection.</p>
        </div>
      </div>
    </div>
  );
}