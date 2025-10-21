import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOnboardingStore = create(
  persist(
    (set) => ({
      step: 1,
      totalSteps: 7,
      formData: {
        personal: {
          username: "",
          phone: "",
          gender: "",
          age: "",
          complexity: "",
          ethnicity: "",
        },
        location: {},
        additional: {},
        services: [],
        accountType: null,
        photos: [],
      },
      setStep: (step) => set({ step }),
      updateSection: (section, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [section]: { ...state.formData[section], ...data },
          },
        })),
      updatePhotos: (photos) =>
        set((state) => ({
          formData: {
            ...state.formData,
            photos,
          },
        })),
      setAccountType: (type) =>
        set((state) => ({
          formData: {
            ...state.formData,
            accountType: type,
          },
        })),
    }),
    {
      name: "onboarding-storage",
      partialize: (state) => ({
        formData: {
          ...state.formData,
          photos: undefined, 
        },
        step: state.step,
      }),
    }
  )
);