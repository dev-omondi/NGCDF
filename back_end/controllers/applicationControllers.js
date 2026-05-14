
import Applications from "../models/applicationModel.js";
import expressAsyncHandler from "express-async-handler";

//..@description---------------------------------------create submit applicant
//..@api------------------------------------------------POST/api/user
//..@access--------------------------------------------public

export const createApplication =expressAsyncHandler( async (req, res) => {
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
      Age,

      fatherName,
    motherName,
    guardianName,
    guardianPhone,

      institutionName,
      levelOfStudy,
      class: studentClass,
      yearOfStudy,
      admissionNo,
      totalFees,
      feeBalance,

      disability,
      siblingsBenefiting,
      parenthoodStatus,
      sponsorship,

      documents,
    } = req.body;

    // BASIC REQUIRED VALIDATION
    if (!burSaryType) return res.status(400).json({ message: "Bursary type required" });
    if (!ward) return res.status(400).json({ message: "Ward required" });
    if (!fullName) return res.status(400).json({ message: "Full name required" });
    if (!gender) return res.status(400).json({ message: "Gender required" });
    if (!institutionName) return res.status(400).json({ message: "Institution name required" });
    if (!levelOfStudy) return res.status(400).json({ message: "Level of study required" });
    if (!admissionNo) return res.status(400).json({ message: "Admission number required" });
    if (!totalFees && totalFees !== 0){
      res.status(400)
      throw new Error("Total fees required");
    }
    if (!feeBalance && feeBalance !== 0){
      res.status(400)
    throw new Error("Fee balance required");
    }
    if (!Age){ 
       res.status(400)
      throw new Error("Age is required");
  }

    // PHONE VALIDATION
    const phoneRegex = /^(07|01|2547|2541)\d{8}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      res.status(400)
      throw new Error("Invalid phone number");
    }


    // FEES VALIDATION
    if (totalFees < 0 || feeBalance < 0) {
      res.status(400)
      throw new Error("Fees cannot be negative");
    }

    if (feeBalance > totalFees) {
      res.status(400)
      throw new Error("Fee balance cannot exceed total fees");
    }

    // AGE + DOCUMENT VALIDATION
    if (Age < 18) {
      // MUST HAVE BIRTH CERTIFICATE
      if (!documents?.birthCertificate) {
        res.status(400)
        throw new Error("Applicants under 18 must provide birth certificate");
      }
    } else {
      // 18+ must have ID OR birth certificate OR both
      if (!documents?.birthCertificate && !idNo) {
        res.status(400)
        throw new Error("Applicants 18+ must provide ID number or birth certificate")
      }
    }

    // LEVEL OF STUDY VALIDATION
    if (levelOfStudy === "Secondary") {
      if (!studentClass) {
        return res.status(400).json({
          message: "Secondary students must provide class",
        });
      }
    }

    if (
      levelOfStudy === "University" ||
      levelOfStudy === "College"
    ) {
      if (!yearOfStudy) {
        return res.status(400).json({
          message: "University/College students must provide year of study",
        });
      }
    }

    if (!fatherName && !motherName && !guardianName) {
        return res.status(400).json({
            message: "Provide at least one parent or guardian information",
        });
        }

    // DUPLICATE CHECK
    const existing = await Applications.findOne({
      admissionNo,
      institutionName,
    });

    if (existing) {
      return res.status(400).json({
        message: "Application already exists for this student",
      });
    }


    // CREATE APPLICATION
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
      Age,
    
      fatherName,
     motherName,
     guardianName,
     guardianPhone,

      institutionName,
      levelOfStudy,
      class: studentClass,
      yearOfStudy,
      admissionNo,
      totalFees,
      feeBalance,

      disability,
      siblingsBenefiting,
      parenthoodStatus,
      sponsorship,

      documents,
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