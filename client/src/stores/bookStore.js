import { create } from 'zustand';
import { publicAPI } from '../api/client.js';

const useBookStore = create((set, get) => ({
  // Book state
  currentPage: 0,
  totalPages: 5,
  isAnimating: false,
  showTOC: false,

  // Data from API
  profile: null,
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  services: [],
  socialLinks: [],
  settings: null,
  seo: null,

  // Loading states
  isLoading: true,
  error: null,

  // Page navigation
  nextPage: () => {
    const { currentPage, totalPages, isAnimating } = get();
    if (currentPage < totalPages - 1 && !isAnimating) {
      set({ isAnimating: true, currentPage: currentPage + 1 });
      setTimeout(() => set({ isAnimating: false }), 800);
    }
  },

  prevPage: () => {
    const { currentPage, isAnimating } = get();
    if (currentPage > 0 && !isAnimating) {
      set({ isAnimating: true, currentPage: currentPage - 1 });
      setTimeout(() => set({ isAnimating: false }), 800);
    }
  },

  goToPage: (page) => {
    const { totalPages, isAnimating } = get();
    if (page >= 0 && page < totalPages && !isAnimating) {
      set({ isAnimating: true, currentPage: page, showTOC: false });
      setTimeout(() => set({ isAnimating: false }), 800);
    }
  },

  toggleTOC: () => set((s) => ({ showTOC: !s.showTOC })),
  closeTOC: () => set({ showTOC: false }),

  // Fetch all public data
  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [
        profileRes,
        skillsRes,
        experienceRes,
        projectsRes,
        educationRes,
        certificationsRes,
        servicesRes,
        socialLinksRes,
        settingsRes,
        seoRes,
      ] = await Promise.allSettled([
        publicAPI.getProfile(),
        publicAPI.getSkills(),
        publicAPI.getExperience(),
        publicAPI.getProjects(),
        publicAPI.getEducation(),
        publicAPI.getCertifications(),
        publicAPI.getServices(),
        publicAPI.getSocialLinks(),
        publicAPI.getSettings(),
        publicAPI.getSEO(),
      ]);

      set({
        profile: profileRes.status === 'fulfilled' ? profileRes.value.data : null,
        skills: skillsRes.status === 'fulfilled' ? skillsRes.value.data : [],
        experience: experienceRes.status === 'fulfilled' ? experienceRes.value.data : [],
        projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data : [],
        education: educationRes.status === 'fulfilled' ? educationRes.value.data : [],
        certifications: certificationsRes.status === 'fulfilled' ? certificationsRes.value.data : [],
        services: servicesRes.status === 'fulfilled' ? servicesRes.value.data : [],
        socialLinks: socialLinksRes.status === 'fulfilled' ? socialLinksRes.value.data : [],
        settings: settingsRes.status === 'fulfilled' ? settingsRes.value.data : null,
        seo: seoRes.status === 'fulfilled' ? seoRes.value.data : null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message || 'Failed to load data', isLoading: false });
    }
  },
}));

export default useBookStore;
