import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 1, max: 5, required: true },
  since: { type: Number, required: true },
  desc: { type: String, default: '' },
}, { _id: false });

const skillCategorySchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true },
    accent: { type: String, default: '#52aeff' },
    glow: { type: String, default: 'rgba(82,174,255,0.15)' },
    icon: { type: String, default: '⬡' },
    summary: { type: String, default: '' },
    skills: { type: [skillSchema], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

skillCategorySchema.index({ order: 1 });

const SkillCategory = mongoose.model('SkillCategory', skillCategorySchema);
export default SkillCategory;
