import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Anish Kumar S' },
    firstName: { type: String, default: 'Anish' },
    lastName: { type: String, default: 'Kumar S' },
    initials: { type: String, default: 'AK' },
    role: { type: String, default: 'Full Stack Developer' },
    roleAlt: { type: String, default: '' },
    tagline: { type: String, default: '' },
    location: { type: String, default: '' },
    locationShort: { type: String, default: '' },
    timezone: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    resume: { type: String, default: '' },
    avatar: { type: String, default: '' },
    available: { type: Boolean, default: true },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

profileSchema.statics.getInstance = async function () {
  let instance = await this.findOne();
  if (!instance) instance = await this.create({});
  return instance;
};

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
