
module.exports = {

  domainWhitelist: [
    "^ec2-34-215-51-34.us-west-2.compute.amazonaws.com$",
    "^preprod.dgpsp.s3.s3-website-us-west-2.amazonaws.com$",
    "^http://dgpsp-server2-staging.herokuapp.com$",
    "^localhost$",
    "^server$",
    "^client$",
    "^admin$",
    "^172.25.0",        
    "^172.28.1",        
    "^52.32.106.92$",
    "^polis2.democracygps.org$",
    "^54.214.183.214$",
    "^polis.democracygps.org$",
    "^192\\.168\\.1\\.140$",
    "^pol\\.is",
    ".+\\.pol\\.is$",
    "^xip\\.io$",
    ".+\\.xip\\.io$",
  ],

  // Point to a polisServer instance (local recommended for dev)
  SERVICE_URL: "http://localhost:5000", // local server; recommended for dev
  //SERVICE_URL: "https://preprod.pol.is",

  // Note that this must match the participation client port specified in polisServer instance
  PORT: 5001,

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
