
import { useState } from "react";
import { updateFormData,resetApplicationForm,setCurrentStep } from "@/applicationRedux/applicationSlice";
import { useDispatch,useSelector } from "react-redux";
import { useApplyMutation } from "@/applicationRedux/baseAppslice";
import { useUploadMutation } from "@/imageRedux/imageBase";
import { useNavigate } from "react-router-dom";
const steps = [
  "Personal Info",
  "Location",
  "Institution",
  "Family",
  "proof of burden",
  "Documents",
  "Review and Submit"
];

const ApplicationForm = () => {

  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {formData:form,currentStep:step}=useSelector((state)=>state.application)

  const[apply,{isLoading}]=useApplyMutation()
  const [upload,{isLoading:uploadLoading}]=useUploadMutation()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

   dispatch(
    updateFormData({
      [name]:type==="checkbox"?checked:value
    })
   )
  };
  {/**validating document upload so that the applicant must fill the document name */}
    const validateDocuments = () => {
    for (let i = 0; i < form.documents.length; i++) {
      const doc = form.documents[i];
      if (!doc.name) {
        alert(`Select document type for document ${i + 1}`);
        return false;
      }
      if (!doc.file) {
        alert(`Upload file for ${doc.name}`);
        return false;
      }
    }

  return true;
};

  {/**handle proof of burden change */}
  const handleSiblingChange = (index, e) => {
  const { name, value, type, checked } = e.target;

  const updated = form.siblings.map((sib, i) =>
    i === index
      ? {
          ...sib,
          [name]:
            type === "checkbox"
              ? checked
              : value,
        }
      : sib
  );

  dispatch(
    updateFormData({
      siblings: updated,
    })
  );
};
{/**addd and remove sibllings incase of a mistake */}
  const addSibling = () => {
  dispatch(
    updateFormData({
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
    })
  );
};

const removeSibling = (index) => {
  const updated = form.siblings.filter((_, i) => i !== index);
  dispatch(
  updateFormData({
    siblings: updated,
  })
);
};

{/**document funtionality
  for managinging documents fields
   */}
  const handleDocumentChange = (index, field, value) => {
  const updated = form.documents.map((doc, i) =>
    i === index
      ? {
          ...doc,
          [field]: value,
        }
      : doc
  );

  dispatch(
    updateFormData({
      documents: updated,
    })
  );
};

  const addDocument = () => {
  dispatch(
    updateFormData({
      documents: [
        ...form.documents,
        {
          name: "",
          file: null,
          preview: null,
        },
      ],
    })
  );
};

  const removeDocument = (index) => {
  const updated = form.documents.filter(
    (_, i) => i !== index
  );

  dispatch(
    updateFormData({
      documents: updated,
    })
  );
};

{/**function that allows the user to navigate between the form pages */}
      const next = () => {
      dispatch(
        setCurrentStep(
          Math.min(step + 1, steps.length - 1)
        )
      );
    };

    const back = () => {
      dispatch(
        setCurrentStep(
          Math.max(step - 1, 0)
        )
      );
    };

  {/**fuctionality for uploading image to the cloud */}
      const handleFileUpload = async (index, e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const imageData = new FormData();

    // MUST match multer field name
    imageData.append("file", file);

    const res = await upload(imageData).unwrap();

    const updated = form.documents.map((doc, i) =>
  i === index
    ? {
        ...doc,
        file: res.url,
        r2Key: res.key,
        preview: URL.createObjectURL(file),
        fileName: file.name,
        fileType: file.type,
      }
    : doc
);

    dispatch(
      updateFormData({
        documents: updated,
      })
    );

  } catch (error) {
    console.log(error);
  }
};
    {/**fuctionality fro creating application */}

    const submit = async (e) => {
    e.preventDefault();
      
  if(!validateDocuments()) return
    const cleanedForm = {
    ...form,
    Age: Number(form.Age),
    totalFees: Number(form.totalFees),
    feeBalance: Number(form.feeBalance),
  };
  try {
    const res = await apply(cleanedForm).unwrap();

    console.log(res);

    alert("Application submitted successfully");

    dispatch(resetApplicationForm());

  } catch (error) {
    console.log(error);

    alert(
      error?.data?.message ||
      "Application submission failed"
    );
  }
};
   const documentOptions = [
  "Birth Certificate / National ID",
  "Applicant ID Card",
  "Voter's Card",
  "Academic Transcript",
  "Burial Certificate / Burial Permit",
  "Fee Balance Receipt",
  "Sibling Birth Certificate / ID",
  "Parent/Guardian ID Card",
  "Parent/Guardian Voter's Card",
  "Death Certificate",
  "School Fee Receipt",
  "Fee Structure",
  "KCSE Result Slip",
  "Admission Letter",
  "Chief Letter",
  "Church Letter",
  "Applicant Letter",
];
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Bursary Application</h1>
          <p className="text-sm text-gray-500 text-center">
            Step {step + 1} of {steps.length} — {steps[step]}
          </p>
          <p className="text-center font-semibold text-red-500">Before you submit your application,recheck if you have selected the correct type 
            .Not every applicant is eligible for scholarship</p>
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
        <form className="space-y-6">

          {/* STEP 1 */}
    {step === 0 && (
  <div className="grid md:grid-cols-2 gap-4">

    {/* FULL NAME */}
    <input
      name="fullName"
      placeholder="Full Name"
      onChange={handleChange}
      value={form.fullName}
      className="input"
    />

    {/* GENDER */}
    <select
      name="gender"
      onChange={handleChange}
      value={form.gender}
      className="input"
    >
      <option value="">Gender</option>
      <option>Male</option>
      <option>Female</option>
      <option>Others</option>
    </select>

    {/* BURSARY TYPE (NEW) */}
    <select
      name="burSaryType"
      onChange={handleChange}
      className="input"
      value={form.burSaryType}
      required
    >
      <option value="">Select Bursary Type</option>
      <option value="scholarship">Scholarship</option>
      <option value="bursary">Bursary</option>
    </select>

    {/* PHONE NUMBER */}
    <input
      name="phoneNumber"
      placeholder="Phone Number"
      onChange={handleChange}
      value={form.phoneNumber}
      className="input"
    />

    {/* ID NUMBER */}
    <input
      name="idNo"
      placeholder="ID Number(Leave if you dont have ID)"
      onChange={handleChange}
      value={form.idNo}
      className="input"
    />

    {/* BIRTH CERTIFICATE NUMBER (NEW) */}
    <input
      name="birthCertNo"
      placeholder="Birth Certificate Number(Leave if you have ID)"
      onChange={handleChange}
      value={form.birthCertNo}
      className="input"
    />

    {/* AGE */}
    <input
      name="Age"
      placeholder="Age"
      type="number"
      onChange={handleChange}
      value={form.Age}
      className="input"
    />

      {/*Disability input */}
      <div className="flex items-center gap-2">
        <input
        type="checkbox"
        name="hasDisability"
        checked={form.hasDisability}
        onChange={handleChange}
        className="w-5 h-5"
      />
      <label >Do you have any Disability</label>
      </div>
      {
        form.hasDisability &&(
         <input
         placeholder="Disability Type"
         name="disabilityType"
         type="text"
         value={form.disabilityType}
          onChange={handleChange}
          className="p-3 border rounded font-semibold"
         />
        )
      }

  </div>
)}
          {/* STEP 2 */}
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <input name="ward"
               placeholder="Ward"
               onChange={handleChange} 
               value={form.ward}
              className="input" />

              <input name="location" 
              placeholder="Location"
              value={form.location}
               onChange={handleChange}
                className="input" />

              <input name="subLocation"
               placeholder="Sub Location"
                onChange={handleChange} 
                value={form.subLocation}
                className="input" />

              <input name="village" 
              placeholder="Village"
              value={form.village}
               onChange={handleChange}
                className="input" />
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="grid md:grid-cols-2 gap-4">
              <input name="institutionName"
               placeholder="Institution Name" 
               value={form.institutionName}
               className="input" 
               onChange={handleChange} />

              <select name="levelOfStudy"
              value={form.levelOfStudy}
               className="input" 
              onChange={handleChange}>
                <option value="">Level of Study</option>
                <option>Secondary</option>
                <option>College</option>
                <option>University</option>
              </select>

              <input name="admissionNo"
               placeholder="Admission Number"
                className="input"
                value={form.admissionNo}
                 onChange={handleChange} />

              <input name="class"
               placeholder="Class / Course" 
               className="input" 
               value={form.class}
               onChange={handleChange} />

              <input name="yearOfStudy" 
              placeholder="Year of Study" 
              value={form.yearOfStudy}
              className="input"
               onChange={handleChange} />

                <input name="totalFees" 
                placeholder="Total Fees" 
                type="number"
                className="input"
                value={form.totalFees}
                onChange={handleChange} />

              <input name="feeBalance"
               placeholder="Fee Balance"
                type="number" 
                className="input"
                value={form.feeBalance}
                 onChange={handleChange} />
            </div>
          )}

          {/* STEP 4 */}
          
{step === 3 && (
  <div className="grid md:grid-cols-2 gap-4">

    {/* Parents */}
    <input
      name="fatherName"
      placeholder="Father Name"
      type="text"
      value={form.fatherName}
      className="input"
      onChange={handleChange}
    />

    <input
      name="fatherPhone"
      placeholder="Father Phone Number"
      type="text"
      value={form.fatherPhone}
      className="input"
      onChange={handleChange}
    />

    <input
      name="motherName"
      placeholder="Mother Name"
      type="text"
      value={form.motherName}
      className="input"
      onChange={handleChange}
    />

    <input
      name="motherPhone"
      type="text"
      value={form.motherPhone}
      placeholder="Mother Phone Number"
      className="input"
      onChange={handleChange}
    />

    {/* Parenthood Status */}
    <select
      name="parenthoodStatus"
      className="input"
      value={form.parenthoodStatus||""}
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
        checked={form.hasSponsor}
        onChange={handleChange}
      />
      <label>Has Sponsor</label>
    </div>

    {form.hasSponsor && (
      <input
        name="sponsorName"
        type="text"
        value={form.sponsorName}
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
          type="text"
          value={form.guardianName}
          className="input"
          onChange={handleChange}
        />

        <input
          name="guardianRelationship"
          type="text"
          value={form.guardianRelationship}
          placeholder="Relationship with Guardian (e.g Uncle, Aunt)"
          className="input"
          onChange={handleChange}
        />

        <input
          name="guardianPhone"
          placeholder="Guardian Phone Number"
          type="text"
          value={form.guardianPhone}
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
  <div className="flex justify-end">
      <button
        type="button"
        onClick={addSibling}
        className="bg-blue-600 text-white  px-3 py-1 rounded-lg"
      >
        + Add Sibling
      </button>
  </div>

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
        Accepted formats include PDF, JPG, PNG and JPEG.
      </p>

      <p className="text-blue-600 mt-2">
        Select the document type, then upload a clear photo or scanned copy.
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
          Birth Certificate / National ID Photo (Mandatory)
        </li>

        {Number(form.Age) >= 18 && (
          <li>
            Photo of Applicant ID Card and Voter's Card
          </li>
        )}

        <li>
          Latest Report Form / Academic Transcript
          <span className="text-red-500">
            {" "} (Must be institution stamped)
          </span>
        </li>

        <li>
          Photo of Burial Certificate / Burial Permit
        </li>

        <li>
          Latest Payment Receipt showing Fee Balance
        </li>

        <li>
          Photo of listed siblings birth certificate or ID card
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

        <li>
          A letter from the chief, church and from the applicant
          <span className="text-red-400">
            {" "} (Only for scholarship applicants)
          </span>
        </li>

      </ul>
    </div>

    
    {/* DOCUMENT INPUTS */}
    <div className="space-y-5">

      {form.documents?.map((doc, index) => {

        const selectedDocuments = form.documents.map((d) => d.name);

        return (
          <div
            key={index}
            className="border border-slate-200 rounded-2xl p-5 bg-slate-50"
          >

            {/* TOP ROW */}
            <div className="flex flex-col md:flex-row gap-3 items-center">

              {/* DOCUMENT NAME */}
              <select
                value={doc.name}
                onChange={(e) =>
                  handleDocumentChange(
                    index,
                    "name",
                    e.target.value
                  )
                }
                className="input flex-1"
              >
                <option value="">
                  Select document type
                </option>

                {documentOptions.map((option, i) => (
                  <option
                    key={i}
                    value={option}
                    disabled={
                      selectedDocuments.includes(option) &&
                      doc.name !== option
                    }
                  >
                    {option}
                  </option>
                ))}
              </select>

              {/* FILE INPUT */}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {

                  if (!doc.name) {
                    alert("Please select document type first");
                    return;
                  }

                  handleFileUpload(index, e);
                }}
                className="input flex-1"
              />

              {/* ADD BUTTON */}
              {index === form.documents.length - 1 && (
                <button
                  type="button"
                  onClick={() => {

                    if (!doc.name) {
                      alert("Please select document type");
                      return;
                    }

                    if (!doc.file) {
                      alert("Please upload file first");
                      return;
                    }

                    addDocument();
                  }}
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
                  Selected File: {doc.fileName}
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
        );
      })}

    </div>

  </div>
)}
         {/* STEP 7- DOCUMENT REVIEW */}
{step === 6 && (
  <div className="space-y-8">

    <div>
      <h2 className="text-2xl font-bold text-slate-800">
        Review Uploaded Documents
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Confirm that all uploaded documents are correct before submitting.
      </p>
    </div>

    {/* DOCUMENT GRID */}
    <div className="grid md:grid-cols-2 gap-5">

      {form.documents.map((doc, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 bg-white shadow-sm"
        >

          {/* DOCUMENT NAME */}
          <p className="font-semibold text-slate-700 mb-2">
            {doc.name || "Unnamed Document"}
          </p>

          {/* IMAGE PREVIEW */}
              {doc.file ? (
  doc.fileType?.startsWith("image/") ? (
    <img
      src={doc.preview}
      alt={doc.name}
      className="w-full h-40 object-cover rounded-lg border"
    />
  ) : (
    <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg border">
      <p className="text-sm text-gray-600">
        {doc.fileName}
      </p>
    </div>
  )
) : (
  <div className="w-full h-40 flex items-center justify-center bg-red-50 rounded-lg border">
    <p className="text-sm text-red-500">
      No file uploaded
    </p>
  </div>
)}
                  </div>
                ))}

              </div>
            </div>
          )}
          {/* BUTTONS */}
          <div className="flex justify-center gap-12 pt-6">
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
              <button type="button" onClick={submit} className="btn-primary">
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