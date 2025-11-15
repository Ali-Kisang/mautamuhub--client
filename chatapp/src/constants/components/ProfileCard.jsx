import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { MdVerified } from 'react-icons/md';
import { useAuthStore } from '../../store/useAuthStore';
import { showToast } from '../../components/utils/showToast';

const cld = new Cloudinary({ cloud: { cloudName: 'dcxggvejn' } });

const TEMPLATE_GROUPS = {
  spa: {
    regular: [
      "Rejuvenate at {name}, a tranquil {age}-year haven in {location}, offering {orientation} therapies.",
      // ... (Include all 50+ from SpasList; truncate here for brevity—paste your full array)
      "City-sigh spa at {name}, {age} years easing {location}'s hustle with {orientation}."
    ],
    new: [
      "Freshly blooming! Welcome to {name}, the newest {age}-year haven in {location} for {orientation} therapies.",
      // ... (Your 10 newSpaTemplates)
    ]
  },
  vvip: {
    regular: [
      "Captivate your desires with {name}, a mesmerizing {age}-year-old {orientation} enchantress in {location}.",
      // ... (All 50+ from VVIPList)
    ],
    new: [
      "Freshly unveiled! Meet {name}, the newest {age}-year {orientation} sensation in {location}.",
      // ... (Your 10 newVVIPTemplates)
    ]
  },
  vip: {
    regular: [
      "Encounter elegance with {name}, a captivating {age}-year-old {orientation} in {location}.",
      // ... (All 50+ from VIPListByCounty)
    ],
    new: [
      "Freshly fabulous! Meet {name}, the newest {age}-year {orientation} star in {location}.",
      // ... (Your 10 newVIPTemplates)
    ]
  },
  regular: {
    regular: [
      "Connect with {name}, a charming {age}-year-old {orientation} ready for fun in {location}.",
      // ... (All 50+ from RegularListByCounty)
    ],
    new: [
      "Fresh face alert! Meet {name}, the newest {age}-year {orientation} in {location}.",
      // ... (Your 10 newRegularTemplates)
    ]
  }
};

const ProfileCard = ({ item, type, countyName = '' }) => {
  const { onlineUsers } = useAuthStore();
  const onlineSet = useMemo(() => new Set(onlineUsers?.map(u => u.userId?.toString()) || []), [onlineUsers]);
  const isOnline = onlineSet.has(item.user?.toString());
  const isVerified = type === 'spa' || type === 'vvip'; // Customize logic (e.g., check item.verified)
  const isNew = item.createdAt && new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const templates = TEMPLATE_GROUPS[type] || TEMPLATE_GROUPS.regular; // Fallback
  const summary = useMemo(() => {
    const tpls = isNew ? templates.new : templates.regular;
    const tpl = tpls[Math.floor(Math.random() * tpls.length)];
    return tpl
      .replace('{name}', item.personal?.username || `${type.charAt(0).toUpperCase() + type.slice(1)} Profile`)
      .replace('{age}', item.personal?.age || 'timeless')
      .replace('{location}', `${item.location?.constituency || countyName}, ${item.location?.ward || ''}`)
      .replace('{orientation}', item.personal?.orientation || 'versatile');
  }, [item, type, isNew, countyName]);

  const handleCall = () => {
    const phone = item.personal?.phone;
    if (!phone) return;
    if (navigator.userAgent.match(/Mobi|Android/i)) {
      window.location.href = `tel:${phone}`;
    } else {
      navigator.clipboard.writeText(phone).then(() => {
        showToast(`Phone copied: ${phone}\nPaste into your dialer!`, false);
      }).catch(() => {
        prompt('Copy this phone:', phone);
      });
    }
  };

  const imageContent = item.photos?.[0] ? (
    <AdvancedImage 
      cldImg={cld.image(item.photos[0]).resize(auto().gravity(autoGravity()))} 
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      alt={`${item.personal?.username || 'Profile'}'s ${type} photo`}
      loading="lazy"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center rounded-lg">
      <span className="text-gray-400 text-sm font-medium">No Image Available</span>
    </div>
  );

  const badgeText = isVerified ? 'Verified' : 'Not Verified';
  const verifiedIcon = isVerified ? <MdVerified className="text-pink-600 text-lg" /> : null;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-gray-200 shadow-md p-4 sm:p-6 bg-gradient-to-br from-white to-pink-50 hover:shadow-xl hover:scale-105 hover:border-pink-400 transition-all duration-500 min-h-[380px] sm:min-h-[420px] flex flex-col" role="article" aria-labelledby={`card-title-${item._id}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/3 to-transparent z-0" />
      <Link to={`/profile/${item._id}`} className="block relative z-10 flex-1 flex flex-col">
        <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden mb-3 sm:mb-4">
          {imageContent}
          {/* Responsive Badges: Stack on mobile */}
          <div className="absolute top-2 left-2 flex flex-col sm:flex-row gap-1 z-20">
            <div 
              className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg border border-pink-200 flex items-center gap-1 min-w-[80px] justify-center"
              title={badgeText}
            >
              {verifiedIcon}
              <span className="text-xs font-bold text-gray-800 hidden sm:inline">{badgeText}</span>
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full z-20 border-2 border-white/50 shadow-xl flex items-center gap-1" title={isOnline ? 'Active now' : 'Offline'}>
            <span className={`w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-xs text-white font-bold hidden sm:inline">{isOnline ? 'LIVE' : 'OFFLINE'}</span>
          </div>
          {isNew && (
            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-yellow-300 animate-pulse" title="New Profile!">
              NEW {type.toUpperCase().slice(0, 3)}!
            </div>
          )}
        </div>
        <h3 id={`card-title-${item._id}`} className="sr-only">{item.personal?.username || 'Profile'}</h3>
        <p className="text-gray-700 font-semibold text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-none mb-3 sm:mb-4 flex-1">
          {summary}
        </p>
        <button 
          className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full text-xs sm:text-sm hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-pink-500/25 focus:ring-2 focus:ring-pink-500 focus:outline-none transform hover:-translate-y-0.5"
          aria-label="View profile details"
        >
          View Profile
        </button>
      </Link>
      {item.personal?.phone && (
        <button
          onClick={handleCall}
          className="mt-3 w-full py-2.5 sm:py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-lg text-xs sm:text-sm hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-rose-500/25 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          aria-label={`Call ${item.personal.phone}`}
        >
          📞 Call Now: {item.personal.phone}
        </button>
      )}
    </article>
  );
};

export default ProfileCard;