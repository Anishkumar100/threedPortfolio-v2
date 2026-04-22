import mongoose from 'mongoose';

const maintenanceModeSchema = new mongoose.Schema({
  isEnabled: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: 'We are currently performing scheduled maintenance. Please check back soon.',
  },
  estimatedEnd: {
    type: Date,
    default: null,
  },
  allowedIPs: {
    type: [String],
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
    default: 'system',
  },
});

// Singleton pattern — ensure only one document exists
maintenanceModeSchema.statics.getInstance = async function () {
  let instance = await this.findOne();
  if (!instance) {
    instance = await this.create({});
  }
  return instance;
};

const MaintenanceMode = mongoose.model('MaintenanceMode', maintenanceModeSchema);
export default MaintenanceMode;
