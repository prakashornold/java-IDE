export interface AppConfig {
  app: {
    name: string;
    version: string;
  };
  theme: {
    defaultTheme: 'light' | 'dark';
  };
  api: {
    baseUrl: string;
  };
  compiler: {
    serviceUrl?: string;
  };
}

const validateEnvVariable = (key: string, value: string | undefined, defaultValue?: string): string => {
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue!;
};

const getConfig = (): AppConfig => {
  return {
    app: {
      name: import.meta.env.VITE_APP_NAME || 'Java Practice Platform',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    },
    theme: {
      defaultTheme: (import.meta.env.VITE_DEFAULT_THEME as 'light' | 'dark') || 'dark',
    },
    api: {
      baseUrl: validateEnvVariable('VITE_BACKEND_API_URL', import.meta.env.VITE_BACKEND_API_URL, 'http://localhost:8080/api/v1'),
    },
    compiler: {
      serviceUrl: import.meta.env.VITE_COMPILER_SERVICE_URL,
    },
  };
};

export const appConfig = getConfig();
