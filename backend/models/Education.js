import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    educationId: { type: String, required: true, unique: true, trim: true },
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    shortName: { type: String, default: '' },
    period: { type: String, required: true },
    grade: { type: String, default: '' },
    status: { type: String, default: 'Completed' },
    location: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    courses: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Education = mongoose.model('Education', educationSchema);
export default Education;
