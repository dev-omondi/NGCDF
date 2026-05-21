
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [], // selected files before upload

  previewUrls: [], // for UI preview

  uploading: false,

  progress: 0,
};

const imageSlice = createSlice({
  name: "image",

  initialState,

  reducers: {
    // ADD IMAGE
    addImage: (state, action) => {
      const file = action.payload;

      state.images.push(file);

      state.previewUrls.push(URL.createObjectURL(file));
    },

    // REMOVE IMAGE
    removeImage: (state, action) => {
      const index = action.payload;

      state.images.splice(index, 1);
      state.previewUrls.splice(index, 1);
    },

    // CLEAR ALL
    clearImages: (state) => {
      state.images = [];
      state.previewUrls = [];
    },

    // SET UPLOADING STATUS
    setUploading: (state, action) => {
      state.uploading = action.payload;
    },

    // SET UPLOAD PROGRESS
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
});

export const {
  addImage,
  removeImage,
  clearImages,
  setUploading,
  setProgress,
} = imageSlice.actions;

export default imageSlice.reducer;