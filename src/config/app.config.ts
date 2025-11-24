export interface AppConfig {
  app: {
    name: string;
    version: string;
  };
  theme: {
    defaultTheme: 'light' | 'dark';
  };
  database: {
    type: string;
    supabase?: {
      url: string;
      anonKey: string;
    };
    postgres?: {
      host: string;
      port: number;
      name: string;
      user: string;
      password: string;
    };
  };
  compiler: {
    serviceUrl?: string;
  };
}

const validateEnvVariable = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getConfig = (): AppConfig => {
  const dbType = import.meta.env.VITE_DB_TYPE || 'supabase';

  const config: AppConfig = {
    app: {
      name: import.meta.env.VITE_APP_NAME || 'Java Practice Platform',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    },
    theme: {
      defaultTheme: (import.meta.env.VITE_DEFAULT_THEME as 'light' | 'dark') || 'dark',
    },
    database: {
      type: dbType,
    },
    compiler: {
      serviceUrl: import.meta.env.VITE_COMPILER_SERVICE_URL,
    },
  };

  if (dbType === 'supabase') {
    config.database.supabase = {
      url: validateEnvVariable('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
      anonKey: validateEnvVariable('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
    };
  } else if (dbType === 'postgres') {
    config.database.postgres = {
      host: validateEnvVariable('VITE_DB_HOST', import.meta.env.VITE_DB_HOST),
      port: parseInt(import.meta.env.VITE_DB_PORT || '5432', 10),
      name: validateEnvVariable('VITE_DB_NAME', import.meta.env.VITE_DB_NAME),
      user: validateEnvVariable('VITE_DB_USER', import.meta.env.VITE_DB_USER),
      password: validateEnvVariable('VITE_DB_PASSWORD', import.meta.env.VITE_DB_PASSWORD),
    };
  }

  return config;
};

export const appConfig = getConfig();
