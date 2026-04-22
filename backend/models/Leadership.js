import mongoose from 'mongoose';

const leadershipSchema = new mongoose.Schema(
  {
    leadershipId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    org: { type: String, required: true },
    period: { type: String, required: true },
    url: { type: String, default: null },
    summary: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    badge: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Leadership = mongoose.model('Leadership', leadershipSchema);
export default Leadership;
