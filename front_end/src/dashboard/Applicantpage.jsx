import { useState } from "react";
import {
  useApplicantQuery,
  useUpdateStatusMutation,
} from "@/applicationRedux/baseAppslice";

import {
  CheckCircle,
  XCircle,
  FileText,
  X,
  Eye,
} from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
 const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
      );
    };


const ApplicantReviewPage = () => {
  const navigate=useNavigate()
  const {id}=useParams()

  const [remarks, setRemarks] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);


  const { data, isLoading, isError } = useApplicantQuery(id);
 
  const [updateApplicant, { isLoading: updating }] =
    useUpdateStatusMutation();

if (isLoading) {
  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-4">
      
      {/* Header skeleton */}
      <div className="bg-white p-5 rounded-xl border flex justify-between items-center">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      {/* Card skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-6 rounded-xl border space-y-3">
          <Skeleton className="h-5 w-40" />
          <div className="grid md:grid-cols-2 gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
  const applicant = data;

  const handleUpdate = async (newStatus) => {
    if (!applicant) return;
    if(!remarks||remarks.trim()===""){
      toast.error("Please add remarks before updating status")
      return
    }
    try {
      await updateApplicant({
      id,
      data: {
        status: newStatus,
        remarks,
      },
    }).unwrap();
    toast.success("User remarks or status updated successfully")
    } catch (err) {
      toast.error(err?.data?.message)
    }
  };

  
  const documents = applicant?.documents || [];
  const siblings = applicant?.siblings || [];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-5 flex justify-between items-center">
            <button
              onClick={() => navigate("/applicants/dashboard")}
              className="px-4 py-2 rounded-lg bg-green-400 hover:bg-green-600 text-white text-sm"
            >
              ← Back to Applicants
            </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              Applicant Review
            </h1>
            <p className="text-sm text-slate-500">
              Evaluate applicant details and documents
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
            {applicant?.status || "pending"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-5 space-y-6">
        {isError && (
          <div className="bg-red-50 text-red-600 p-6 border rounded-xl">
            Failed to load applicant
          </div>
        )}

        {!isLoading && applicant && (
          <>
            {/* ================= PERSONAL INFO ================= */}
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                  Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p className="capitalize"><b>Bursary Category:</b> {applicant.burSaryType}</p>
                <p className="capitalize"><b>Ward:</b> {applicant.ward}</p>
                <p className="capitalize"><b>Location:</b> {applicant.location}</p>
                <p className="capitalize"><b>Sublocation:</b> {applicant.subLocation}</p>
                <p className="capitalize"><b>Village:</b> {applicant.village}</p>
                <p><b>Last Updated:</b>{" "}
                  {new Date(applicant.updatedAt).toLocaleString("en-KE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/** Student Details/Information*/}
             <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                  Particulars Of The Student 
              </h2>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p><b>Name:</b> {applicant.fullName}</p>
                <p><b>Phone:</b> {applicant.phoneNumber}</p>
                <p><b>Institution Name:</b> {applicant.institutionName}</p>
                <p><b>Year of Study/Grade:</b> {applicant.yearOfStudy}</p>
                <p><b>Level of Study:</b> {applicant.levelOfStudy}</p>
                <p><b>Admision Number:</b> {applicant.admissionNo}</p>
                <p><b>Course Take By Student:</b> {applicant.class}</p>
                <p><b>Institution Branch:</b>{applicant.institutionBranch}</p>
                <p><b>Toatl Fees:</b>{""} KES { Number( applicant.totalFees).toLocaleString()}</p>
                <p><b>Fee Balance:</b>{""}KES {Number( applicant.feeBalance).toLocaleString()}</p>
              </div>
            </div>

             {/** Family Deatail*/}
             <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                Applicant family details
              </h2>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p><b>Parenthood Satus Of Student:</b> {applicant.parenthoodStatus}</p>
                <p><b>Fathers Name:</b> {applicant.fatherName}</p>
                <p><b>Fathers Contact:</b> {applicant.fatherPhone}</p>
                <p><b>Father's Occupation:</b>{applicant.fathersOccupation}</p>
                <p><b>Mothers Name:</b> {applicant.motherName}</p>
                <p><b>Mothers Contact:</b> {applicant.motherPhone}</p>
                <p><b>Mother's Occupation:</b>{applicant.mothersOccupation}</p>
                <p><b>Guardian Name:</b> {applicant.guardianName}</p>
                <p><b>Guardian's Occupation:</b>{applicant.guardiansOccupation}</p>
                <p><b>Guardian Conatc:</b> {applicant.guardianPhone}</p>
                <p><b>Relationship Of Student With Guardian:</b> {applicant.guardianRelationship}</p>
              </div>
            </div>


            {/* DISABILITY */}
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-bold mb-3">Disability</h2>

              <p>
                <b>Has Disability:</b>{" "}
                {applicant?.disability?.hasDisability ? "Yes" : "No"}
              </p>

              {applicant?.disability?.hasDisability && (
                <p>
                  <b>Type:</b> {applicant?.disability?.disabilityType}
                </p>
              )}
            </div>

            {/* ================= SPONSORSHIP ================= */}
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-bold mb-3">Sponsorship</h2>

              <p>
                <b>Has Sponsor:</b>{" "}
                {applicant?.sponsorship?.hasSponsor ? "Yes" : "No"}
              </p>

              {applicant?.sponsorship?.hasSponsor && (
                <p>
                  <b>Name:</b> {applicant?.sponsorship?.sponsorName}
                </p>
              )}
            </div>

            {/* ================= SIBLINGS ================= */}
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-bold mb-3">Proof Of Burden(List of siblings in Highscol,University &Colleges)</h2>

              {siblings.length === 0 ? (
                <p className="text-slate-400">No siblings added</p>
              ) : (
                siblings.map((s, i) => (
                  <div
                    key={i}
                    className="border p-4 rounded-lg mb-3 bg-slate-50"
                  >
                    <p><b>Name:</b> {s.name}</p>
                    <p><b>Institution:</b> {s.institution}</p>
                    <p><b>Level:</b> {s.level}</p>
                    <p><b>Year:</b> {s.yearOfStudy}</p>
                      <p>
                  <b>Is Sibling Sponsered:</b>{" "}
                    {s?.hasBeneficiarySibling? "Yes" : "No"}
                  </p>
                  </div>
                ))
              )}
            </div>

            {/* ================= DOCUMENTS ================= */}
              {/* ================= DOCUMENTS ================= */}
<div className="bg-white border rounded-xl p-6">
  <h2 className="text-xl font-bold mb-5">
    Uploaded Documents
  </h2>

        {documents.length === 0 ? (
          <p className="text-slate-400">
            No documents uploaded
          </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(doc)}
                    className="border rounded-xl p-5 bg-slate-50 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="text-blue-600" />
                      <h3 className="font-semibold text-slate-800">
                        {doc.name}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-500">
                      {doc.files?.length || 0} file(s)
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

            {/* ================= EVALUATION ================= */}
            <div className="bg-white border rounded-xl p-6">
              <div className="flex flex-col items-center">
                <h2 className="font-bold mb-3 ">Evaluation</h2>
                <p className="text-blue-500 font-semibold">Kindy Add remarks before updating the applicant status <span className="text-red-500">(Approving or Rejecting)
                  </span> for clarity</p>
              </div>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border p-3 rounded-lg"
                rows={4}
                placeholder="Write remarks..."
              />

              <div className="flex justify-center gap-3 mt-4">
                              <button
                  disabled={updating}
                  onClick={() => handleUpdate("Approved")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white ${
                    updating
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <CheckCircle size={16} />
                  {updating ? "Approving..." : "Approve"}
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleUpdate("Rejected")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white ${
                    updating
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  <XCircle size={16} />

                  {updating ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {selectedCategory && (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-bold text-lg">
          {selectedCategory.name}
        </h3>

        <button
          onClick={() => setSelectedCategory(null)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* Files */}
      <div className="p-5 overflow-y-auto max-h-[75vh]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

          {selectedCategory.files?.map((file, i) => (
            <div
              key={i}
              onClick={() => setSelectedFile(file)}
              className="cursor-pointer border rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={file}
                    alt=""
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-3 flex justify-center">
                    <Eye size={18} />
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    )}
    {selectedFile && (
  <div className="fixed inset-0 z-[60] bg-black/95">

    {/* Header */}
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 bg-black/80 backdrop-blur border-b border-white/10">

      <div>
        <h3 className="text-white font-semibold text-sm md:text-base">
          Document Preview
        </h3>
        <p className="text-slate-400 text-xs md:text-sm">
          Scroll to inspect the document
        </p>
      </div>

      <button
        onClick={() => setSelectedFile(null)}
        className="
          h-10 w-10
          flex items-center justify-center
          rounded-full
          bg-white
          hover:bg-slate-200
          transition
        "
      >
        <X size={22} />
      </button>

    </div>

    {/* Scrollable Content */}
    <div
      className="
        h-[calc(100vh-72px)]
        overflow-y-auto
        overflow-x-hidden
        px-2 md:px-6 py-4
      "
    >
      <div className="flex justify-center">

        <img
          src={selectedFile}
          alt="Document"
          className="
            w-full
            max-w-7xl
            h-auto
            rounded-xl
            bg-white
            shadow-2xl
          "
        />
          </div>
        </div>

      </div>
    )}
          
    </div>
  );
};

export default ApplicantReviewPage;