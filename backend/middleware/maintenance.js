import MaintenanceMode from '../models/MaintenanceMode.js';

const maintenanceCheck = async (req, res, next) => {
  try {
    const maintenance = await MaintenanceMode.getInstance();

    if (!maintenance.isEnabled) {
      return next();
    }

    // Allow admin routes through
    if (req.path.startsWith('/api/admin')) {
      return next();
    }

    // Allow health and maintenance status endpoints
    if (req.path === '/api/health' || req.path === '/api/maintenance/status') {
      return next();
    }

    // Check if client IP is in the allowed list
    const clientIP =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.connection?.remoteAddress ||
      req.ip;

    if (maintenance.allowedIPs.length > 0 && maintenance.allowedIPs.includes(clientIP)) {
      return next();
    }

    return res.status(503).json({
      maintenanceMode: true,
      message: maintenance.message,
      estimatedEnd: maintenance.estimatedEnd,
    });
  } catch (err) {
    // If maintenance check fails, let requests through
    next();
  }
};

export default maintenanceCheck;
