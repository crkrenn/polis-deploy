
module.exports = {

  domainWhitelist: [
    "^localhost$",
    "^server$",
    "^client$",
    "^admin$",
    "^192\\.168\\.1\\.140$",
    "^pol\\.is",
    ".+\\.pol\\.is$",
    "^xip\\.io$",
    ".+\\.xip\\.io$",
  ],

  // Point to a polisServer instance (local recommended for dev)
//  SERVICE_URL: "http://localhost:5000", // local server; recommended for dev
  SERVICE_URL: "http://server:5000", // local server; recommended for dev
  //SERVICE_URL: "https://preprod.pol.is",

  // Note that this must match the participation client port specified in polisServer instance
  PORT: 5001,
  CLIENT_PORT: 5001,
  ADMIN_PORT: 5002,
  // CLIENT_HOST: '0.0.0.0',
  // ADMIN_HOST: '0.0.0.0',
  CLIENT_HOST: 'client',
  ADMIN_HOST: 'admin',

  DISABLE_INTERCOM: true,
  DISABLE_PLANS: true,

  // must register with facebook and get a facebook app id to use the facebook auth features
  FB_APP_ID: '{{FB_APP_ID}}',

  // For data exports

  S3_BUCKET_PROD: 'pol.is',
  S3_BUCKET_PREPROD: 'preprod.pol.is',

  SCP_SUBDIR_PREPROD: 'preprod',
  SCP_SUBDIR_PROD: 'prod',

  UPLOADER: 'scp',
  // UPLOADER: 's3',
};
