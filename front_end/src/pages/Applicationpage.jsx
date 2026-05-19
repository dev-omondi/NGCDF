
import { useState } from "react";

const steps = [
  "Personal Info",
  "Location",
  "Institution",
  "Family",
  "proof of burden",
  "Documents",
  
];

const ApplicationForm = () => {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    burSaryType: "",
    ward: "",
    location: "",
    subLocation: "",
    village: "",

    fullName: "",
    gender: "",
    phoneNumber: "",
    idNo: "",
    Age: "",

    institutionName: "",
    levelOfStudy: "",
    class: "",
    yearOfStudy: "",
    admissionNo: "",
    totalFees: "",
    feeBalance: "",

    fatherName: "",
    motherName: "",
    guardianName: "",
    fatherPhone: "",
    motherPhone: "",
    guardianRelationship: "",
    guardianPhone: "",

    hasDisability: false,
    disabilityType: "",

    parenthoodStatus: "",

    hasSponsor: false,
    sponsorName: "",

    documents:[
        {
      name: "",
      file: null,
    },
    ] ,
    siblings: [
  {
    name: "",
    institution: "",
    level: "",
    yearOfStudy: "",
    hasBeneficiarySibling: false,
    beneficiarySiblingsExplanation: "",
  },
],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFile = (e) => {
    setForm({
      ...form,
      documents: {
        ...form.documents,
        [e.target.name]: e.target.files[0],
      },
    });
  };
  {/**handle proof of burden change */}
  const handleSiblingChange = (index, e) => {
  const { name, value, type, checked } = e.target;

  const updated = [...form.siblings];

  updated[index][name] =
    type === "checkbox" ? checked : value;

  setForm({ ...form, siblings: updated });
};

{/**addd and remove sibllings incase of a mistake */}
const addSibling = () => {
  setForm({
    ...form,
    siblings: [
      ...form.siblings,
      {
        name: "",
        institution: "",
        level: "",
        yearOfStudy: "",
        hasBeneficiarySibling: false,
        beneficiarySiblingsExplanation: "",
      },
    ],
  });
};

const removeSibling = (index) => {
  const updated = form.siblings.filter((_, i) => i !== index);
  setForm({ ...form, siblings: updated });
};

{/**document funtionality
  for managinging documents fields
   */}
    const handleDocumentChange = (index, field, value) => {
  const updated = [...form.documents];

  updated[index][field] = value;

  setForm({
    ...form,
    documents: updated,
  });
};

const addDocument = () => {
  setForm({
    ...form,
    documents: [
      ...form.documents,
      {
        name: "",
        file: null,
      },
    ],
  });
};

const removeDocument = (index) => {
  const updated = form.documents.filter(
    (_, i) => i !== index
  );

  setForm({
    ...form,
    documents: updated,
  });
};

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = (e) => {
    e.preventDefault();
    console.log("FINAL APPLICATION:", form);
    // send via axios/formData to backend
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Bursary Application</h1>
          <p className="text-sm text-gray-500">
            Step {step + 1} of {steps.length} — {steps[step]}
          </p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i <= step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-6">

          {/* STEP 1 */}
          {step === 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" onChange={handleChange} className="input" />
              <select name="gender" onChange={handleChange} className="input">
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>

              <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="input" />
              <input name="idNo" placeholder="ID Number" onChange={handleChange} className="input" />
              <input name="Age" placeholder="Age" type="number" onChange={handleChange} className="input" />
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <input name="ward" placeholder="Ward" onChange={handleChange} className="input" />
              <input name="location" placeholder="Location" onChange={handleChange} className="input" />
              <input name="subLocation" placeholder="Sub Location" onChange={handleChange} className="input" />
              <input name="village" placeholder="Village" onChange={handleChange} className="input" />
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="grid md:grid-cols-2 gap-4">
              <input name="institutionName" placeholder="Institution Name" className="input" onChange={handleChange} />

              <select name="levelOfStudy" className="input" onChange={handleChange}>
                <option value="">Level of Study</option>
                <option>Secondary</option>
                <option>College</option>
                <option>University</option>
              </select>

              <input name="admissionNo" placeholder="Admission Number" className="input" onChange={handleChange} />
              <input name="class" placeholder="Class / Course" className="input" onChange={handleChange} />
              <input name="yearOfStudy" placeholder="Year of Study" className="input" onChange={handleChange} />
              <input name="totalFees" placeholder="Total Fees" type="number" className="input" onChange={handleChange} />
              <input name="feeBalance" placeholder="Fee Balance" type="number" className="input" onChange={handleChange} />
            </div>
          )}

          {/* STEP 4 */}
          
{step === 3 && (
  <div className="grid md:grid-cols-2 gap-4">

    {/* Parents */}
    <input
      name="fatherName"
      placeholder="Father Name"
      className="input"
      onChange={handleChange}
    />

    <input
      name="fatherPhone"
      placeholder="Father Phone Number"
      className="input"
      onChange={handleChange}
    />

    <input
      name="motherName"
      placeholder="Mother Name"
      className="input"
      onChange={handleChange}
    />

    <input
      name="motherPhone"
      placeholder="Mother Phone Number"
      className="input"
      onChange={handleChange}
    />

    {/* Parenthood Status */}
    <select
      name="parenthoodStatus"
      className="input"
      onChange={handleChange}
    >
      <option value="">Parenthood Status</option>
      <option>Both Parents Alive</option>
      <option>Single Parent</option>
      <option>Orphan</option>
      <option>Partial Orphan</option>
    </select>

    {/* NON-ORPHAN: sponsor section */}
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        name="hasSponsor"
        onChange={handleChange}
      />
      <label>Has Sponsor</label>
    </div>

    {form.hasSponsor && (
      <input
        name="sponsorName"
        placeholder="Sponsor Name"
        className="input"
        onChange={handleChange}
      />
    )}

    {/* ORPHAN CONDITIONAL FIELDS */}
    {form.parenthoodStatus === "Orphan" && (
      <>
        <input
          name="guardianName"
          placeholder="Guardian Full Name"
          className="input"
          onChange={handleChange}
        />

        <input
          name="guardianRelationship"
          placeholder="Relationship with Guardian (e.g Uncle, Aunt)"
          className="input"
          onChange={handleChange}
        />

        <input
          name="guardianPhone"
          placeholder="Guardian Phone Number"
          className="input"
          onChange={handleChange}
        />
      </>
    )}

  </div>
)}

{/* STEP 5 - PROOF OF BURDEN */}
{step === 4 && (
  <div className="space-y-6">

    <div className="flex justify-between items-center">
      <h2 className="font-semibold text-lg">
        Siblings in Education
      </h2>

      <button
        type="button"
        onClick={addSibling}
        className="bg-blue-600 text-white px-3 py-1 rounded-lg"
      >
        + Add Sibling
      </button>
    </div>

    {form.siblings.map((sib, index) => (
      <div
        key={index}
        className="grid md:grid-cols-2 gap-4 border p-4 rounded-xl bg-gray-50"
      >

        <input
          name="name"
          placeholder="Sibling Name"
          value={sib.name}
          onChange={(e) => handleSiblingChange(index, e)}
          className="input"
        />

        <input
          name="institution"
          placeholder="Institution Name"
          value={sib.institution}
          onChange={(e) => handleSiblingChange(index, e)}
          className="input"
        />

        <select
          name="level"
          value={sib.level}
          onChange={(e) => handleSiblingChange(index, e)}
          className="input"
        >
          <option value="">Level of Study</option>
          <option>High School</option>
          <option>College</option>
          <option>University</option>
        </select>

        <input
          name="yearOfStudy"
          placeholder="Year of Study"
          value={sib.yearOfStudy}
          onChange={(e) => handleSiblingChange(index, e)}
          className="input"
        />

        {/* Beneficiary sibling flag */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="hasBeneficiarySibling"
            checked={sib.hasBeneficiarySibling}
            onChange={(e) => handleSiblingChange(index, e)}
          />
          <label>Is Beneficiary of Another Bursary</label>
        </div>

        {sib.hasBeneficiarySibling && (
          <input
            name="beneficiarySiblingsExplanation"
            placeholder="Explain bursary support"
            value={sib.beneficiarySiblingsExplanation}
            onChange={(e) => handleSiblingChange(index, e)}
            className="input md:col-span-2"
          />
        )}

        <div className="md:col-span-2 flex justify-end">
          {form.siblings.length > 1 && (
            <button
              type="button"
              onClick={() => removeSibling(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    ))}

  </div>
)}
          {/* STEP 6 - DOCUMENTS */}
{step === 5 && (
  <div className="space-y-8">

    {/* HEADER */}
    <div>
      <h2 className="text-2xl font-bold text-slate-800">
        Supporting Documents
      </h2>

      <p className="text-sm text-slate-500 mt-2">
        Upload all required supporting documents clearly.
        Accepted formats include PDF, JPG, and PNG.
      </p>
    </div>

    {/* REQUIRED DOCUMENTS */}
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
      <h3 className="font-semibold text-slate-800 mb-4">
        Required Documents Checklist
      </h3>

      <ul className="space-y-3 text-sm text-slate-700">

        <li>
          <span className="text-red-600 font-bold">*</span>{" "}
          Birth Certificate / ID Photo (Mandatory)
        </li>

        {Number(form.Age) >= 18 && (
          <li>
            Copy of Applicant ID Card and Voter's Card
          </li>
        )}

        <li>
          Latest Report Form / Academic Transcript
          <span className="text-red-500">
            {" "} (Must be institution stamped)
          </span>
        </li>

        <li>
          Latest Payment Receipt showing Fee Balance
        </li>

        <li>
          Parent/Guardian ID Card Copy
        </li>

        <li>
          Parent/Guardian Voter's Card Copy
        </li>

        {(form.parenthoodStatus === "Orphan" ||
          form.parenthoodStatus === "Partial Orphan") && (
          <li>
            Death Certificate / Burial Permit
          </li>
        )}

        {form.siblings.length > 0 && (
          <li>
            Siblings Latest School Fee Receipts
          </li>
        )}

        <li>
          Fee Structure from Institution
        </li>

        <li>
          KCSE Result Slip / Previous Results
        </li>

        <li>
          Admission Letter for New Students
        </li>

      </ul>
    </div>

    {/* DOCUMENT INPUTS */}
    <div className="space-y-5">

      {form.documents?.map((doc, index) => (
        <div
          key={index}
          className="border border-slate-200 rounded-2xl p-5 bg-slate-50"
        >

          {/* TOP ROW */}
          <div className="flex flex-col md:flex-row gap-3 items-center">

            {/* DOCUMENT NAME */}
            <input
              type="text"
              placeholder="Enter document name"
              value={doc.name}
              onChange={(e) =>
                handleDocumentChange(
                  index,
                  "name",
                  e.target.value
                )
              }
              className="input flex-1"
            />

            {/* FILE INPUT */}
            <input
              type="file"
              onChange={(e) =>
                handleDocumentChange(
                  index,
                  "file",
                  e.target.files[0]
                )
              }
              className="input flex-1"
            />

            {/* ADD BUTTON */}
            {index === form.documents.length - 1 && (
              <button
                type="button"
                onClick={addDocument}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-xl font-medium whitespace-nowrap"
              >
                Add
              </button>
            )}

          </div>

          {/* FILE PREVIEW */}
          {doc.file && (
            <div className="mt-3">
              <p className="text-sm text-green-600">
                Selected File: {doc.file.name}
              </p>
            </div>
          )}

          {/* REMOVE BUTTON */}
          {form.documents.length > 1 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => removeDocument(index)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove Document
              </button>
            </div>
          )}

        </div>
      ))}

    </div>

  </div>
)}

          {/* BUTTONS */}
          <div className="flex justify-between pt-6">
            {step > 0 && (
              <button type="button" onClick={back} className="btn">
                Back
              </button>
            )}

            {step < steps.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary">
                Next
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SIMPLE STYLES */}
      <style>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 10px;
        }

        .btn {
          padding: 10px 20px;
          background: #eee;
          border-radius: 10px;
        }

        .btn-primary {
          padding: 10px 20px;
          background: #2563eb;
          color: white;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ApplicationForm;