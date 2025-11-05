const { Cashfree } = require('cashfree-pg');

// Initialize Cashfree for SDK v5
const cashfree = new Cashfree(
  process.env.NODE_ENV === 'production' ? Cashfree.PRODUCTION : Cashfree.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

module.exports = cashfree;

