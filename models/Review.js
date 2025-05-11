import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  notes: { 
    type: String, 
    trim: true,
    maxlength: 500
  },
  profilePic: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'approved' 
  }
}, {
  timestamps: true
});

// Add virtual for star display
reviewSchema.virtual('stars').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

export const Review = mongoose.models?.Review || mongoose.model('Review', reviewSchema);