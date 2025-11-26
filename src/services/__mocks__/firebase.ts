export const auth = {
  signInWithEmailAndPassword: async (email: string, password: string) => ({
    user: { uid: '123', email, displayName: 'Test User' },
  }),
  signOut: async () => {},
};

export const db = {
  collection: () => ({
    add: async (data: any) => ({ id: 'mock-id', ...data }),
    get: async () => ({ docs: [] }),
  }),
};
