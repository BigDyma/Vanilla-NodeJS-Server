// Container for all the envs
const enviroments = {};

// Staging (default) env
enviroments.staging = {
 'httpPort': 3000,
 'httpsPort': 3001,
 'envName': 'staging',
 'hashingSecret': 'SecretGonnaStaySecret'
};

// Production env
enviroments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'SecretBetterStaySecret'
};

// Determine which env should be exported
const currentEnv = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase(): '';

const  envExport = typeof(enviroments[currentEnv]) == 'object' ? enviroments[currentEnv] : enviroments['staging'];

module.exports = envExport;
