// Sample data for Karnataka Gym Fitness Centre (Devi Nagar, Hubli - 580031)
// Operating Hours: 6:00 AM - 9:00 PM | Safe, spacious environment for women | 4.9-Star Rating

export const INITIAL_PLANS = [
  {
    id: 'plan_1m',
    code: '1M',
    name: 'Monthly Kickstart',
    durationDays: 30,
    basePrice: 1800,
    discountPrice: 1500,
    isPopular: false,
    features: [
      'Full Gym Floor Access (Cardio & Heavy Weights)',
      'General Trainer Floor Support',
      'Locker & Changing Room Access',
      'Steam & Sauna on Weekends'
    ],
    terms: 'Non-transferable. 1 pause allowed up to 5 days with medical certificate.'
  },
  {
    id: 'plan_3m',
    code: '3M',
    name: 'Quarterly Momentum',
    durationDays: 90,
    basePrice: 4800,
    discountPrice: 3800,
    isPopular: true,
    features: [
      'Full Gym Floor Access (6:00 AM - 9:00 PM)',
      'Free Fitness Assessment & Body Composition Scan',
      'Access to Safe Women Dedicated Morning Slot (10:30 AM - 1:00 PM)',
      'Free Locker & Weekend Steam Bath'
    ],
    terms: 'Pause allowed for up to 15 days. Non-refundable once activated.'
  },
  {
    id: 'plan_6m',
    code: '6M',
    name: 'Half-Yearly Transformation',
    durationDays: 180,
    basePrice: 8500,
    discountPrice: 6500,
    isPopular: false,
    features: [
      'Priority Floor Access & Advanced Machine Circuit',
      'Free 1 Personal Training Goal Setting Session',
      'Complimentary Custom Diet Guideline by Coach Kavita',
      'Up to 30 Days Flexible Membership Freeze',
      'Safe environment & dedicated female trainer support'
    ],
    terms: 'Pause allowed twice (up to 30 days total). 1 transfer allowed to immediate family.'
  },
  {
    id: 'plan_12m',
    code: '12M',
    name: 'Annual Champion Pass',
    durationDays: 365,
    basePrice: 16000,
    discountPrice: 11000,
    isPopular: false,
    features: [
      'Unlimited 365 Days Access with Zero Peak Restrictions',
      '2 Free Personal Training Sessions with Anand or Vijay',
      'Dedicated Locker Storage & Gym Kit Bag',
      'Free Access to Weekend Strength Workshops',
      'Up to 45 Days Total Membership Pause Protection'
    ],
    terms: 'Up to 45 days pause. Transferable once. 100% money-back satisfaction in first 3 days.'
  }
];

export const INITIAL_STAFF = [
  {
    id: 'staff_1',
    name: 'Anand Bellad',
    role: 'HEAD_TRAINER',
    phone: '+91 94801 22341',
    specialization: 'Strength & Conditioning, Olympic Lifting',
    experienceYears: 8,
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=120&h=120&auto=format&fit=crop&q=75',
    bio: 'State-level powerlifter and certified S&C coach from Hubli. Expert in progressive overload and functional muscle building.',
    rating: 4.95,
    activePTSlots: 8,
    maxPTSlots: 10
  },
  {
    id: 'staff_2',
    name: 'Kavita Kalburgi',
    role: 'WOMEN_FITNESS_SPECIALIST',
    phone: '+91 98450 33892',
    specialization: 'Women Fitness, PCOS Nutrition, HIIT & Mobility',
    experienceYears: 6,
    avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=120&h=120&auto=format&fit=crop&q=75',
    bio: 'Certified ACE specialist leading Karnataka Gym\'s safe, supportive women training programs. Over 400+ women transformed in Hubli-Dharwad.',
    rating: 4.98,
    activePTSlots: 7,
    maxPTSlots: 8
  },
  {
    id: 'staff_3',
    name: 'Vijay Patil',
    role: 'SENIOR_TRAINER',
    phone: '+91 99014 88712',
    specialization: 'Fat Loss, Posture Correction & Functional Rehab',
    experienceYears: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&auto=format&fit=crop&q=75',
    bio: 'Specialist in biomechanics, endurance conditioning, and beginner habit-building. Passionate about sustainable lifestyle shifts.',
    rating: 4.90,
    activePTSlots: 6,
    maxPTSlots: 10
  },
  {
    id: 'staff_4',
    name: 'Sunita Byahatti',
    role: 'FRONT_DESK_ADMIN',
    phone: '+91 96633 44521',
    specialization: 'Member Concierge, Check-In Verification & Onboarding',
    experienceYears: 4,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&auto=format&fit=crop&q=75',
    bio: 'Devi Nagar resident and welcoming front-desk manager at Karnataka Gym. Ensures safe check-ins and responsive member care.',
    rating: 4.96
  }
];

export const INITIAL_ADDONS = [
  {
    id: 'addon_pt_12',
    category: 'PT',
    title: '1-on-1 Personal Training (12 Sessions)',
    description: 'Personalized 12-session high-intensity training with posture checks, progressive load charts, and workout tracking.',
    price: 4500,
    unit: '12 Sessions (Valid 45 days)',
    trainerId: 'staff_1',
    trainerName: 'Anand Bellad',
    trainerBio: 'State Powerlifter & Certified S&C Coach',
    stockCapacity: 3, // available client slots
    cancellationTerms: 'Reschedule with 4-hour advance notice. Sessions non-refundable after 1st session.',
    badge: 'High Demand'
  },
  {
    id: 'addon_pt_women_12',
    category: 'PT',
    title: 'Safe Women PT & Hormone Balance (12 Sessions)',
    description: 'Tailored for women in our private, spacious workout area. PCOS management, safe core toning, and stamina building.',
    price: 4800,
    unit: '12 Sessions (Valid 45 days)',
    trainerId: 'staff_2',
    trainerName: 'Kavita Kalburgi',
    trainerBio: 'Women Fitness Specialist & ACE Certified',
    stockCapacity: 1, // only 1 slot left
    cancellationTerms: 'Female-only mentor session. Free rescheduling for cycle rest days.',
    badge: 'Exclusive'
  },
  {
    id: 'addon_diet_kavita',
    category: 'DIET',
    title: 'Hubli Wholesome High-Protein Nutrition Plan',
    description: 'Customized local North Karnataka macro plan (Jowar roti friendly, curd, paneer/egg/chicken options, hydration schedule).',
    price: 1200,
    unit: '6-Week Plan + 3 Bi-weekly Review Calls',
    trainerId: 'staff_2',
    trainerName: 'Kavita Kalburgi',
    trainerBio: 'Certified Clinical Sports Nutritionist',
    stockCapacity: 15,
    cancellationTerms: 'Tailored to your body composition. 100% custom, delivered within 48 hours.',
    badge: 'Popular'
  },
  {
    id: 'addon_supp_whey_1kg',
    category: 'SUPPLEMENT',
    title: 'Optimum Nutrition Gold Standard 100% Whey (1kg)',
    description: '24g protein per scoop, 5.5g BCAAs, Double Rich Chocolate. 100% authentic with scratch-and-verify barcode.',
    price: 3200,
    unit: '1kg Jar (30 Servings)',
    stockCapacity: 8, // exact stock
    cancellationTerms: 'Unopened jars returnable within 48 hours with receipt. Tamper seal intact.',
    badge: 'In Stock'
  },
  {
    id: 'addon_supp_creatine',
    category: 'SUPPLEMENT',
    title: 'Creapure Micronized Creatine Monohydrate (250g)',
    description: 'Pure 100% Creapure German grade creatine for explosive gym power, cellular hydration, and clean recovery.',
    price: 999,
    unit: '250g Pouch (83 Servings)',
    stockCapacity: 12,
    cancellationTerms: '100% authentic seal. Exchangeable if defective within 7 days.',
    badge: 'Best Seller'
  },
  {
    id: 'addon_supp_multivit',
    category: 'SUPPLEMENT',
    title: 'MuscleBlaze Daily Vital Multivitamin (60 Tabs)',
    description: 'Rich in zinc, magnesium, vitamin D3 & Ashwagandha extract. Ideal for heavy training days in Hubli summer.',
    price: 499,
    unit: '60 Tablets (2 Months)',
    stockCapacity: 0, // Out of stock example for edge case test!
    cancellationTerms: 'Currently restocking. Expected in 3 days.',
    badge: 'Out of Stock'
  }
];

// Helper to generate past/future dates relative to current local time (2026-11-05)
const baseDate = new Date('2026-11-05T08:00:00+05:30');

export const getOffsetDate = (daysOffset) => {
  const d = new Date(baseDate.getTime());
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const getOffsetDateTime = (daysOffset, hour = 7, min = 15) => {
  const d = new Date(baseDate.getTime());
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

// 30 Sample Members representing authentic Hubli / North Karnataka demographics
export const INITIAL_MEMBERS = [
  // --- 6 Members in Silent Churn / Red List (Absent 10 to 20 days) ---
  {
    id: 'mem_01',
    name: 'Basavaraj Patil',
    phone: '+91 94801 88301',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 94801 88399 (Wife)',
    joinedDate: '2025-08-10',
    preferredSlot: 'Evening 6-8 PM',
    assignedTrainerId: 'staff_1',
    status: 'active',
    planId: 'plan_6m',
    membershipExpiry: getOffsetDate(45), // expires in 45 days
    lastCheckIn: getOffsetDateTime(-14, 18, 45), // 14 days absent!
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Regular business owner in Devi Nagar. Used to train with friend Chetan.'
  },
  {
    id: 'mem_02',
    name: 'Priyanka Joshi',
    phone: '+91 98450 71234',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 98450 71230 (Mother)',
    joinedDate: '2026-02-15',
    preferredSlot: 'Women Special 11 AM - 1 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(25),
    lastCheckIn: getOffsetDateTime(-18, 11, 20), // 18 days absent!
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Bank employee at Vidyanagar. Missed sessions due to quarter-end audits.'
  },
  {
    id: 'mem_03',
    name: 'Raghavendra Hubballi',
    phone: '+91 99002 44109',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 99002 44100 (Brother)',
    joinedDate: '2025-11-20',
    preferredSlot: 'Morning 6-8 AM',
    assignedTrainerId: 'staff_3',
    status: 'active',
    planId: 'plan_12m',
    membershipExpiry: getOffsetDate(120),
    lastCheckIn: getOffsetDateTime(-12, 6, 45), // 12 days absent!
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Complained of minor knee twinge after deadlifts 2 weeks ago.'
  },
  {
    id: 'mem_04',
    name: 'Sneha Angadi',
    phone: '+91 97410 99823',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 97410 99800 (Father)',
    joinedDate: '2026-05-01',
    preferredSlot: 'Evening 5-7 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_6m',
    membershipExpiry: getOffsetDate(85),
    lastCheckIn: getOffsetDateTime(-16, 17, 30), // 16 days absent!
    commPreferences: { whatsapp: true, sms: false, reminders: true, marketingOptOut: false },
    notes: 'KLE Technological University engineering student. Exam season.'
  },
  {
    id: 'mem_05',
    name: 'Manjunath Hiremath',
    phone: '+91 98801 33490',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 98801 33499 (Friend)',
    joinedDate: '2026-01-10',
    preferredSlot: 'Morning 7-9 AM',
    assignedTrainerId: 'staff_1',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(35),
    lastCheckIn: getOffsetDateTime(-11, 7, 10), // 11 days absent!
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Travelling to Belagavi for business projects.'
  },
  {
    id: 'mem_06',
    name: 'Rekha Shettar',
    phone: '+91 94480 66211',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 94480 66200 (Spouse)',
    joinedDate: '2025-10-15',
    preferredSlot: 'Women Special 11 AM - 1 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_12m',
    membershipExpiry: getOffsetDate(190),
    lastCheckIn: getOffsetDateTime(-20, 11, 40), // 20 days absent!
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Loved the spacious female batch atmosphere; went to Bengaluru for family event.'
  },

  // --- 5 Members Expiring Within 7 Days (Renewal Pipeline) ---
  {
    id: 'mem_07',
    name: 'Soumya Belagavi',
    phone: '+91 96112 55091',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 96112 55000 (Sister)',
    joinedDate: '2026-08-08',
    preferredSlot: 'Women Special 11 AM - 1 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(2), // EXPIRES IN 2 DAYS!
    lastCheckIn: getOffsetDateTime(-1, 11, 30), // Active member!
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Attends 4 days a week consistently. Very likely to upgrade to 6-month pass.'
  },
  {
    id: 'mem_08',
    name: 'Praveen Deshpande',
    phone: '+91 97312 88419',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 97312 88400 (Wife)',
    joinedDate: '2025-11-07',
    preferredSlot: 'Morning 6-7:30 AM',
    assignedTrainerId: 'staff_1',
    status: 'active',
    planId: 'plan_12m',
    membershipExpiry: getOffsetDate(3), // EXPIRES IN 3 DAYS!
    lastCheckIn: getOffsetDateTime(0, 6, 30), // Checked in today!
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Powerlifter. Always renews annual pass for early-morning squat racks.'
  },
  {
    id: 'mem_09',
    name: 'Kiran Kalghatgi',
    phone: '+91 94811 00922',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 94811 00900 (Father)',
    joinedDate: '2026-05-10',
    preferredSlot: 'Evening 7-8:30 PM',
    assignedTrainerId: 'staff_3',
    status: 'active',
    planId: 'plan_6m',
    membershipExpiry: getOffsetDate(5), // EXPIRES IN 5 DAYS!
    lastCheckIn: getOffsetDateTime(-2, 19, 15),
    commPreferences: { whatsapp: true, sms: false, reminders: true, marketingOptOut: false },
    notes: 'IT consultant working from home in Devi Nagar.'
  },
  {
    id: 'mem_10',
    name: 'Deepa Savanur',
    phone: '+91 98440 22718',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd27150?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 98440 22700 (Husband)',
    joinedDate: '2026-10-06',
    preferredSlot: 'Women Special 10:30 AM - 12 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_1m',
    membershipExpiry: getOffsetDate(1), // EXPIRES TOMORROW!
    lastCheckIn: getOffsetDateTime(-1, 11, 0),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'First-time gym goer, completed 1 month with Coach Kavita. Very positive feedback.'
  },
  {
    id: 'mem_11',
    name: 'Suresh Shirahatti',
    phone: '+91 99860 11984',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 99860 11900 (Brother)',
    joinedDate: '2026-08-12',
    preferredSlot: 'Morning 6:30-8 AM',
    assignedTrainerId: 'staff_1',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(7), // EXPIRES IN 7 DAYS!
    lastCheckIn: getOffsetDateTime(-3, 7, 0),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Interested in PT bundle with renewal.'
  },

  // --- 19 Other Active, Paused, or High-Performing Members ---
  {
    id: 'mem_12',
    name: 'Ananya Kulkarni',
    phone: '+91 96633 12901',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 96633 12999 (Mother)',
    joinedDate: '2026-01-05',
    preferredSlot: 'Evening 6-7:30 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_12m',
    membershipExpiry: getOffsetDate(180),
    lastCheckIn: getOffsetDateTime(0, 7, 20), // Checked in today!
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Star gym member! Current streak 18 days.'
  },
  {
    id: 'mem_13',
    name: 'Chetan Dharwad',
    phone: '+91 94490 88204',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 94490 88200 (Friend)',
    joinedDate: '2026-03-12',
    preferredSlot: 'Morning 7-8:30 AM',
    assignedTrainerId: 'staff_1',
    status: 'paused', // APPROVED PAUSE CASE!
    pauseStart: getOffsetDate(-6),
    pauseEnd: getOffsetDate(8),
    pauseReason: 'Doctor advised rest for sprained left ankle. Medical certificate submitted.',
    planId: 'plan_6m',
    membershipExpiry: getOffsetDate(90),
    lastCheckIn: getOffsetDateTime(-7, 7, 45),
    commPreferences: { whatsapp: true, sms: false, reminders: true, marketingOptOut: false },
    notes: 'Fair streak protected during approved pause.'
  },
  {
    id: 'mem_14',
    name: 'Shruti Kundgol',
    phone: '+91 98455 12093',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 98455 12000 (Husband)',
    joinedDate: '2026-04-18',
    preferredSlot: 'Women Special 11 AM - 1 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_6m',
    membershipExpiry: getOffsetDate(110),
    lastCheckIn: getOffsetDateTime(0, 11, 15),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Active PT client under Kavita.'
  },
  {
    id: 'mem_15',
    name: 'Ganesh Navalgund',
    phone: '+91 99011 77284',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 99011 77200 (Father)',
    joinedDate: '2026-02-01',
    preferredSlot: 'Morning 6-7:30 AM',
    assignedTrainerId: 'staff_3',
    status: 'active',
    planId: 'plan_12m',
    membershipExpiry: getOffsetDate(210),
    lastCheckIn: getOffsetDateTime(0, 6, 25),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Consistently trains Mon, Wed, Fri, Sat.'
  },
  {
    id: 'mem_16',
    name: 'Aishwarya Haliyal',
    phone: '+91 97390 44512',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 97390 44500 (Mother)',
    joinedDate: '2026-06-15',
    preferredSlot: 'Evening 5-6:30 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(60),
    lastCheckIn: getOffsetDateTime(-1, 17, 40),
    commPreferences: { whatsapp: true, sms: false, reminders: false, marketingOptOut: true }, // OPTED OUT!
    notes: 'Strict marketing opt-out requested. Do not send promotional SMS.'
  },
  {
    id: 'mem_17',
    name: 'Naveen Gadag',
    phone: '+91 94820 99182',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 94820 99100 (Wife)',
    joinedDate: '2025-12-01',
    preferredSlot: 'Evening 7-8:30 PM',
    assignedTrainerId: 'staff_1',
    status: 'active',
    planId: 'plan_12m',
    membershipExpiry: getOffsetDate(150),
    lastCheckIn: getOffsetDateTime(0, 19, 0),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Purchased Whey Protein supplement package.'
  },
  {
    id: 'mem_18',
    name: 'Pooja Ranebennur',
    phone: '+91 98452 88471',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 98452 88400 (Husband)',
    joinedDate: '2026-07-20',
    preferredSlot: 'Women Special 10:30 AM - 12 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_6m',
    membershipExpiry: getOffsetDate(140),
    lastCheckIn: getOffsetDateTime(0, 10, 45),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Devi Nagar resident, praises the clean air and safety for women.'
  },
  {
    id: 'mem_19',
    name: 'Santosh Badami',
    phone: '+91 99020 33418',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 99020 33400 (Brother)',
    joinedDate: '2026-03-01',
    preferredSlot: 'Morning 6-7:30 AM',
    assignedTrainerId: 'staff_3',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(50),
    lastCheckIn: getOffsetDateTime(-1, 6, 50),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Regular morning cross-trainer.'
  },
  {
    id: 'mem_20',
    name: 'Vidya Bagalkot',
    phone: '+91 96320 77192',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 96320 77100 (Father)',
    joinedDate: '2026-09-01',
    preferredSlot: 'Women Special 11 AM - 1 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(55),
    lastCheckIn: getOffsetDateTime(0, 11, 25),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Joined after doctor recommended strength training for bone density.'
  },
  {
    id: 'mem_21',
    name: 'Vinayak Ron',
    phone: '+91 97420 55182',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 97420 55100 (Wife)',
    joinedDate: '2026-04-10',
    preferredSlot: 'Evening 6-7:30 PM',
    assignedTrainerId: 'staff_1',
    status: 'active',
    planId: 'plan_6m',
    membershipExpiry: getOffsetDate(125),
    lastCheckIn: getOffsetDateTime(-2, 18, 10),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Interested in Diet consultation with Coach Kavita.'
  },
  {
    id: 'mem_22',
    name: 'Geeta Yalavigi',
    phone: '+91 94481 44028',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 94481 44000 (Spouse)',
    joinedDate: '2026-05-20',
    preferredSlot: 'Women Special 10:30 AM - 12 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_6m',
    membershipExpiry: getOffsetDate(75),
    lastCheckIn: getOffsetDateTime(0, 10, 50),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Teacher at Hubli Rotary School.'
  },
  {
    id: 'mem_23',
    name: 'Mallikarjun Mundargi',
    phone: '+91 98860 77123',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 98860 77100 (Brother)',
    joinedDate: '2026-02-14',
    preferredSlot: 'Morning 6:30-8 AM',
    assignedTrainerId: 'staff_1',
    status: 'active',
    planId: 'plan_12m',
    membershipExpiry: getOffsetDate(230),
    lastCheckIn: getOffsetDateTime(-1, 6, 45),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Takes morning steam bath every Saturday.'
  },
  {
    id: 'mem_24',
    name: 'Neelam Hangal',
    phone: '+91 96110 33819',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 96110 33800 (Father)',
    joinedDate: '2026-07-01',
    preferredSlot: 'Evening 5-6:30 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(40),
    lastCheckIn: getOffsetDateTime(0, 17, 15),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Passionate badminton player doing off-court conditioning.'
  },
  {
    id: 'mem_25',
    name: 'Abhishek Shiraguppi',
    phone: '+91 97401 22981',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 97401 22900 (Mother)',
    joinedDate: '2026-08-01',
    preferredSlot: 'Evening 7-8:30 PM',
    assignedTrainerId: 'staff_3',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(28),
    lastCheckIn: getOffsetDateTime(-1, 19, 10),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Joined to build stamina for police sub-inspector physical exam.'
  },
  {
    id: 'mem_26',
    name: 'Kavya Tadas',
    phone: '+91 94830 11293',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 94830 11200 (Sister)',
    joinedDate: '2026-06-25',
    preferredSlot: 'Women Special 11 AM - 1 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_6m',
    membershipExpiry: getOffsetDate(100),
    lastCheckIn: getOffsetDateTime(0, 11, 40),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Loves the spacious floor with dedicated dumbbells for women.'
  },
  {
    id: 'mem_27',
    name: 'Shankar Annigeri',
    phone: '+91 98459 44102',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 98459 44100 (Wife)',
    joinedDate: '2025-10-01',
    preferredSlot: 'Morning 6-7:30 AM',
    assignedTrainerId: 'staff_1',
    status: 'active',
    planId: 'plan_12m',
    membershipExpiry: getOffsetDate(160),
    lastCheckIn: getOffsetDateTime(0, 6, 15),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Senior government official. Has not missed a workout in 6 months.'
  },
  {
    id: 'mem_28',
    name: 'Lata Kalghatgi',
    phone: '+91 99009 55219',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 99009 55200 (Husband)',
    joinedDate: '2026-07-15',
    preferredSlot: 'Women Special 10:30 AM - 12 PM',
    assignedTrainerId: 'staff_2',
    status: 'active',
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(20),
    lastCheckIn: getOffsetDateTime(-2, 10, 45),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Active participant in weekend flexibility and mobility clinics.'
  },
  {
    id: 'mem_29',
    name: 'Darshan Alnavar',
    phone: '+91 97419 88310',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 97419 88300 (Father)',
    joinedDate: '2026-09-10',
    preferredSlot: 'Evening 6-7:30 PM',
    assignedTrainerId: 'staff_3',
    status: 'active',
    planId: 'plan_1m',
    membershipExpiry: getOffsetDate(12),
    lastCheckIn: getOffsetDateTime(0, 18, 30),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'College student. Working on basic push/pull routine.'
  },
  {
    id: 'mem_30',
    name: 'Sunil Bailhongal',
    phone: '+91 98809 11204',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&auto=format&fit=crop&q=75',
    emergencyContact: '+91 98809 11200 (Brother)',
    joinedDate: '2026-01-20',
    preferredSlot: 'Morning 7-8:30 AM',
    assignedTrainerId: 'staff_1',
    status: 'expired', // EXPIRED MEMBERSHIP CASE FOR EDGE TESTING
    planId: 'plan_3m',
    membershipExpiry: getOffsetDate(-4), // Expired 4 days ago
    lastCheckIn: getOffsetDateTime(-5, 7, 15),
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    notes: 'Membership lapsed 4 days ago. Eligible for 1-tap quick renewal.'
  }
];

// Initial Streaks Data
export const INITIAL_STREAKS = {
  mem_12: {
    memberId: 'mem_12',
    currentStreakDays: 18,
    bestStreakDays: 24,
    weeklyGoalDays: 5,
    weeklyVisitsCompleted: 4,
    plannedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    lastVisitDate: getOffsetDate(0),
    isFairStreakPreserved: true,
    streakHistory: ['Mon (Attended)', 'Tue (Attended)', 'Wed (Attended)', 'Thu (Attended Today)']
  },
  mem_08: {
    memberId: 'mem_08',
    currentStreakDays: 14,
    bestStreakDays: 32,
    weeklyGoalDays: 4,
    weeklyVisitsCompleted: 3,
    plannedDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    lastVisitDate: getOffsetDate(0),
    isFairStreakPreserved: true,
    streakHistory: ['Mon (Attended)', 'Tue (Attended)', 'Wed (Planned Rest Day - Preserved)', 'Thu (Attended Today)']
  },
  mem_13: {
    memberId: 'mem_13',
    currentStreakDays: 9,
    bestStreakDays: 15,
    weeklyGoalDays: 4,
    weeklyVisitsCompleted: 0,
    plannedDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    lastVisitDate: getOffsetDate(-7),
    protectedUntil: getOffsetDate(8),
    isFairStreakPreserved: true,
    streakHistory: ['Approved Medical Pause Active - Streak Frozen at 9 Days Safe']
  },
  mem_07: {
    memberId: 'mem_07',
    currentStreakDays: 7,
    bestStreakDays: 12,
    weeklyGoalDays: 4,
    weeklyVisitsCompleted: 3,
    plannedDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    lastVisitDate: getOffsetDate(-1),
    isFairStreakPreserved: true,
    streakHistory: ['Mon (Attended)', 'Tue (Rest)', 'Wed (Attended)', 'Thu (Rest)']
  },
  // Red list members have 0 active streak
  mem_01: {
    memberId: 'mem_01',
    currentStreakDays: 0,
    bestStreakDays: 16,
    weeklyGoalDays: 4,
    weeklyVisitsCompleted: 0,
    plannedDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    lastVisitDate: getOffsetDate(-14),
    isFairStreakPreserved: false
  }
};

// Initial No-Show Cases for the 6 absent members
export const INITIAL_NO_SHOW_CASES = [
  {
    id: 'case_01',
    memberId: 'mem_01',
    openedAt: getOffsetDateTime(-4, 6, 0),
    daysAbsent: 14,
    thresholdDays: 10,
    status: 'OPEN',
    assignedTrainerId: 'staff_1',
    riskScore: 'HIGH',
    lastFollowUpDate: null,
    historyNotes: 'Automatic scan opened case. Crossed 10-day threshold.'
  },
  {
    id: 'case_02',
    memberId: 'mem_02',
    openedAt: getOffsetDateTime(-8, 6, 0),
    daysAbsent: 18,
    thresholdDays: 10,
    status: 'FOLLOWED_UP',
    assignedTrainerId: 'staff_2',
    riskScore: 'HIGH',
    lastFollowUpDate: getOffsetDateTime(-2, 14, 30),
    historyNotes: 'Coach Kavita called. Member said bank audit week, promised to return next Monday.'
  },
  {
    id: 'case_03',
    memberId: 'mem_03',
    openedAt: getOffsetDateTime(-2, 6, 0),
    daysAbsent: 12,
    thresholdDays: 10,
    status: 'OPEN',
    assignedTrainerId: 'staff_3',
    riskScore: 'MEDIUM',
    lastFollowUpDate: null,
    historyNotes: 'Automatic scan opened case.'
  },
  {
    id: 'case_04',
    memberId: 'mem_04',
    openedAt: getOffsetDateTime(-6, 6, 0),
    daysAbsent: 16,
    thresholdDays: 10,
    status: 'OPEN',
    assignedTrainerId: 'staff_2',
    riskScore: 'HIGH',
    lastFollowUpDate: null,
    historyNotes: 'Automatic scan opened case.'
  },
  {
    id: 'case_05',
    memberId: 'mem_05',
    openedAt: getOffsetDateTime(-1, 6, 0),
    daysAbsent: 11,
    thresholdDays: 10,
    status: 'OPEN',
    assignedTrainerId: 'staff_1',
    riskScore: 'MEDIUM',
    lastFollowUpDate: null,
    historyNotes: 'Automatic scan opened case.'
  },
  {
    id: 'case_06',
    memberId: 'mem_06',
    openedAt: getOffsetDateTime(-10, 6, 0),
    daysAbsent: 20,
    thresholdDays: 10,
    status: 'FOLLOWED_UP',
    assignedTrainerId: 'staff_2',
    riskScore: 'HIGH',
    lastFollowUpDate: getOffsetDateTime(-5, 11, 0),
    historyNotes: 'WhatsApp sent. In Bengaluru for family wedding.'
  }
];

export const INITIAL_FOLLOW_UPS = [
  {
    id: 'fol_01',
    caseId: 'case_02',
    memberId: 'mem_02',
    staffId: 'staff_2',
    channel: 'CALL',
    outcome: 'Travelling',
    nextActionDate: getOffsetDate(4),
    notes: 'Member is on official audit tour in Dharwad branch. Confirmed return on Monday.',
    loggedAt: getOffsetDateTime(-2, 14, 30)
  },
  {
    id: 'fol_02',
    caseId: 'case_06',
    memberId: 'mem_06',
    staffId: 'staff_2',
    channel: 'WHATSAPP',
    outcome: 'Will return',
    nextActionDate: getOffsetDate(2),
    notes: 'Responded kindly: will resume morning female batch as soon as back in Hubli.',
    loggedAt: getOffsetDateTime(-5, 11, 0)
  }
];

// Initial Attendance Records
export const INITIAL_ATTENDANCE = [
  {
    id: 'att_01',
    memberId: 'mem_12',
    checkInTime: getOffsetDateTime(0, 7, 20),
    method: 'MEMBER_QR',
    verifiedBy: 'GATE_01_SCANNER',
    notes: 'Session token valid',
    streakBumped: true
  },
  {
    id: 'att_02',
    memberId: 'mem_08',
    checkInTime: getOffsetDateTime(0, 6, 30),
    method: 'MEMBER_QR',
    verifiedBy: 'GATE_01_SCANNER',
    notes: 'Session token valid',
    streakBumped: true
  },
  {
    id: 'att_03',
    memberId: 'mem_15',
    checkInTime: getOffsetDateTime(0, 6, 25),
    method: 'FRONT_DESK_ASSISTED',
    verifiedBy: 'staff_4',
    assistedReason: 'Forgot mobile phone at home',
    notes: 'Front-desk assisted entry verified by Sunita',
    streakBumped: true
  },
  {
    id: 'att_04',
    memberId: 'mem_18',
    checkInTime: getOffsetDateTime(0, 10, 45),
    method: 'MEMBER_QR',
    verifiedBy: 'GATE_01_SCANNER',
    notes: 'Women batch turnstile check-in',
    streakBumped: true
  },
  {
    id: 'att_05',
    memberId: 'mem_20',
    checkInTime: getOffsetDateTime(0, 11, 25),
    method: 'MEMBER_QR',
    verifiedBy: 'GATE_01_SCANNER',
    notes: 'Women batch turnstile check-in',
    streakBumped: true
  },
  {
    id: 'att_06',
    memberId: 'mem_22',
    checkInTime: getOffsetDateTime(0, 10, 50),
    method: 'MEMBER_QR',
    verifiedBy: 'GATE_01_SCANNER',
    notes: 'Morning session valid',
    streakBumped: true
  },
  {
    id: 'att_07',
    memberId: 'mem_26',
    checkInTime: getOffsetDateTime(0, 11, 40),
    method: 'MEMBER_QR',
    verifiedBy: 'GATE_01_SCANNER',
    notes: 'Women batch turnstile check-in',
    streakBumped: true
  },
  {
    id: 'att_08',
    memberId: 'mem_27',
    checkInTime: getOffsetDateTime(0, 6, 15),
    method: 'MEMBER_QR',
    verifiedBy: 'GATE_01_SCANNER',
    notes: 'Early morning session',
    streakBumped: true
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'pay_01',
    orderId: 'ord_ren_01',
    memberId: 'mem_12',
    amount: 11000,
    currency: 'INR',
    method: 'UPI',
    gatewayReference: 'upi_hubli_92019402',
    status: 'PAID',
    verifiedAt: getOffsetDateTime(-10, 15, 30),
    receiptNumber: 'KG-REC-2026-0891',
    failureReason: null
  },
  {
    id: 'pay_02',
    orderId: 'ord_add_01',
    memberId: 'mem_17',
    amount: 3200,
    currency: 'INR',
    method: 'CARD',
    gatewayReference: 'card_razor_88192834',
    status: 'PAID',
    verifiedAt: getOffsetDateTime(-3, 18, 0),
    receiptNumber: 'KG-REC-2026-0914',
    failureReason: null
  }
];

export const INITIAL_ADDON_ORDERS = [
  {
    id: 'ord_add_01',
    memberId: 'mem_17',
    addOnId: 'addon_supp_whey_1kg',
    quantity: 1,
    amountPaid: 3200,
    paymentStatus: 'PAID',
    fulfillmentStatus: 'DELIVERED',
    orderedAt: getOffsetDateTime(-3, 18, 0)
  },
  {
    id: 'ord_add_02',
    memberId: 'mem_14',
    addOnId: 'addon_pt_women_12',
    quantity: 1,
    amountPaid: 4800,
    paymentStatus: 'PAID',
    fulfillmentStatus: 'ACTIVE_SESSIONS',
    sessionsTotal: 12,
    sessionsCompleted: 4,
    orderedAt: getOffsetDateTime(-12, 10, 0)
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_01',
    memberId: 'mem_07',
    channel: 'WHATSAPP',
    category: 'RENEWAL_REMINDER',
    title: 'Karnataka Gym Hubli: Membership Expiring in 2 Days',
    message: 'Namaskara Soumya! Your 3-Month Quarterly Momentum pass expires on ' + getOffsetDate(2) + '. Renew today to protect your 7-day workout streak and lock in the Hubli member rate!',
    sentAt: getOffsetDateTime(0, 8, 30),
    status: 'SENT'
  },
  {
    id: 'notif_02',
    memberId: 'mem_08',
    channel: 'WHATSAPP',
    category: 'RENEWAL_REMINDER',
    title: 'Membership Renewal Notice (3 Days Left)',
    message: 'Hello Praveen, your Annual Champion Pass at Karnataka Gym, Devi Nagar is due for renewal on ' + getOffsetDate(3) + '. Keep your squat rack slot active!',
    sentAt: getOffsetDateTime(-1, 9, 0),
    status: 'SENT'
  }
];

export const INITIAL_SETTINGS = {
  noShowThresholdDays: 10,
  renewalNoticeDays: [14, 7, 3, 0],
  qrRotationIntervalSecs: 15,
  duplicateScanLockoutMinutes: 120, // 2-hour duplicate lock
  allowOfflineSync: true,
  gymName: 'Karnataka Gym Fitness Centre',
  address: 'Devi Nagar, Hubli - 580031',
  operatingHours: '6:00 AM - 9:00 PM',
  womenSafeHours: '10:30 AM - 1:00 PM and 4:30 PM - 6:00 PM',
  rating: 4.9,
  totalReviews: 642,
  supportPhone: '+91 96633 96058'
};

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud_01',
    timestamp: getOffsetDateTime(0, 6, 0),
    actorId: 'SYSTEM_CRON',
    actorRole: 'SYSTEM_CRON',
    actionType: 'NO_SHOW_SCANNED',
    details: 'Daily 6:00 AM silent churn scan completed. 6 active cases monitored. Excluded paused member mem_13.',
    ipOrTerminal: 'CronJob-01'
  },
  {
    id: 'aud_02',
    timestamp: getOffsetDateTime(0, 6, 25),
    actorId: 'staff_4',
    actorRole: 'FRONT_DESK',
    actionType: 'ATTENDANCE_ASSISTED',
    details: 'Front-desk assisted check-in for Ganesh Navalgund (mem_15). Reason: "Forgot mobile phone at home".',
    ipOrTerminal: 'Desk-Terminal-Hubli'
  },
  {
    id: 'aud_03',
    timestamp: getOffsetDateTime(-6, 12, 10),
    actorId: 'staff_4',
    actorRole: 'FRONT_DESK',
    actionType: 'MEMBERSHIP_PAUSE',
    details: 'Approved 14-day medical pause for Chetan Dharwad (mem_13) with doctor certificate. Streaks protected.',
    ipOrTerminal: 'Desk-Terminal-Hubli'
  }
];

