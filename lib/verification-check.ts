import { connectDB } from './db';
import { User, Site } from '@/models';

export async function checkUserVerification(userId: string) {
  try {
    await connectDB();
    
    const user = await User.findById(userId).select('isEmailVerified isPhoneVerified').lean();
    
    if (!user) {
      return { verified: false, reason: 'user_not_found' };
    }
    
    if (!user.isEmailVerified || !user.isPhoneVerified) {
      return { 
        verified: false, 
        reason: 'not_verified',
        emailVerified: user.isEmailVerified,
        phoneVerified: user.isPhoneVerified
      };
    }
    
    return { verified: true };
  } catch (error) {
    console.error('Error checking verification:', error);
    return { verified: false, reason: 'error' };
  }
}

export async function isSiteAccessible(slug: string) {
  try {
    await connectDB();
    
    const site = await Site.findOne({ slug }).lean();
    
    if (!site) {
      return { accessible: false, reason: 'site_not_found' };
    }
    
    if (!site.isActive) {
      return { accessible: false, reason: 'site_inactive' };
    }
    
    const user = await User.findById(site.userId).select('isEmailVerified isPhoneVerified').lean();
    
    if (!user) {
      return { accessible: false, reason: 'user_not_found' };
    }
    
    if (!user.isEmailVerified || !user.isPhoneVerified) {
      return { 
        accessible: false, 
        reason: 'owner_not_verified',
        emailVerified: user.isEmailVerified,
        phoneVerified: user.isPhoneVerified
      };
    }
    
    return { accessible: true, site };
  } catch (error) {
    console.error('Error checking site accessibility:', error);
    return { accessible: false, reason: 'error' };
  }
}
