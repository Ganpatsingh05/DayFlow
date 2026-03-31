// ─── ENVIRONMENT LOADER ─────────────────────────────────────────
// Load environment variables for the app

window.ENV = {
  VITE_SUPABASE_URL: 'https://kdidmpuveztdljcpfjnc.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkaWRtcHV2ZXp0ZGxqY3Bmam5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDY4ODUsImV4cCI6MjA5MDUyMjg4NX0.SucjP6PtWp2yYff7_KpwuX-roQPojLtUgy_Fd9q7Po8'
};

// Function to update environment variables
window.setEnv = function(envVars) {
  window.ENV = { ...window.ENV, ...envVars };
  console.log('✅ Environment variables updated');
};

// Function to get environment variable
window.getEnv = function(key) {
  return window.ENV?.[key];
};

// Log environment status
console.log('✅ Environment Loader initialized');
console.log('Supabase URL:', window.ENV.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('Supabase Anon Key:', window.ENV.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');

