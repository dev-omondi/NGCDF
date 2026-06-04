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
      title: "Step 2 Guide (You Address)",
      points: [
        "Choose your area word correctly.",
        "The location address must be as they appear in your Birthcertficate of National ID",
        "Wrong or inavalid address may bring suspision,hence the application can rejected without review.",
        
      ],
      type: "info",
    },
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
          ⚠️ Ensure all information is correct. False or incomplete details may lead to automatic rejection.
        </div>
      </div>
    </div>
  );
}