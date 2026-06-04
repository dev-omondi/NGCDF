
import { useState } from "react";
import { updateFormData,resetApplicationForm,setCurrentStep } from "@/applicationRedux/applicationSlice";
import { useDispatch,useSelector } from "react-redux";
import { useApplyMutation } from "@/applicationRedux/baseAppslice";
import { useUploadsMutation ,useDeleteImageMutation} from "@/imageRedux/imageBase";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import toast from "react-hot-toast";
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
  const [previewModal, setPreviewModal] = useState({
  open: false,
  image: "",
  docIndex: null,
  fileIndex: null,
  fileName: "",
});

const openPreview = (
  image,
  docIndex,
  fileIndex,
  fileName
) => {
  setPreviewModal({
    open: true,
    image,
    docIndex,
    fileIndex,
    fileName,
  });
};
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {formData:form,currentStep:step}=useSelector((state)=>state.application)

  const[apply,{isLoading}]=useApplyMutation()
  const [uploads,{isLoading:uploadLoading}]=useUploadsMutation()
  const [deleteImage] = useDeleteImageMutation();

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
      toast.error(`Select document type for document ${i + 1}`);
      return false;
    }
    if (!doc.files || doc.files.length === 0) {
      toast.error(`Upload files for ${doc.name}`);
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
              files: [],
              previews: [],
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
  const selectedFiles = Array.from(e.target.files);
  if (!selectedFiles.length) return;
  try {
    const formData = new FormData();
    // append multiple files
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    const res = await uploads(formData).unwrap(); 

    // res should return array of URLs
    const updated = form.documents.map((doc, i) =>
        i === index
          ? {
              ...doc,

        // store uploaded cloud urls
        files: [
          ...(doc.files || []),
          ...res.files.map((f) => f.url),
        ],

        // optional keys from backend
        fileKeys: [
          ...(doc.fileKeys || []),
          ...res.files.map((f) => f.key),
        ],

        // local preview urls
        previews: [
          ...(doc.previews || []),
          ...selectedFiles.map((f) =>
            URL.createObjectURL(f)
          ),
        ],

        // file names
        fileNames: [
          ...(doc.fileNames || []),
          ...selectedFiles.map((f) => f.name),
        ],

        // file mime types
        fileTypes: [
          ...(doc.fileTypes || []),
          ...selectedFiles.map((f) => f.type),
        ],
              }
            : doc
        );

            dispatch(updateFormData({ documents: updated }));

  } catch (error) {
    toast.error(error?.data?.message||"Error while uploading file");
  }
};

// functionality for deleting images
  const handleDeleteFile = async (docIndex, fileIndex) => {
  try {
    const doc = form.documents[docIndex];
    const key = doc.fileKeys[fileIndex];

    if (!key) return;

    // delete from cloud
    await deleteImage(key).unwrap();

    // update state
    const updatedDocuments = form.documents.map((d, i) => {
      if (i !== docIndex) return d;

      return {
        ...d,
        files: d.files.filter((_, idx) => idx !== fileIndex),
        fileKeys: d.fileKeys.filter((_, idx) => idx !== fileIndex),
        previews: d.previews.filter((_, idx) => idx !== fileIndex),
        fileNames: d.fileNames.filter((_, idx) => idx !== fileIndex),
        fileTypes: d.fileTypes.filter((_, idx) => idx !== fileIndex),
      };
    });

    dispatch(updateFormData({ documents: updatedDocuments }));

    //  CLOSE PREVIEW MODAL AFTER DELETE
    setPreviewModal({
      open: false,
      image: null,
      docIndex: null,
      fileIndex: null,
      fileName: null,
    });

  } catch (error) {
    
    toast.error("Failed to delete image");
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

    toast.success("Application submitted successfully");

    dispatch(resetApplicationForm());

  } catch (error) {
    console.log(error);

    toast.error(
      error?.data?.message ||
      "Application submission failed"
    );
  }
};
   const documentOptions = [
  "Birth Certificate ",
  " National ID",
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
              <select
                  name="ward"
                  value={form.ward}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Ward</option>
                  <option value="Muhoroni-Koru">MUHORONI/KORU</option>
                  <option value="Chemelil-Tamu">CHEMELIL/TAMU</option>
                  <option value="Ombeyi">OMBEYI</option>
                  <option value="Masogo-Nyangoma">MASOGO/NYANGOMA</option>
                  <option value="Miwani">MIWANI</option>
                </select>
                
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

                 <input type="text"
                 name="institutionBranch"
                 placeholder="Institution Branch(for universities and Colleges)"
                 className="input"
                 value={form.institutionBranch}
                 onChange={handleChange}
                  />

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

                <NumericFormat
                thousandSeparator
                allowNegative={false}
                prefix="KES "
                name="totalFees"
                placeholder="Total Fees"
                className="input"
                value={form.totalFees}
                onValueChange={(values) => {
                  dispatch(
                    updateFormData({
                      totalFees: values.value, 
                    })
                  );
                }}
              />

             <NumericFormat
              thousandSeparator
              allowNegative={false}
              prefix="KES "
              name="feeBalance"
              placeholder="Fee Balance"
              className="input"
              value={form.feeBalance}
              onValueChange={(values) => {
                dispatch(
                  updateFormData({
                    feeBalance: values.value,
                  })
                );
              }}
            />
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

    <input type="text"
    name="fathersOccupation"
    placeholder="Your fathers Occupation"
    value={form.fathersOccupation}
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

    <input type="text"
    name="mothersOccupation"
    value={form.mothersOccupation}
    placeholder="Your Mothers Occupation"
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

    
      <>
        <input
          name="guardianName"
          placeholder="Guardian Name(If you dont leave with parents)"
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
            <section className="flex flex-col">
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
                multiple
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

                   if (!doc.files || doc.files.length === 0) {
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
            <div className="mt-3">
                    <p
                      className={`text-sm ${
                        doc.files?.length > 0 ? "text-green-600" : "text-slate-500"
                      }`}
                    >
                      {doc.files?.length > 0
                        ? `${doc.files.length} ${
                            doc.files.length === 1 ? "file" : "files"
                          } selected`
                        : "No file selected"}
                    </p>
                  </div>
          </section>


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

      {form.documents.map((doc,index) => (
        <div
          key={index}
          className="border rounded-xl p-4 bg-white shadow-sm"
        >

          {/* DOCUMENT NAME */}
          <p className="font-semibold text-slate-700 mb-2">
            {doc.name || "Unnamed Document"}
          </p>

          {/* IMAGE PREVIEW */}
     {doc.files?.length > 0 ? (
  <div className="mt-3 space-y-3">

    {/* HEADER */}
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-700">
        Uploaded Files ({doc.files.length})
      </p>

      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
        Uploaded
      </span>
    </div>

    {/* FILE GRID */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {doc.files.map((file, i) => (
        <div
  key={i}
  onClick={() =>
    openPreview(
      doc.previews[i],
      index,
      i,
      doc.fileNames?.[i]
    )
  }
  className="relative group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition cursor-pointer"
>
{/* IMAGE */}
  {doc.fileTypes?.[i]?.includes("image") ? (
    <img
      src={doc.previews[i]}
      className="w-full h-32 object-cover group-hover:scale-105 transition duration-300"
    />
  ) : (
    <div className="h-32 flex items-center justify-center bg-slate-100">
      <p className="text-sm text-slate-500">
        PDF Document
      </p>
    </div>
  )}
     {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

  {/* FILE NAME */}
  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[11px] px-2 py-2 truncate">
    {doc.fileNames?.[i]}
  </div>

</div>
      ))}
    </div>
  </div>
) : (
  <div className="mt-3 p-4 border border-dashed rounded-xl text-center text-sm text-red-500 bg-red-50">
    No files uploaded for this document
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
      {previewModal.open && (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

    <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="font-bold text-slate-800 text-lg">
            Document Preview
          </h2>
           <p className="text-sm text-slate-500 truncate max-w-[250px] md:max-w-[500px]">
            {previewModal.fileName}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setPreviewModal({
              open: false,
              image: "",
              docIndex: null,
              fileIndex: null,
              fileName: "",
            })
          }
          className="text-slate-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>
      </div>
      {/* IMAGE */}
      <div className="bg-slate-100 flex items-center justify-center p-6 max-h-[75vh] overflow-auto">
        <img
          src={previewModal.image}
          className="max-h-[70vh] w-auto rounded-2xl shadow-lg"
        />
      </div>
       {/* FOOTER */}
      <div className="flex items-center justify-end gap-3 border-t px-6 py-4 bg-white">
        <button
          type="button"
          onClick={() =>
            setPreviewModal({
              open: false,
              image: "",
              docIndex: null,
              fileIndex: null,
              fileName: "",
            })
             }
          className="px-5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() =>
            handleDeleteFile(
              previewModal.docIndex,
                      previewModal.fileIndex
                    )
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
                > Delete Image
                </button>
              </div>
            </div>
          </div>
        )}
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