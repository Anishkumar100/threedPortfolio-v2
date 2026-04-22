import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    trim: true,
  },
  event: {
    type: String,
    required: true,
    enum: ['pageview', 'service_view', 'inquiry_start', 'contact_submit', 'project_view', 'cta_click'],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ip: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  referrer: {
    type: String,
    default: '',
  },
  sessionId: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: { expires: '90d' },
  },
});

analyticsSchema.index({ page: 1, event: 1 });
analyticsSchema.index({ timestamp: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
