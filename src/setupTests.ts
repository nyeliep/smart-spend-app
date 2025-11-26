import '@testing-library/jest-dom';



declare global {
  var importMetaEnv: {
    VITE_FIREBASE_API_KEY: string;
    [key: string]: string | undefined;
  };
}

globalThis.importMetaEnv = {
  VITE_FIREBASE_API_KEY: 'test-api-key',
  
};

export {};
