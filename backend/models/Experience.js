import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    experienceId: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, default: 'Full-time' },
    period: { type: String, required: true },
    duration: { type: String, default: '' },
    location: { type: String, default: '' },
    current: { type: Boolean, default: false },
    accent: { type: String, default: '#52aeff' },
    summary: { type: String, default: '' },
    points: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    impact: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

experienceSchema.index({ order: 1 });

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
