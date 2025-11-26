export const auth = {
    signInWithEmailAndPassword: async (email, password) => ({
        user: { uid: '123', email, displayName: 'Test User' },
    }),
    signOut: async () => { },
};
export const db = {
    collection: () => ({
        add: async (data) => ({ id: 'mock-id', ...data }),
        get: async () => ({ docs: [] }),
    }),
};
