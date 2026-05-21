
import Applications from "../models/applicationSchema.js";
import expressAsyncHandler from "express-async-handler";

//..@description---------------------------------------create submit applicant
//..@api------------------------------------------------POST/api/user
//..@access--------------------------------------------public

 const createApplication = expressAsyncHandler(async (req, res) => {
  try {
    const {
      burSaryType,
      ward,
      location,
      subLocation,
      village,

      fullName,
      gender,
      phoneNumber,
      idNo,
      birthCertNo,
      Age,

      fatherName,
      motherName,
      guardianName,
      guardianRelationship,
      guardianPhone,

      institutionName,
      levelOfStudy,
      class: studentClass,
      yearOfStudy,
      admissionNo,
      totalFees,
      feeBalance,

      disability,
      sponsorship,
      siblings,
      parenthoodStatus,

      documents,
    } = req.body;

    // ================= BASIC VALIDATION =================
    if (!burSaryType) throw new Error("Bursary type required");
    if (!ward) throw new Error("Ward required");
    if (!fullName) throw new Error("Full name required");
    if (!gender) throw new Error("Gender required");
    if (!institutionName) throw new Error("Institution name required");
    if (!levelOfStudy) throw new Error("Level of study required");
    if (!admissionNo) throw new Error("Admission number required");

    if (totalFees == null) throw new Error("Total fees required");
    if (feeBalance == null) throw new Error("Fee balance required");
    if (Age == null) throw new Error("Age is required");

    // ================= PHONE VALIDATION =================
    const phoneRegex = /^(07|01|2547|2541)\d{8}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      throw new Error("Invalid phone number");
    }

    // ================= FEES VALIDATION =================
    if (totalFees < 0 || feeBalance < 0) {
      throw new Error("Fees cannot be negative");
    }

    if (Number(feeBalance) > Number(totalFees)) {
      throw new Error("Fee balance cannot exceed total fees");
    }

    // ================= AGE + DOCUMENT VALIDATION =================
    const birthCertificate = documents?.find(
      (doc) => doc.name === "birthCertificate"
    );

    const idCopy = documents?.find((doc) => doc.name === "idCopy");

    if (Age < 18) {
      if (!birthCertificate?.file) {
        throw new Error("Applicants under 18 must provide birth certificate");
      }
    } else {
      if (!birthCertificate?.file && !idNo && !idCopy?.file) {
        throw new Error(
          "Applicants 18+ must provide ID number or birth certificate"
        );
      }
    }

    // ================= LEVEL VALIDATION =================
    if (levelOfStudy === "Secondary" && !studentClass) {
      throw new Error("Secondary students must provide class");
    }

    if (
      (levelOfStudy === "University" || levelOfStudy === "College") &&
      !yearOfStudy
    ) {
      throw new Error(
        "University/College students must provide year of study"
      );
    }

    // ================= GUARDIAN VALIDATION =================
    if (!fatherName && !motherName && !guardianName) {
      throw new Error("Provide at least one parent or guardian information");
    }

    // ================= DUPLICATE CHECK =================
    const existing = await Applications.findOne({
      admissionNo,
      institutionName,
    });

    if (existing) {
      return res.status(400).json({
        message: "Application already exists for this student",
      });
    }

    // ================= CREATE APPLICATION =================
    const application = await Applications.create({
      burSaryType,
      ward,
      location,
      subLocation,
      village,

      fullName,
      gender,
      phoneNumber,
      idNo,
      birthCertNo,
      Age,

      fatherName,
      motherName,
      guardianName,
      guardianRelationship,
      guardianPhone,

      institutionName,
      levelOfStudy,
      class: studentClass,
      yearOfStudy,
      admissionNo,
      totalFees,
      feeBalance,

      // IMPORTANT FIX (match schema)
      disability: {
        hasDisability: disability?.hasDisability || false,
        disabilityType: disability?.disabilityType || "",
      },

      sponsorship: {
        hasSponsor: sponsorship?.hasSponsor || false,
        sponsorName: sponsorship?.sponsorName || "",
      },

      siblings: siblings || [],

      parenthoodStatus,

      documents: documents || [],
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating application",
      error: error.message,
    });
  }
});
//..@description--------------------------------------------get the all applicants or through filter
//..@api-----------------------------------------------------GET/api/user/allusers
//..@access--------------------------------------------------private
const getApplicants = expressAsyncHandler(async (req, res) => {
  const {
    status,
    ward,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 20
  } = req.query;
  let filter = {};

  // Filters
  if (status && status !== "All") {
    filter.status = status;
  }
  if (ward && ward !== "All") {
    filter.ward = ward;
  }

  // Search
  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i"
        }
      },
      {
        email: {
          $regex: search,
          $options: "i"
        }
      }
    ];
  }

  // Pagination
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(
    100,
    Math.max(1, Number(limit))
  );
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  const sort = {
    [sortBy]: sortOrder === "asc" ? 1 : -1
  };

  // Database Queries
  const [applicants, total] = await Promise.all([
    Applications.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Applications.countDocuments(filter)
  ]);

  // Response
  res.status(200).json({
    success: true,
    data: applicants,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage:
      pageNum < Math.ceil(total / limitNum),
      hasPrevPage:
       pageNum > 1
    }
  });

});
//..@description-----------------------------------------get a single applicant
//..api--------------------------------------------------GET/api/user/:id
//..@access-----------------------------------------------private
const getApllicant=expressAsyncHandler(async(req,res)=>{
  const {id}=req.params
  const applicant=await Applications.findById(id)
  if(!applicant){
    res.status(404)
    throw new Error("Applicant not found")
  }
  res.status(200).json(
    applicant
  )
})
//..@description----------------------------------update the applicant status
//..@api---------------------------------------------PUT/api/users/status/:id
//..access----------------------------------------------private
const updateApplicantsStatus=expressAsyncHandler(async(req,res)=>{
  const{id}=req.params
  const {status}=req.body

  const allowedStatus=["Pending","Accepted","Rejected"]
  if(!allowedStatus.includes(status)){
    res.status(400)
    throw new Error("Invalid status value")
  }
  const applicant=await Applications.findById(id)
  if(!applicant){
    res.status(404)
    throw new Error("Applicant Unavailable");
  }
  applicant.status=status

  await applicant.save()
  res.status(200).json(applicant)
})

export {createApplication,getApplicants,getApllicant,updateApplicantsStatus}