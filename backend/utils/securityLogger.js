// backend/utils/securityLogger.js
const fs = require('fs');
const path = require('path');

// Créer le répertoire de logs s'il n'existe pas
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const securityLogPath = path.join(logsDir, 'security.log');
const authLogPath = path.join(logsDir, 'auth.log');

const SecurityEventType = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  TOKEN_REVOKED: 'TOKEN_REVOKED',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  FILE_UPLOADED: 'FILE_UPLOADED'
};

const Severity = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL'
};

const formatLog = (eventType, details, severity = Severity.INFO) => {
  return {
    timestamp: new Date().toISOString(),
    eventType,
    severity,
    ...details,
    environment: process.env.NODE_ENV || 'development'
  };
};

const writeLog = (logPath, logData) => {
  try {
    const logLine = JSON.stringify(logData) + '\n';
    fs.appendFileSync(logPath, logLine, 'utf8');
  } catch (error) {
    console.error('❌ Erreur lors de l\'écriture du log:', error.message);
  }
};

const logSecurityEvent = (eventType, details, severity = Severity.INFO) => {
  const logData = formatLog(eventType, details, severity);
  writeLog(securityLogPath, logData);
  
  if (severity === Severity.CRITICAL || severity === Severity.ERROR) {
    console.error(`🚨 [SECURITY] ${eventType}:`, details);
  } else if (process.env.NODE_ENV !== 'production') {
    console.log(`🔐 [SECURITY] ${eventType}:`, details);
  }
};

const logAuthAttempt = (success, userEmail, ip, userType = 'client') => {
  const eventType = success ? SecurityEventType.LOGIN_SUCCESS : SecurityEventType.LOGIN_FAILED;
  const severity = success ? Severity.INFO : Severity.WARNING;
  
  const logData = formatLog(eventType, {
    userEmail,
    userType,
    ip,
    success
  }, severity);
  
  writeLog(authLogPath, logData);
  
  if (!success) {
    logSecurityEvent(eventType, { userEmail, ip, userType }, severity);
  }
};

const logRateLimitExceeded = (ip, endpoint, userEmail = null) => {
  logSecurityEvent(SecurityEventType.RATE_LIMIT_EXCEEDED, {
    ip,
    endpoint,
    userEmail
  }, Severity.WARNING);
};

module.exports = {
  SecurityEventType,
  Severity,
  logSecurityEvent,
  logAuthAttempt,
  logRateLimitExceeded
};