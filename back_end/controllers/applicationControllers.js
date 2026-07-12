
import Applications from "../models/applicationSchema.js";
import expressAsyncHandler from "express-async-handler";
import Applicationcycle from "../models/cycleModel.js";

//..@description---------------------------------------create submit applicant
//..@api------------------------------------------------POST/api/user
//..@access--------------------------------------------public

 const createApplication = expressAsyncHandler(async (req, res) => {
  const openCycle=await Applicationcycle.findOne({status:"open"})
  if(!openCycle){
    res.status(400)
    throw new Error("No application cycle is open yet")
  }
  
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
      fatherPhone,
      motherPhone,
      mothersOccupation,
      fathersOccupation,
      guardianName,
      guardiansOccupation,
      guardianRelationship,
      guardianPhone,

      institutionName,
      levelOfStudy,
      class: studentClass,
      yearOfStudy,
      institutionBranch,
      admissionNo,
      totalFees,
      feeBalance,

      disability,
      sponsorship,
      siblings,
      parenthoodStatus,

      documents,
    } = req.body;

    //this is ton make sure one sends id or birthcertificate picture

    // ================= BASIC VALIDATION =================
    if (!burSaryType){
      res.status(400)
      throw new Error("Bursary type required");
    } 
    if (!ward){
      res.status(400)
      throw new Error("ward is required")
    }
    if (!fullName){
      res.status(400)
       throw new Error("Full name required");
    }
    if (!gender) {
      res.status(400)
      throw new Error("Gender required");
    }
    if (!institutionName) {
      res.status(400)
      throw new Error("Institution name required");
    }
    if (!levelOfStudy){
      res.status(400)
       throw new Error("Level of study required");
    }
    if (!admissionNo) {
      res.status(400)
      throw new Error("Admission number required");
    }

    if (totalFees == null) {
      res.status(400)
      throw new Error("Total fees required");
    }
    if (feeBalance == null) {
      res.status(400)
      throw new Error("Fee balance required");
    }
    if (Age == null){
      res.status(400)
       throw new Error("Age is required");
    }

    // ================= PHONE VALIDATION =================
    const phoneRegex = /^(07|01|2547|2541)\d{8}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      res.status(400)
      throw new Error("Invalid phone number");
    }

    // ================= FEES VALIDATION =================
    if (totalFees < 0 || feeBalance < 0) {
      res.status(400)
      throw new Error("Fees cannot be negative");
    }

    if (Number(feeBalance) > Number(totalFees)) {
      res.status(400)
      throw new Error("Fee balance cannot exceed total fees");
    }

 

    //AGE + DOCUMENT VALIDATIOn
     const birthCertificate = documents.find(
        (doc) => doc.name?.trim() === "Birth Certificate"
      );
      const idCopy = documents.find(
        (doc) => doc.name?.trim() === "National ID"
      );
    

    if (Age < 18) {
      if (!birthCertificate?.files?.length) {
        res.status(400)
        throw new Error("Applicants under 18 must provide birth certificate");
      }
    } else {
      if (!birthCertificate?.files?.length&& !idCopy?.files?.length) {
        res.status(400)
        throw new Error(
          "Applicants 18+ must provide ID number or birth certificate"
        );
      }
    }

    // ================= LEVEL VALIDATION =================
    if (levelOfStudy === "Secondary" && !studentClass) {
      res.status(400)
      throw new Error("Secondary students must provide class");
    }

    if (
      (levelOfStudy === "University" || levelOfStudy === "College") &&
      !yearOfStudy
    ) {
      res.status(400)
      throw new Error(
        "University/College students must provide year of study"
      );
    }

    // ================= GUARDIAN VALIDATION =================
    if (!fatherName && !motherName && !guardianName) {
      res.status(400)
      throw new Error("Provide at least one parent or guardian information");
    }

    // ================= DUPLICATE CHECK =================
    const existing = await Applications.findOne({
      admissionNo,
      institutionName,
      financialYear:openCycle.financialYear,
      cycleName:openCycle.cycleName
    });

    if (existing) {
      return res.status(400)
      throw new Error("Application already exists for this student");
    }

    // ================= CREATE APPLICATION =================
    const application = await Applications.create({
      burSaryType,
      ward,
      location,
      financialYear:openCycle.financialYear,
      cycleName:openCycle.cycleName,
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
      mothersOccupation,
      fathersOccupation,
      guardiansOccupation,

      institutionName,
      levelOfStudy,
      institutionBranch,
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
  .populate("reviewedBy", "firstName secondName role")
  if(!applicant){
    res.status(404)
    throw new Error("Applicant not found")
  }
  // function for changing the status of the applicant to reviewer 
   if (applicant.status === "Pending" && req.user.role==="reviewer") {
    applicant.status = "Under-Review";
    applicant.reviewedBy = req.user._id;
    applicant.reviewedAt = new Date();
    applicant.reviewStartedAt = new Date();
    await applicant.save();
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
  const {status,remarks}=req.body

  const allowedStatus=["Pending","Approved","Rejected","Under-Review"]
  if(!allowedStatus.includes(status)){
    res.status(400)
    throw new Error("Invalid status value")
  }
  const applicant=await Applications.findById(id)
  if(!applicant){
    res.status(404)
    throw new Error("Applicant Unavailable");
  }
  applicant.status=status||applicant.status
  applicant.remarks=remarks||applicant.remarks

  applicant.reviewedBy=req.user._id
  applicant.reviewStartedAt=null

  await applicant.save()
  await applicant.populate("reviewedBy", "firstName secondName role");
  res.status(200).json(applicant)
})

//..@description----------------------------------------------update the applicant allocated amount
//..api ----------------------------------------------PUT/api/applicant/:id
//..@access---------------------------------------------------private
const updateAllocatedAmount=expressAsyncHandler(async(req,res)=>{
   console.log("Controller is reached")
   console.log(req.body)
  const{ ApprovedAmount}=req.body
  const {id}=req.params
  console.log(ApprovedAmount)
  console.log(id)
  const applicant=await Applications.findById(id)
  if(!applicant){
    res.status(404)
    throw new Error("Allplication un availlable")
  }
  if(req.user.role!=="finance" || applicant.status!=="Approved"){
    res.status(403)
    throw new Error("Forbidden,You canot allocate amount")
  }
  applicant.ApprovedAmount=ApprovedAmount
  const updatedApplicant=await applicant.save()
  res.status(200)
  .json(updatedApplicant)

})

export {createApplication,getApplicants,getApllicant,
      updateApplicantsStatus,updateAllocatedAmount}