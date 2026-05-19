
import mongoose from "mongoose";

const applicationSchema = mongoose.Schema(
  {
    burSaryType: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    subLocation: {
      type: String,
      required: true,
      lowercase: true,
    },
    village: {
      type: String,
      trim: true,
      lowercase: true,
      required:true
    },

    // student details
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      required:true
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    idNo: {
      type: String,
      trim: true,
    },
    Age:{
        type:Number,
        required:true
    },

    // institution details
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },
    levelOfStudy: {
      type: String,
      required: true,
      enum: ["Secondary", "College", "University"],
    },
    class: {
      type: String,
      trim: true,
    },
    yearOfStudy: {
      type: String,
      trim:true,
    },
    admissionNo: {
      type: String,
      required: true,
      trim: true,
    },
    totalFees: {
      type: Number,
      required:true,
    },
    feeBalance: {
      type: Number,
      required:true,
    },

    // family details
    fatherName: {
      type: String,
    },
    motherName: {
      type: String,
    },
    guardianName: {
      type: String,
    },
    guardianPhone: {
      type: String,
    },
    gurdianRelation:{
      type:String
    },
    siblingsinhigh: {
      type: [String],
    },
    disability: {
    hasDisability: {
    type: Boolean,
    default: false,
    },
    disabilityType: {
        type:String,
        trim:true,
    },
    },
    siblingsBenefiting: {
    hasBeneficiarySibling: {
        type: Boolean,
        default: false,
    },
    beneficiarySiblingsExplanation:{
        type:String,
    },
    },
    parenthoodStatus:{
        type:String,
        enum:[
            "Both Parents Alive",
            "Single Parent",
            "Orphan",
            "Partial Orphan"
            ]
    },
        sponsorship: {
    hasSponsor: {
        type: Boolean,
        default: false,
    },
    sponsorName: {
        type: String,
        trim: true,
    },
    },
    // documents for storing file path urls
    documents: {
      idCopy: { type: String },
      admissionLetter: { type: String },
      feeStructure: { type: String, required: true },
      parentsIdCopy: { type: [String] },
      parentsVoterCard: { type: [String] },
      stdVoterCard: { type: [String] },
      birthCertificate: { type: String },
      latestTranscript: { type: String },
      latestReceipt: { type: String },
      kcseresultSlip: { type: String },
      siblingsReceipts: { type: [String] },
      paymentReceipt: { type: String },
      siblingsBirthcert: { type: [String] },
      deathDocument: { type: String },
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    ApprovedAmount: {
      type: Number,
      default: 0,
    },

    // admin notes
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const Applications = mongoose.model("Applications", applicationSchema);

export default Applications;