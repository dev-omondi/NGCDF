import { useState } from "react";
import {
  useApplicantsQuery,
  useUpdateRoleMutation,
} from "@/applicationRedux/baseAppslice";

import {
  CheckCircle,
  XCircle,
  FileText,
  X,
  Eye,
} from "lucide-react";

const ApplicantReviewPage = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [remarks, setRemarks] = useState("");

  const { data, isLoading, isError } = useApplicantsQuery({
    status: "pending",
    page: 1,
    limit: 1,
  });
 
  const [updateApplicant, { isLoading: updating }] =
    useUpdateRoleMutation();

    if (isLoading) return <p> Loading..................</p>
 if(isError)  return <p>Error Laoding Applicant</p>

  const applicant = data?.data?.[0];
 console.log(applicant)
  const handleUpdate = async (newStatus) => {
    if (!applicant) return;

    await updateApplicant({
      id: applicant._id,
      data: {
        status: newStatus,
        remarks,
      },
    }).unwrap();
  };

  const documents = applicant?.documents || [];
  const siblings = applicant?.siblings || [];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
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

        {isLoading && (
          <div className="bg-white p-6 border rounded-xl">
            Loading applicant...
          </div>
        )}

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
                Applicant Details/Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p><b>Name:</b> {applicant.fullName}</p>
                <p><b>Phone:</b> {applicant.phoneNumber}</p>
                <p><b>Institution Name:</b> {applicant.institutionName}</p>
                <p><b>Year of Study/Grade:</b> {applicant.yearOfStudy}</p>
                <p><b>Level of Study:</b> {applicant.levelOfStudy}</p>
                <p><b>Admision Number:</b> {applicant.admissionNo}</p>
                <p><b>Course Take By Student:</b> {applicant.class}</p>
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
                <p><b>Mothers Name:</b> {applicant.motherName}</p>
                <p><b>Mothers Contact:</b> {applicant.motherPhone}</p>
                <p><b>Guardian Name:</b> {applicant.guardianName}</p>
                <p><b>Guardian Conatc:</b> {applicant.guardianPhone}</p>
                <p><b>Relationship Of Student With Guardian:</b> {applicant.guardianRelationship}</p>
              </div>
            </div>


            {/* ================= DISABILITY ================= */}
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
              <h2 className="font-bold mb-3">Siblings</h2>

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
                  </div>
                ))
              )}
            </div>

            {/* ================= DOCUMENTS ================= */}
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-bold mb-3">Documents</h2>

              {documents.length === 0 ? (
                <p className="text-slate-400">No documents uploaded</p>
              ) : (
                documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border p-3 rounded-lg mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span className="truncate max-w-[200px]">
                        {doc.name}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="text-blue-600 flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* ================= EVALUATION ================= */}
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-bold mb-3">Evaluation</h2>

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
                  onClick={() => handleUpdate("approved")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>

                <button
                  disabled={updating}
                  onClick={() => handleUpdate("rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================= FIXED DOCUMENT MODAL ================= */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center p-3 border-b bg-slate-50">
              <h3 className="font-semibold truncate">
                {selectedDoc.name}
              </h3>

              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 hover:bg-slate-200 rounded-lg"
              >
                <X />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 flex justify-center bg-slate-100">

              {selectedDoc.file?.includes("image") ? (
                <img
                  src={selectedDoc.file}
                  alt="document"
                  className="max-h-[75vh] object-contain rounded-lg"
                />
              ) : (
                <iframe
                  src={selectedDoc.file}
                  className="w-full h-[75vh] rounded-lg"
                  title="document"
                />
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantReviewPage;