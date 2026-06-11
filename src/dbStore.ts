// dbStore.ts
export const dbStore = {
  getProjects: async () => {
    try {
      const response = await fetch(import.meta.env.VITE_EXTERNAL_API_URL);
      if (!response.ok) {
        throw new Error('فشل الاتصال بقاعدة البيانات');
      }
      return await response.json();
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
      return [];
    }
  }
};
