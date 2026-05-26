
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 0,

  formData: {
    burSaryType: "",
    ward: "",
    location: "",
    subLocation: "",
    village: "",

    // student details
    fullName: "",
    gender: "",
    phoneNumber: "",
    idNo: "",
    birthCertNo:"",
    Age: "",

    // institution
    institutionName: "",
    levelOfStudy: "",
    class: "",
    yearOfStudy: "",
    admissionNo: "",
    totalFees: "",
    feeBalance: "",

    // family
    fatherName: "",
    fatherPhone: "",

    motherName: "",
    motherPhone: "",

    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",

    parenthoodStatus: "",

    // disability
    hasDisability: false,
    disabilityType: "",

    // sponsor
    hasSponsor: false,
    sponsorName: "",

    // siblings
    siblings: [
      {
        name: "",
        institution: "",
        level: "",
        yearOfStudy: "",
        hasBeneficiarySibling: false,
        beneficiarySiblingsExplanation: "",
      },
    ],

    // documents
    documents: [
      {
        name: "",
        file:[""],
        preview:null,
      },
    ],
  },
};

const applicationSlice = createSlice({
  name: "application",
  initialState,

  reducers: {
    updateFormData: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },

    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },

    resetApplicationForm: (state) => {
      state.formData = initialState.formData;
      state.currentStep = 0;
    },
  },
});

export const {
  updateFormData,
  setCurrentStep,
  resetApplicationForm,
} = applicationSlice.actions;

export default applicationSlice.reducer;