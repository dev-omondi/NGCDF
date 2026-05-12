import Applications from "../models/applicationModel.js";

export const createApplication = async (req, res) => {
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
    if (!totalFees && totalFees !== 0)
      return res.status(400).json({ message: "Total fees required" });
    if (!feeBalance && feeBalance !== 0)
      return res.status(400).json({ message: "Fee balance required" });

    if (!Age) return res.status(400).json({ message: "Age is required" });

    // PHONE VALIDATION
    const phoneRegex = /^(07|01|2547|2541)\d{8}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }


    // FEES VALIDATION
    if (totalFees < 0 || feeBalance < 0) {
      return res.status(400).json({ message: "Fees cannot be negative" });
    }

    if (feeBalance > totalFees) {
      return res.status(400).json({ message: "Fee balance cannot exceed total fees" });
    }

    // AGE + DOCUMENT VALIDATION
    if (Age < 18) {
      // MUST HAVE BIRTH CERTIFICATE
      if (!documents?.birthCertificate) {
        return res.status(400).json({
          message: "Applicants under 18 must provide birth certificate",
        });
      }
    } else {
      // 18+ must have ID OR birth certificate OR both
      if (!documents?.birthCertificate && !idNo) {
        return res.status(400).json({
          message: "Applicants 18+ must provide ID number or birth certificate",
        });
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
};