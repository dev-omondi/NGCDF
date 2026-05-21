import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // basic info
    burSaryType: { type: String, required: true, trim: true },
    ward: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    subLocation: { type: String, required: true, trim: true },
    village: { type: String, required: true, trim: true },

    // student details
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Others"] },
    phoneNumber: { type: String },
    idNo: { type: String },
    birthCertNo: { type: String },
    Age: { type: Number, required: true },

    // institution
    institutionName: { type: String, required: true, trim: true },
    levelOfStudy: {
      type: String,
      required: true,
      enum: ["Secondary", "College", "University"],
    },
    class: { type: String },
    yearOfStudy: { type: String },
    admissionNo: { type: String, required: true },
    totalFees: { type: Number, required: true },
    feeBalance: { type: Number, required: true },

    // family
    fatherName: { type: String },
    fatherPhone: { type: String },

    motherName: { type: String },
    motherPhone: { type: String },

    guardianName: { type: String },
    guardianRelationship: { type: String },
    guardianPhone: { type: String },

    parenthoodStatus: {
      type: String,
      enum: ["Both Parents Alive", "Single Parent", "Orphan", "Partial Orphan"],
    },

    // disability (FIXED STRUCTURE)
    disability: {
      hasDisability: { type: Boolean, default: false },
      disabilityType: { type: String },
    },

    // sponsor (FIXED STRUCTURE)
    sponsorship: {
      hasSponsor: { type: Boolean, default: false },
      sponsorName: { type: String },
    },

    // siblings (MATCH FRONTEND ARRAY)
    siblings: [
      {
        name: String,
        institution: String,
        level: String,
        yearOfStudy: String,
        hasBeneficiarySibling: Boolean,
        beneficiarySiblingsExplanation: String,
      },
    ],

    // documents (CRITICAL FIX)
    documents: [
      {
        name: { type: String },
        file: { type: String, required: true }, // URL or path
      },
    ],

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    ApprovedAmount: { type: Number, default: 0 },
    remarks: { type: String },
  },
  { timestamps: true }
);

const Applications = mongoose.model("Applications", applicationSchema);

export default Applications;