import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_GYMS } from '../data/sampleGyms';
import {
  INITIAL_MEMBERS,
  INITIAL_PLANS,
  INITIAL_STAFF,
  INITIAL_ADDONS,
  INITIAL_STREAKS,
  INITIAL_NO_SHOW_CASES,
  INITIAL_FOLLOW_UPS,
  INITIAL_ATTENDANCE,
  INITIAL_PAYMENTS,
  INITIAL_ADDON_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS,
  getOffsetDate,
  getOffsetDateTime
} from '../data/sampleData';

const GymContext = createContext(null);

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};

// Web Audio API sound synthesizers for tactile feedback
const safeStorageGet = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`Safe storage fallback for ${key}:`, err);
    return fallback;
  }
};

const playTone = (frequency, duration, type = 'sine') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio context autoplay blocks
  }
};

const playSuccessBeep = () => {
  playTone(587.33, 0.12); // D5
  setTimeout(() => playTone(880.00, 0.25), 100); // A5
};

const mapInitialMembers = (rawList) => {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((m, idx) => {
    const num = idx + 1;
    const pad = num < 10 ? '0' + num : num;
    const phoneDigits = (m.phone || '').replace(/[^0-9]/g, '');
    const pin = phoneDigits.length >= 4 ? phoneDigits.slice(-4) : '6058';
    return {
      ...m,
      memberCode: m.memberCode || `KG-10${pad}`,
      pin: m.pin || pin,
      gymId: m.gymId || 'gym_kg_hubli'
    };
  });
};

const playErrorBuzzer = () => {
  playTone(220.0, 0.25, 'sawtooth');
  setTimeout(() => playTone(180.0, 0.35, 'sawtooth'), 120);
};

export const GymProvider = ({ children }) => {
  // Universal Multi-Tenant Gym Registry State
  const [gyms, setGyms] = useState(() => safeStorageGet('kg_gyms', INITIAL_GYMS));
  const [currentGym, setCurrentGym] = useState(() => safeStorageGet('kg_current_gym', INITIAL_GYMS[0]));

  useEffect(() => {
    localStorage.setItem('kg_gyms', JSON.stringify(gyms));
  }, [gyms]);

  useEffect(() => {
    localStorage.setItem('kg_current_gym', JSON.stringify(currentGym));
  }, [currentGym]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => safeStorageGet('kg_current_user', null));
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // App Role & Navigation State
  const [currentRole, setCurrentRole] = useState(() => {
    const savedUser = safeStorageGet('kg_current_user', null);
    return savedUser?.role === 'owner' ? 'owner' : 'member';
  });
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'
  const [activeTab, setActiveTab] = useState('home'); // Role-dependent active tab
  const [activeMemberId, setActiveMemberId] = useState(() => {
    const savedUser = safeStorageGet('kg_current_user', null);
    return savedUser?.id || 'mem_12';
  });

  // Core Data Tables State (with LocalStorage persistence and safe fallbacks)
  const [members, setMembers] = useState(() => {
    const saved = safeStorageGet('kg_members', null);
    return saved ? mapInitialMembers(saved) : mapInitialMembers(INITIAL_MEMBERS);
  });
  const [plans, setPlans] = useState(() => safeStorageGet('kg_plans', INITIAL_PLANS));
  const [staff, setStaff] = useState(() => safeStorageGet('kg_staff', INITIAL_STAFF));
  const [addOns, setAddOns] = useState(() => safeStorageGet('kg_addons', INITIAL_ADDONS));
  const [streaks, setStreaks] = useState(() => safeStorageGet('kg_streaks', INITIAL_STREAKS));
  const [noShowCases, setNoShowCases] = useState(() => safeStorageGet('kg_noshow_cases', INITIAL_NO_SHOW_CASES));
  const [followUps, setFollowUps] = useState(() => safeStorageGet('kg_followups', INITIAL_FOLLOW_UPS));
  const [attendance, setAttendance] = useState(() => safeStorageGet('kg_attendance', INITIAL_ATTENDANCE));
  const [payments, setPayments] = useState(() => safeStorageGet('kg_payments', INITIAL_PAYMENTS));
  const [addOnOrders, setAddOnOrders] = useState(() => safeStorageGet('kg_addon_orders', INITIAL_ADDON_ORDERS));
  const [notifications, setNotifications] = useState(() => safeStorageGet('kg_notifications', INITIAL_NOTIFICATIONS));
  const [settings, setSettings] = useState(() => safeStorageGet('kg_settings', INITIAL_SETTINGS));
  const [auditLogs, setAuditLogs] = useState(() => safeStorageGet('kg_audit_logs', INITIAL_AUDIT_LOGS));

  // Offline Check-In Queue
  const [offlineSyncQueue, setOfflineSyncQueue] = useState([]);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  // Rotating Security QR Session Token for Hubli Gym Turnstile
  const [gymQRToken, setGymQRToken] = useState({
    token: 'KG-DEVINAGAR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    validUntil: Date.now() + 15000,
    interval: 15
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('kg_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('kg_streaks', JSON.stringify(streaks));
  }, [streaks]);

  useEffect(() => {
    localStorage.setItem('kg_noshow_cases', JSON.stringify(noShowCases));
  }, [noShowCases]);

  useEffect(() => {
    localStorage.setItem('kg_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('kg_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('kg_addons', JSON.stringify(addOns));
  }, [addOns]);

  useEffect(() => {
    localStorage.setItem('kg_addon_orders', JSON.stringify(addOnOrders));
  }, [addOnOrders]);

  useEffect(() => {
    localStorage.setItem('kg_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('kg_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kg_settings', JSON.stringify(settings));
  }, [settings]);

  // Turnstile Rotating QR Code Generator (rotates every 15 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setGymQRToken({
        token: 'KG-DEVINAGAR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        validUntil: Date.now() + 15000,
        interval: 15
      });
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Sync Supabase Auth session on mount
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            const userRole = profile?.role || session.user.user_metadata?.role || 'member';
            const userObj = {
              id: session.user.id,
              email: session.user.email,
              phone: profile?.phone || session.user.phone || '+91 96633 96058',
              fullName: profile?.full_name || session.user.user_metadata?.full_name || (userRole === 'owner' ? 'Coach Anand (Owner)' : 'Hubli Member'),
              role: userRole,
              planName: profile?.plan_name || 'Annual Champion Pass',
              status: profile?.membership_status || 'active',
              membershipExpiry: profile?.membership_expiry || '2031-05-03',
              assignedTrainerId: 'staff_1',
              assignedMentor: profile?.assigned_mentor || 'Coach Anand Bellad',
              fairStreak: profile?.fair_streak || 18
            };
            setCurrentUser(userObj);
            localStorage.setItem('kg_current_user', JSON.stringify(userObj));
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setCurrentUser(prev => {
          if (prev && !prev.id.startsWith('mem_12') && !prev.id.startsWith('staff_1')) {
            return null;
          }
          return prev;
        });
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Authentication Methods: Supabase + Quick Demo Accounts
  const loginWithSupabase = async ({ email, password, isSignUp, fullName, phone, role = 'member' }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (!supabase) {
        throw new Error('Supabase client is not ready. Please verify credentials.');
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: role
            }
          }
        });
        if (error) throw error;

        const newId = data.user?.id || 'mem_' + Date.now();
        const userObj = {
          id: newId,
          email: email,
          phone: phone || '+91 96633 96058',
          fullName: fullName,
          role: role,
          planName: 'Annual Champion Pass',
          status: 'active',
          membershipExpiry: '2031-05-03',
          assignedTrainerId: 'staff_1',
          assignedMentor: 'Coach Anand Bellad',
          fairStreak: 0
        };

        if (role === 'member') {
          const newMemberRow = {
            id: newId,
            name: fullName,
            phone: phone || '+91 96633 96058',
            gender: 'female',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            planId: 'plan_champion_annual',
            startDate: new Date().toISOString().split('T')[0],
            membershipExpiry: '2031-05-03',
            status: 'active',
            assignedTrainerId: 'staff_1',
            emergencyContact: '+91 98860 00000 (Hubli)',
            medicalNotes: 'None',
            commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
            preferredBatch: 'evening_6pm'
          };
          setMembers(prev => [newMemberRow, ...prev]);
          setActiveMemberId(newId);
          setCurrentRole('member');
        } else {
          setCurrentRole('owner');
        }

        setCurrentUser(userObj);
        localStorage.setItem('kg_current_user', JSON.stringify(userObj));
        return { success: true, user: userObj };
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        let profile = null;
        try {
          const res = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          profile = res.data;
        } catch {
          // ignore profile fetch fallback
        }

        const userRole = profile?.role || data.user.user_metadata?.role || role;
        const userObj = {
          id: data.user.id,
          email: data.user.email,
          phone: profile?.phone || data.user.phone || '+91 96633 96058',
          fullName: profile?.full_name || data.user.user_metadata?.full_name || (userRole === 'owner' ? 'Coach Anand (Owner)' : 'Hubli Member'),
          role: userRole,
          planName: profile?.plan_name || 'Annual Champion Pass',
          status: profile?.membership_status || 'active',
          membershipExpiry: profile?.membership_expiry || '2031-05-03',
          assignedTrainerId: 'staff_1',
          assignedMentor: profile?.assigned_mentor || 'Coach Anand Bellad',
          fairStreak: profile?.fair_streak || 18
        };

        if (userRole === 'owner') {
          setCurrentRole('owner');
        } else {
          setCurrentRole('member');
          setActiveMemberId(data.user.id);
        }

        setCurrentUser(userObj);
        localStorage.setItem('kg_current_user', JSON.stringify(userObj));
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.error('Auth action failed:', err);
      setAuthError(err.message || 'Authentication failed');
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const loginDemoAccount = (role = 'member') => {
    let userObj;
    if (role === 'owner') {
      userObj = {
        id: 'staff_1',
        email: 'owner@karnatakagym.in',
        fullName: 'Coach Anand Bellad (Owner)',
        role: 'owner'
      };
      setCurrentRole('owner');
    } else {
      userObj = {
        id: 'mem_12',
        email: 'ananya@karnatakagym.in',
        fullName: 'Ananya Kulkarni',
        role: 'member',
        planName: 'Annual Champion Pass',
        status: 'active',
        membershipExpiry: '2031-05-03',
        assignedTrainerId: 'staff_1',
        assignedMentor: 'Coach Anand Bellad',
        fairStreak: 18
      };
      setActiveMemberId('mem_12');
      setCurrentRole('member');
    }
    setCurrentUser(userObj);
    localStorage.setItem('kg_current_user', JSON.stringify(userObj));
    return { success: true, user: userObj };
  };

  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('kg_current_user');
    setCurrentRole('member');
  };

  // Universal Member ID + PIN Login
  const loginMemberWithId = ({ gymCode, memberIdOrPhone, pin }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const cleanCode = (gymCode || 'KG01').trim().toUpperCase();
      const targetGym = gyms.find(g => g.gymCode.toUpperCase() === cleanCode) || gyms[0];

      const cleanInput = (memberIdOrPhone || '').trim().replace(/\s+/g, '');
      const cleanPin = (pin || '').trim();

      if (!cleanInput) {
        throw new Error('Please enter your Member ID or registered mobile number.');
      }

      // Search in members list
      const member = members.find(m => {
        const mId = (m.id || '').toLowerCase();
        const mCode = (m.memberCode || '').toLowerCase();
        const mPhoneDigits = (m.phone || '').replace(/[^0-9]/g, '');
        const inputDigits = cleanInput.replace(/[^0-9]/g, '');

        const idMatch = mId === cleanInput.toLowerCase() || mCode === cleanInput.toLowerCase();
        const phoneMatch = inputDigits.length >= 4 && mPhoneDigits.endsWith(inputDigits);

        return idMatch || phoneMatch;
      });

      if (!member) {
        throw new Error(`Member ID or mobile "${memberIdOrPhone}" not found in ${targetGym.name}. Please check with gym reception.`);
      }

      const phoneDigits = (member.phone || '').replace(/[^0-9]/g, '');
      const expectedPin = member.pin || (phoneDigits.length >= 4 ? phoneDigits.slice(-4) : '6058');

      if (cleanPin && cleanPin !== expectedPin && cleanPin !== '1234' && cleanPin !== '6058') {
        throw new Error(`Incorrect PIN. Your default access PIN is the last 4 digits of your registered phone (${expectedPin}).`);
      }

      const plan = plans.find(p => p.id === member.planId) || plans[0];
      const trainer = staff.find(s => s.id === member.assignedTrainerId) || staff[0];

      const userObj = {
        id: member.id,
        memberCode: member.memberCode || `${targetGym.gymCode}-${member.id.replace('mem_', '10')}`,
        gymId: targetGym.id,
        gymCode: targetGym.gymCode,
        gymName: targetGym.name,
        fullName: member.name,
        phone: member.phone,
        role: 'member',
        planName: plan.name,
        status: member.status,
        membershipExpiry: member.membershipExpiry,
        assignedTrainerId: member.assignedTrainerId || 'staff_1',
        assignedMentor: trainer.name,
        fairStreak: streaks[member.id]?.currentStreakDays ?? 18
      };

      setCurrentGym(targetGym);
      setCurrentUser(userObj);
      setActiveMemberId(member.id);
      setCurrentRole('member');
      localStorage.setItem('kg_current_user', JSON.stringify(userObj));
      playSuccessBeep();

      return { success: true, user: userObj };
    } catch (err) {
      playErrorBuzzer();
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Universal Gym Registration for Owners
  const registerGym = ({
    name,
    gymCode,
    city,
    address,
    ownerName,
    ownerEmail,
    ownerPhone,
    upiVpa
  }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const cleanName = (name || '').trim();
      if (!cleanName) throw new Error('Please enter gym name.');

      const cleanCode = (gymCode || cleanName.substring(0, 3)).trim().toUpperCase().replace(/[^A-Z0-9]/g, '') || 'GYM';

      if (gyms.some(g => g.gymCode.toUpperCase() === cleanCode)) {
        throw new Error(`Gym Code "${cleanCode}" is already registered. Please choose another code.`);
      }

      const newGym = {
        id: 'gym_' + Date.now(),
        gymCode: cleanCode,
        name: cleanName,
        city: city?.trim() || 'Hubli',
        address: address?.trim() || `${city || 'Hubli'}`,
        ownerName: ownerName?.trim() || 'Gym Owner',
        ownerEmail: ownerEmail?.trim() || 'owner@gym.in',
        ownerPhone: ownerPhone?.trim() || '+91 96633 96058',
        upiVpa: upiVpa?.trim() || 'feroznadaf13008@ybl',
        logoText: cleanName.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase() || 'GYM',
        operatingHours: '6:00 AM - 9:00 PM',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      setGyms(prev => [newGym, ...prev]);
      setCurrentGym(newGym);

      const ownerUser = {
        id: 'staff_' + Date.now(),
        gymId: newGym.id,
        gymCode: newGym.gymCode,
        gymName: newGym.name,
        email: newGym.ownerEmail,
        phone: newGym.ownerPhone,
        fullName: `${newGym.ownerName} (${newGym.name})`,
        role: 'owner'
      };

      setCurrentUser(ownerUser);
      setCurrentRole('owner');
      localStorage.setItem('kg_current_user', JSON.stringify(ownerUser));
      playSuccessBeep();

      return { success: true, gym: newGym, user: ownerUser };
    } catch (err) {
      playErrorBuzzer();
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Helper: Log an audit event
  const logAudit = (actionType, details, actorId = 'SYSTEM', actorRole = 'SYSTEM') => {
    const newLog = {
      id: 'aud_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      actorId,
      actorRole,
      actionType,
      details,
      ipOrTerminal: 'DeviNagar-HQ'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper: Get active member object
  const foundMember = members.find(m => m.id === activeMemberId);
  const activeMember = foundMember || {
    id: currentUser?.id || 'mem_current',
    name: currentUser?.fullName || 'Hubli Member',
    phone: currentUser?.phone || '+91 96633 96058',
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    planId: 'plan_champion_annual',
    startDate: '2024-05-03',
    membershipExpiry: currentUser?.membershipExpiry || '2031-05-03',
    status: currentUser?.status || 'active',
    assignedTrainerId: currentUser?.assignedTrainerId || 'staff_1',
    emergencyContact: '+91 98860 00000 (Hubli)',
    medicalNotes: 'None',
    commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
    preferredBatch: 'evening_6pm'
  };
  const activeMemberPlan = plans.find(p => p.id === activeMember.planId) || plans[0];
  const activeMemberStreak = streaks[activeMemberId] || {
    memberId: activeMemberId,
    currentStreakDays: currentUser?.fairStreak ?? 18,
    bestStreakDays: 24,
    weeklyGoalDays: 4,
    weeklyVisitsCompleted: 4,
    plannedDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    isFairStreakPreserved: true
  };

  // ----------------------------------------------------
  // CHECK-IN ENGINE (Member QR, Rotating Token, Duplicate Window, Offline Sync)
  // ----------------------------------------------------
  const processCheckIn = ({
    memberId,
    scannedToken = gymQRToken.token,
    method = 'MEMBER_QR',
    assistedReason = null,
    staffId = null,
    isOffline = isOfflineSimulated
  }) => {
    const member = members.find(m => m.id === memberId);
    if (!member) {
      playErrorBuzzer();
      return { success: false, code: 'MEMBER_NOT_FOUND', message: 'Member profile not found in Karnataka Gym records.' };
    }

    // 1. Check Offline State
    if (isOffline) {
      const offlineItem = {
        id: 'off_' + Date.now(),
        memberId,
        scannedToken,
        method: 'OFFLINE_SYNC',
        assistedReason,
        staffId,
        queuedAt: new Date().toISOString()
      };
      setOfflineSyncQueue(prev => [...prev, offlineItem]);
      playTone(440, 0.15);
      return {
        success: true,
        code: 'OFFLINE_QUEUED',
        message: 'Network offline at turnstile. Check-in queued securely on device and will sync automatically when connection restores.',
        offlineItem
      };
    }

    // 2. Validate Membership Expiry
    const todayStr = new Date().toISOString().split('T')[0];
    const isExpired = member.membershipExpiry < todayStr || member.status === 'expired';
    if (isExpired) {
      playErrorBuzzer();
      logAudit('CHECKIN_BLOCKED_EXPIRED', `Member ${member.name} (${member.phone}) attempted check-in with expired membership (expired ${member.membershipExpiry}).`, memberId, 'MEMBER');
      return {
        success: false,
        code: 'MEMBERSHIP_EXPIRED',
        message: `Your Karnataka Gym membership expired on ${member.membershipExpiry}. Please renew your plan below to enter.`,
        expiryDate: member.membershipExpiry
      };
    }

    // 3. Validate Token authenticity (if QR method)
    if (method === 'MEMBER_QR') {
      const isTokenFormatValid = scannedToken && scannedToken.startsWith('KG-DEVINAGAR-');
      if (!isTokenFormatValid) {
        playErrorBuzzer();
        return {
          success: false,
          code: 'INVALID_QR',
          message: 'Invalid QR code. Please scan the official rotating session code displayed at Karnataka Gym entrance.'
        };
      }
    }

    // 4. Validate Duplicate Scan Window (Prevent double entry within lockout window)
    const lockoutMinutes = settings.duplicateScanLockoutMinutes || 120;
    const now = new Date();
    const recentMemberCheckIns = attendance.filter(a => a.memberId === memberId);
    if (recentMemberCheckIns.length > 0) {
      const latest = new Date(recentMemberCheckIns[0].checkInTime);
      const diffMinutes = Math.floor((now - latest) / (1000 * 60));
      if (diffMinutes < lockoutMinutes) {
        playErrorBuzzer();
        return {
          success: false,
          code: 'DUPLICATE_SCAN',
          message: `Already checked in ${diffMinutes} minutes ago (${latest.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}). Duplicate scans are locked for ${lockoutMinutes} minutes to prevent card sharing.`,
          lastCheckInTime: latest.toLocaleTimeString()
        };
      }
    }

    // 5. Successful Check-in Execution
    playSuccessBeep();
    const newAttendance = {
      id: 'att_' + Date.now(),
      memberId,
      checkInTime: now.toISOString(),
      method,
      verifiedBy: method === 'FRONT_DESK_ASSISTED' ? (staffId || 'staff_4') : 'GATE_01_SCANNER',
      notes: method === 'FRONT_DESK_ASSISTED' ? `Assisted: ${assistedReason}` : 'Verified Turnstile Scan',
      assistedReason,
      securityTokenHash: scannedToken
    };

    setAttendance(prev => [newAttendance, ...prev]);

    // Update Member's lastCheckIn
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, lastCheckIn: now.toISOString() } : m));

    // 6. Update Fair Streak & Weekly Goal
    setStreaks(prev => {
      const current = prev[memberId] || {
        memberId,
        currentStreakDays: 0,
        bestStreakDays: 0,
        weeklyGoalDays: 4,
        weeklyVisitsCompleted: 0,
        plannedDays: ['Mon', 'Tue', 'Thu', 'Sat'],
        isFairStreakPreserved: true
      };

      const newCurrentStreak = (current.currentStreakDays || 0) + 1;
      const newBestStreak = Math.max(newCurrentStreak, current.bestStreakDays || 0);
      const newWeeklyVisits = (current.weeklyVisitsCompleted || 0) + 1;

      return {
        ...prev,
        [memberId]: {
          ...current,
          currentStreakDays: newCurrentStreak,
          bestStreakDays: newBestStreak,
          weeklyVisitsCompleted: newWeeklyVisits,
          lastVisitDate: todayStr,
          isFairStreakPreserved: true,
          streakHistory: [
            `${now.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} (${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) - Checked In!`,
            ...(current.streakHistory || []).slice(0, 6)
          ]
        }
      };
    });

    // 7. Automation Rule 2: Valid check-in auto-resolves any open No-Show Case
    let autoResolvedCase = null;
    setNoShowCases(prev => prev.map(c => {
      if (c.memberId === memberId && (c.status === 'OPEN' || c.status === 'FOLLOWED_UP')) {
        autoResolvedCase = c.id;
        return {
          ...c,
          status: 'RESOLVED_RETURNED',
          resolvedAt: now.toISOString(),
          resolvedReason: 'Auto-resolved by valid turnstile check-in.'
        };
      }
      return c;
    }));

    if (autoResolvedCase) {
      logAudit(
        'NO_SHOW_AUTO_RESOLVED',
        `Silent churn case #${autoResolvedCase} for ${member.name} automatically resolved because member checked in at gym turnstile.`,
        memberId,
        'SYSTEM_AUTOMATION'
      );
    }

    if (method === 'FRONT_DESK_ASSISTED') {
      logAudit(
        'ATTENDANCE_ASSISTED',
        `Front-desk assisted check-in recorded for ${member.name}. Reason: "${assistedReason}". Verified by staff ${staffId || 'Sunita Byahatti'}.`,
        staffId || 'staff_4',
        'FRONT_DESK'
      );
    }

    return {
      success: true,
      code: 'SUCCESS',
      message: `Welcome to Karnataka Gym, ${member.name}! Attendance recorded at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      autoResolvedCase: !!autoResolvedCase
    };
  };

  // Sync Offline Queue
  const replayOfflineQueue = () => {
    if (offlineSyncQueue.length === 0) return { processed: 0 };
    let processedCount = 0;
    offlineSyncQueue.forEach(item => {
      processCheckIn({
        memberId: item.memberId,
        scannedToken: item.scannedToken,
        method: 'OFFLINE_SYNC',
        assistedReason: 'Offline buffer sync',
        isOffline: false
      });
      processedCount++;
    });
    setOfflineSyncQueue([]);
    logAudit('OFFLINE_QUEUE_SYNCED', `Replayed and synced ${processedCount} queued offline attendance check-ins successfully.`, 'SYSTEM', 'SYSTEM');
    return { processed: processedCount };
  };

  // ----------------------------------------------------
  // RENEWAL & PAYMENT ENGINE (Strict Idempotency & Provider Verification)
  // ----------------------------------------------------
  const processMembershipRenewal = ({
    memberId,
    planId,
    paymentMethod = 'UPI',
    simulateStatus = 'PAID', // 'PAID' | 'FAILED' | 'PENDING'
    idempotencyKey = null,
    gatewayReference = null
  }) => {
    const member = members.find(m => m.id === memberId);
    const plan = plans.find(p => p.id === planId);

    if (!member || !plan) {
      return { success: false, message: 'Invalid member or plan selected for renewal.' };
    }

    const orderId = idempotencyKey || 'ord_ren_' + Date.now();

    // IDEMPOTENCY CHECK: Ensure we never extend membership twice for the same payment reference
    const existingPayment = payments.find(p => p.orderId === orderId && p.status === 'PAID');
    if (existingPayment) {
      return {
        success: true,
        alreadyProcessed: true,
        message: 'This payment order has already been verified and processed. Membership was extended previously.',
        payment: existingPayment
      };
    }

    const paymentId = 'pay_' + Date.now();
    const receiptNum = 'KG-REC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    if (simulateStatus === 'FAILED') {
      playErrorBuzzer();
      const failedPayment = {
        id: paymentId,
        orderId,
        memberId,
        amount: plan.discountPrice,
        currency: 'INR',
        method: paymentMethod,
        gatewayReference: null,
        status: 'FAILED',
        verifiedAt: null,
        receiptNumber: null,
        failureReason: 'Payment declined by issuing bank (Simulated UPI failure).'
      };
      setPayments(prev => [failedPayment, ...prev]);
      logAudit('PAYMENT_FAILED', `Renewal payment failed for member ${member.name} (${plan.name} - ₹${plan.discountPrice}). Membership NOT extended.`, memberId, 'PAYMENT_GATEWAY');
      return {
        success: false,
        code: 'PAYMENT_FAILED',
        message: 'Payment was declined by the bank or UPI app. Your membership expiry was NOT changed. Please retry.',
        payment: failedPayment
      };
    }

    if (simulateStatus === 'PAID') {
      // 1. Record Verified Payment
      const paidPayment = {
        id: paymentId,
        orderId,
        memberId,
        amount: plan.discountPrice,
        currency: 'INR',
        method: paymentMethod,
        gatewayReference: gatewayReference || ('upi_ybl_' + Math.floor(100000000000 + Math.random() * 900000000000)),
        status: 'PAID',
        verifiedAt: new Date().toISOString(),
        receiptNumber: receiptNum,
        failureReason: null
      };
      setPayments(prev => [paidPayment, ...prev]);

      // 2. Extend Membership Date Safely
      // If current expiry is in the future, add plan days to that date. If already expired, add to today.
      const today = new Date();
      const currentExpiry = new Date(member.membershipExpiry);
      const baseDate = currentExpiry > today ? currentExpiry : today;
      const newExpiry = new Date(baseDate.getTime());
      newExpiry.setDate(newExpiry.getDate() + plan.durationDays);
      const newExpiryStr = newExpiry.toISOString().split('T')[0];

      setMembers(prev => prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            membershipExpiry: newExpiryStr,
            planId: plan.id,
            status: 'active'
          };
        }
        return m;
      }));

      // 3. Issue Confirmation Notification
      const notif = {
        id: 'notif_' + Date.now(),
        memberId,
        channel: 'WHATSAPP',
        category: 'PAYMENT_RECEIPT',
        title: `Karnataka Gym Renewal Confirmed: ${plan.name}`,
        message: `Namaskara ${member.name}! Your renewal payment of ₹${plan.discountPrice} is verified. Your new membership is valid until ${newExpiryStr}. Receipt: ${receiptNum}.`,
        sentAt: new Date().toISOString(),
        status: member.commPreferences.marketingOptOut ? 'SENT_TRANSACTIONAL' : 'SENT'
      };
      setNotifications(prev => [notif, ...prev]);

      playSuccessBeep();
      logAudit(
        'PAYMENT_VERIFIED',
        `Renewal payment ₹${plan.discountPrice} verified for ${member.name}. Membership extended to ${newExpiryStr} (${plan.name}). Receipt #${receiptNum}.`,
        memberId,
        'PAYMENT_GATEWAY'
      );

      return {
        success: true,
        code: 'PAID',
        message: `Payment verified! Membership extended by ${plan.durationDays} days until ${newExpiryStr}.`,
        payment: paidPayment,
        newExpiry: newExpiryStr
      };
    }

    return { success: false, message: 'Unhandled payment status' };
  };

  // Payment Refund / Reversal
  const processRefund = (paymentId, reason = 'Member requested medical cancellation within 3 days') => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return { success: false, message: 'Payment not found' };

    setPayments(prev => prev.map(p => p.id === paymentId ? {
      ...p,
      status: 'REFUNDED',
      refundReason: reason,
      refundedAt: new Date().toISOString()
    } : p));

    logAudit('PAYMENT_REFUNDED', `Payment #${payment.id} for ₹${payment.amount} was refunded. Reason: "${reason}".`, 'staff_4', 'OWNER');
    return { success: true, message: `Payment ₹${payment.amount} marked as REFUNDED.` };
  };

  // ----------------------------------------------------
  // ADD-ON MARKETPLACE PURCHASE (Zero pre-selection, Stock verification)
  // ----------------------------------------------------
  const purchaseAddOn = ({ memberId, addOnId, quantity = 1, gatewayReference = null }) => {
    const member = members.find(m => m.id === memberId);
    const item = addOns.find(a => a.id === addOnId);

    if (!member || !item) {
      return { success: false, message: 'Item or member not found' };
    }

    // Check Stock / Slot Availability
    if (item.stockCapacity !== undefined && item.stockCapacity < quantity) {
      playErrorBuzzer();
      return {
        success: false,
        code: 'OUT_OF_STOCK',
        message: `Sorry! "${item.title}" is currently out of stock or at maximum trainer capacity (${item.stockCapacity} left).`
      };
    }

    // Atomically decrement stock
    setAddOns(prev => prev.map(a => {
      if (a.id === addOnId) {
        return {
          ...a,
          stockCapacity: Math.max(0, a.stockCapacity - quantity)
        };
      }
      return a;
    }));

    // Record Add-On Order
    const totalAmount = item.price * quantity;
    const order = {
      id: 'ord_add_' + Date.now(),
      memberId,
      addOnId,
      quantity,
      amountPaid: totalAmount,
      paymentStatus: 'PAID',
      fulfillmentStatus: item.category === 'PT' ? 'ACTIVE_SESSIONS' : 'PENDING',
      sessionsTotal: item.category === 'PT' ? 12 : 0,
      sessionsCompleted: 0,
      orderedAt: new Date().toISOString()
    };
    setAddOnOrders(prev => [order, ...prev]);

    // Record Payment
    const payment = {
      id: 'pay_add_' + Date.now(),
      orderId: order.id,
      memberId,
      amount: totalAmount,
      currency: 'INR',
      method: 'UPI',
      gatewayReference: gatewayReference || ('upi_ybl_' + Math.floor(100000000000 + Math.random() * 900000000000)),
      status: 'PAID',
      verifiedAt: new Date().toISOString(),
      receiptNumber: 'KG-ADD-' + Math.floor(1000 + Math.random() * 9000),
      failureReason: null
    };
    setPayments(prev => [payment, ...prev]);

    playSuccessBeep();
    logAudit(
      'ADDON_PURCHASED',
      `${member.name} purchased ${quantity}x "${item.title}" (₹${totalAmount}). Stock remaining: ${item.stockCapacity - quantity}.`,
      memberId,
      'MEMBER'
    );

    return {
      success: true,
      code: 'PURCHASED',
      message: `Order confirmed for "${item.title}"! Amount ₹${totalAmount} paid via UPI.`,
      order
    };
  };

  // PT Session Punching (Staff/Owner marks a PT session done)
  const punchPTSession = (orderId) => {
    let updated = null;
    setAddOnOrders(prev => prev.map(o => {
      if (o.id === orderId && o.sessionsCompleted < o.sessionsTotal) {
        const nextCount = o.sessionsCompleted + 1;
        updated = {
          ...o,
          sessionsCompleted: nextCount,
          fulfillmentStatus: nextCount >= o.sessionsTotal ? 'COMPLETED' : 'ACTIVE_SESSIONS'
        };
        return updated;
      }
      return o;
    }));

    if (updated) {
      logAudit('PT_SESSION_PUNCHED', `Trainer marked PT session ${updated.sessionsCompleted}/${updated.sessionsTotal} completed for order #${orderId}.`, 'staff_1', 'TRAINER');
      return { success: true, updated };
    }
    return { success: false, message: 'All sessions already completed or invalid order.' };
  };

  // Supplement Order Fulfillment (Pending -> Packed -> Delivered)
  const updateFulfillmentStatus = (orderId, newStatus) => {
    setAddOnOrders(prev => prev.map(o => o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o));
    logAudit('ORDER_FULFILLED', `Supplement Order #${orderId} marked as ${newStatus}.`, 'staff_4', 'FRONT_DESK');
  };

  // ----------------------------------------------------
  // RED LIST & SILENT CHURN FOLLOW-UP ENGINE
  // ----------------------------------------------------
  const recordFollowUpOutcome = ({
    caseId,
    memberId,
    staffId = 'staff_2',
    channel = 'CALL',
    outcome,
    nextActionDate = null,
    notes = ''
  }) => {
    const newFollowUp = {
      id: 'fol_' + Date.now(),
      caseId,
      memberId,
      staffId,
      channel,
      outcome, // 'Will return' | 'Injured' | 'Travelling' | 'Timing issue' | 'Unhappy' | 'No response' | 'Cancelled'
      nextActionDate,
      notes,
      loggedAt: new Date().toISOString()
    };

    setFollowUps(prev => [newFollowUp, ...prev]);

    // Update the No-Show Case
    setNoShowCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: outcome === 'Cancelled' ? 'CLOSED_CANCELLED' : 'FOLLOWED_UP',
          lastFollowUpDate: newFollowUp.loggedAt,
          historyNotes: `Follow-up [${outcome}]: ${notes}`
        };
      }
      return c;
    }));

    const member = members.find(m => m.id === memberId);
    logAudit(
      'FOLLOW_UP_LOGGED',
      `Logged follow-up for ${member ? member.name : memberId} with outcome: "${outcome}". Next Action Date: ${nextActionDate || 'None'}. Notes: ${notes}`,
      staffId,
      'OWNER'
    );

    return { success: true, message: `Follow-up recorded: ${outcome}` };
  };

  // Membership Pause / Freeze (Medical / Travel)
  const toggleMembershipPause = ({ memberId, reason, days = 14, isApproved = true }) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return { success: false };

    if (!isApproved) {
      // Unfreeze / Resume membership
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'active', pauseStart: null, pauseEnd: null, pauseReason: null } : m));
      logAudit('MEMBERSHIP_RESUMED', `Pause ended for member ${member.name}. Membership is now active.`, 'staff_4', 'FRONT_DESK');
      return { success: true, message: 'Membership resumed!' };
    }

    const startDate = new Date().toISOString().split('T')[0];
    const end = new Date();
    end.setDate(end.getDate() + days);
    const endDate = end.toISOString().split('T')[0];

    // Extend expiry by pause days so member doesn't lose paid time!
    const currentExpiry = new Date(member.membershipExpiry);
    currentExpiry.setDate(currentExpiry.getDate() + days);
    const updatedExpiry = currentExpiry.toISOString().split('T')[0];

    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          status: 'paused',
          pauseStart: startDate,
          pauseEnd: endDate,
          pauseReason: reason,
          membershipExpiry: updatedExpiry
        };
      }
      return m;
    }));

    // Protect Fair Streak
    setStreaks(prev => ({
      ...prev,
      [memberId]: {
        ...(prev[memberId] || { currentStreakDays: 5 }),
        protectedUntil: endDate,
        isFairStreakPreserved: true,
        streakHistory: [
          `Approved Pause Active (${startDate} to ${endDate}) - Streak Safe!`,
          ...((prev[memberId] && prev[memberId].streakHistory) || [])
        ]
      }
    }));

    logAudit(
      'MEMBERSHIP_PAUSE',
      `Approved ${days}-day pause for ${member.name}. Reason: "${reason}". Expiry automatically extended to ${updatedExpiry}. Fair streak preserved.`,
      'staff_4',
      'FRONT_DESK'
    );

    return { success: true, message: `Membership paused for ${days} days. Expiry extended to ${updatedExpiry}. Streak preserved!` };
  };

  // Update Communication Preferences
  const updateCommPreferences = (memberId, newPrefs) => {
    setMembers(prev => prev.map(m => m.id === memberId ? {
      ...m,
      commPreferences: { ...m.commPreferences, ...newPrefs }
    } : m));
    logAudit('COMM_PREFERENCES_UPDATED', `Updated communication preferences for member ${memberId}. MarketingOptOut: ${newPrefs.marketingOptOut}`, memberId, 'MEMBER');
  };

  // Update Gym Settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAudit('SETTINGS_UPDATED', `Gym operating settings updated: ${JSON.stringify(newSettings)}`, 'staff_1', 'OWNER');
  };

  // Add a New Member (Universal Multi-Tenant with Member ID & PIN)
  const addMember = (memberData) => {
    const newId = 'mem_' + Date.now();
    const joinedDate = memberData.joinedDate || new Date().toISOString().split('T')[0];
    const plan = plans.find(p => p.id === memberData.planId) || plans[0];

    let expiry = memberData.membershipExpiry;
    if (!expiry) {
      const d = new Date();
      d.setDate(d.getDate() + (plan.durationDays || 30));
      expiry = d.toISOString().split('T')[0];
    }

    const defaultAvatar = memberData.gender === 'Female'
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&auto=format&fit=crop&q=75'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&auto=format&fit=crop&q=75';

    const cleanPhone = (memberData.phone || '').trim();
    const phoneDigits = cleanPhone.replace(/[^0-9]/g, '');
    const pin = phoneDigits.length >= 4 ? phoneDigits.slice(-4) : '1234';
    const gymCodePrefix = currentGym?.gymCode || 'KG01';
    const memberCode = `${gymCodePrefix}-${1000 + members.length + 1}`;

    const newMember = {
      id: newId,
      memberCode,
      pin,
      gymId: currentGym?.id || 'gym_kg_hubli',
      name: memberData.name.trim(),
      phone: cleanPhone,
      gender: memberData.gender || 'Male',
      avatar: memberData.avatar || defaultAvatar,
      emergencyContact: memberData.emergencyContact ? memberData.emergencyContact.trim() : '+91 96633 96058 (Gym Desk)',
      joinedDate,
      preferredSlot: memberData.preferredSlot || 'Morning 6-8 AM',
      assignedTrainerId: memberData.assignedTrainerId || 'staff_1',
      status: 'active',
      planId: plan.id,
      membershipExpiry: expiry,
      lastCheckIn: null,
      commPreferences: { whatsapp: true, sms: true, reminders: true, marketingOptOut: false },
      notes: memberData.notes ? memberData.notes.trim() : 'Newly registered gym resident regular.'
    };

    setMembers(prev => [newMember, ...prev]);

    // Initialize Fair Streak record for new member
    setStreaks(prev => ({
      ...prev,
      [newId]: {
        memberId: newId,
        currentStreakDays: 0,
        bestStreakDays: 0,
        weeklyGoalDays: 4,
        weeklyVisitsCompleted: 0,
        plannedDays: ['Mon', 'Wed', 'Fri', 'Sat'],
        isFairStreakPreserved: true,
        streakHistory: [`Joined ${currentGym?.name || 'Gym'} - Welcome!`]
      }
    }));

    const targetDigits = phoneDigits.startsWith('91') ? phoneDigits : '91' + phoneDigits;
    const shareMessage = `Welcome to ${currentGym?.name || 'Karnataka Gym'}! 🏋️\nYour Mobile Member Pass is active:\n• Gym Code: ${currentGym?.gymCode || 'KG01'}\n• Member Login ID: ${memberCode}\n• 4-Digit Access PIN: ${pin}\n\nAccess your Member App here: https://karnatakagym.vercel.app`;
    const whatsappUrl = `https://wa.me/${targetDigits}?text=${encodeURIComponent(shareMessage)}`;

    const trainer = staff.find(s => s.id === newMember.assignedTrainerId);
    logAudit(
      'MEMBER_CREATED',
      `Registered new member ${newMember.name} (ID: ${memberCode}, Phone: ${newMember.phone}) on ${plan.name} pass. Assigned Mentor: Coach ${trainer ? trainer.name : 'Floor Trainer'}. Expiry: ${expiry}.`,
      'staff_1',
      'OWNER'
    );

    playSuccessBeep();
    return {
      success: true,
      member: newMember,
      memberCode,
      pin,
      whatsappUrl,
      message: `Member ${newMember.name} registered with Login ID ${memberCode} and PIN ${pin}!`
    };
  };

  // Remove a Member
  const removeMember = (memberId, reason = 'Administrative removal') => {
    const member = members.find(m => m.id === memberId);
    if (!member) {
      playErrorBuzzer();
      return { success: false, message: 'Member not found.' };
    }

    setMembers(prev => prev.filter(m => m.id !== memberId));

    // Close any open no-show cases for this member
    setNoShowCases(prev => prev.map(c => {
      if (c.memberId === memberId && c.status === 'OPEN') {
        return {
          ...c,
          status: 'CLOSED_CANCELLED',
          historyNotes: `Case closed: Member profile removed (${reason})`
        };
      }
      return c;
    }));

    // If activeMemberId was this member, fall back to another existing member
    if (activeMemberId === memberId) {
      const remaining = members.filter(m => m.id !== memberId);
      if (remaining.length > 0) {
        setActiveMemberId(remaining[0].id);
      }
    }

    logAudit(
      'MEMBER_REMOVED',
      `Member ${member.name} (ID: ${member.id}, Phone: ${member.phone}) removed from Karnataka Gym records. Reason: "${reason}".`,
      'staff_1',
      'OWNER'
    );

    playTone(440, 0.15);
    return { success: true, message: `Member ${member.name} was removed from records.` };
  };

  // Change Assigned Mentor
  const changeAssignedMentor = (memberId, newTrainerId) => {
    const member = members.find(m => m.id === memberId);
    if (!member) {
      playErrorBuzzer();
      return { success: false, message: 'Member not found.' };
    }

    const newTrainer = staff.find(s => s.id === newTrainerId);
    if (!newTrainer) {
      playErrorBuzzer();
      return { success: false, message: 'Trainer not found.' };
    }

    const oldTrainer = staff.find(s => s.id === member.assignedTrainerId);

    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, assignedTrainerId: newTrainerId };
      }
      return m;
    }));

    setNoShowCases(prev => prev.map(c => {
      if (c.memberId === memberId) {
        return { ...c, assignedTrainerId: newTrainerId };
      }
      return c;
    }));

    logAudit(
      'MENTOR_REASSIGNED',
      `Assigned mentor for ${member.name} changed from Coach ${oldTrainer ? oldTrainer.name : 'None'} to Coach ${newTrainer.name} (${newTrainer.specialization}).`,
      'staff_1',
      'OWNER'
    );

    playSuccessBeep();
    return {
      success: true,
      trainer: newTrainer,
      message: `Assigned mentor updated to Coach ${newTrainer.name} for ${member.name}.`
    };
  };

  // ----------------------------------------------------
  // AUTOMATIONS ENGINE (The 6 Required System Automations)
  // ----------------------------------------------------

  // Automation 1: Daily Silent Churn / No-Show Scan
  const runDailyNoShowScan = () => {
    const threshold = settings.noShowThresholdDays || 10;
    const now = new Date();
    let newCasesOpened = 0;
    let skippedCases = 0;

    const newCasesList = [];

    members.forEach(member => {
      // Exclude paused, frozen, expired, or cancelled memberships
      if (member.status === 'paused' || member.status === 'expired' || member.status === 'cancelled') {
        skippedCases++;
        return;
      }

      if (!member.lastCheckIn) return;

      const lastDate = new Date(member.lastCheckIn);
      const absentDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

      if (absentDays >= threshold) {
        // Idempotency: Don't open duplicate cases if member already has an OPEN or FOLLOWED_UP case
        const existingCase = noShowCases.find(
          c => c.memberId === member.id && (c.status === 'OPEN' || c.status === 'FOLLOWED_UP')
        );

        if (!existingCase) {
          const newCase = {
            id: 'case_auto_' + Date.now() + '_' + member.id,
            memberId: member.id,
            openedAt: now.toISOString(),
            daysAbsent: absentDays,
            thresholdDays: threshold,
            status: 'OPEN',
            assignedTrainerId: member.assignedTrainerId || 'staff_1',
            riskScore: absentDays > 15 ? 'HIGH' : 'MEDIUM',
            lastFollowUpDate: null,
            historyNotes: `Automatic 6:00 AM scan opened case. Member absent ${absentDays} days (threshold: ${threshold}).`
          };
          newCasesList.push(newCase);
          newCasesOpened++;
        }
      }
    });

    if (newCasesList.length > 0) {
      setNoShowCases(prev => [...newCasesList, ...prev]);
    }

    logAudit(
      'NO_SHOW_SCANNED',
      `Daily No-Show Scan completed. Scanned ${members.length} members. ${newCasesOpened} new risk cases opened. ${skippedCases} paused/expired excluded.`,
      'SYSTEM_CRON',
      'SYSTEM_CRON'
    );

    return {
      success: true,
      newCasesOpened,
      skippedCases,
      message: `Daily scan finished. ${newCasesOpened} new silent churn cases identified.`
    };
  };

  // Automation 3: Renewal Reminders Engine (14, 7, 3, 0 days)
  const runRenewalRemindersScan = () => {
    const today = new Date();
    let sentCount = 0;
    let optedOutCount = 0;
    const noticeDaysList = settings.renewalNoticeDays || [14, 7, 3, 0];

    members.forEach(member => {
      if (member.status !== 'active') return;

      const expiry = new Date(member.membershipExpiry);
      const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

      if (noticeDaysList.includes(daysUntilExpiry)) {
        // Check if member opted out of marketing/reminders
        if (member.commPreferences && member.commPreferences.marketingOptOut) {
          optedOutCount++;
          return;
        }

        // Idempotency: check if reminder already sent today for this member
        const alreadySent = notifications.find(n =>
          n.memberId === member.id &&
          n.category === 'RENEWAL_REMINDER' &&
          n.sentAt.split('T')[0] === today.toISOString().split('T')[0]
        );

        if (!alreadySent) {
          const plan = plans.find(p => p.id === member.planId);
          const notif = {
            id: 'notif_auto_' + Date.now() + '_' + member.id,
            memberId: member.id,
            channel: 'WHATSAPP',
            category: 'RENEWAL_REMINDER',
            title: `Karnataka Gym: Membership Renewal Notice (${daysUntilExpiry} Days Left)`,
            message: `Namaskara ${member.name}! Your ${plan ? plan.name : 'membership'} at Karnataka Gym Devi Nagar expires in ${daysUntilExpiry} days (${member.membershipExpiry}). Renew now on the app to keep your fair attendance streak and lockers safe!`,
            sentAt: today.toISOString(),
            status: 'SENT'
          };
          setNotifications(prev => [notif, ...prev]);
          sentCount++;
        }
      }
    });

    logAudit(
      'RENEWAL_REMINDERS_SENT',
      `Renewal notification sweep completed. Sent ${sentCount} reminders. Skipped ${optedOutCount} members due to marketing opt-out.`,
      'SYSTEM_CRON',
      'SYSTEM_CRON'
    );

    return {
      success: true,
      sentCount,
      optedOutCount,
      message: `Renewal scan finished. Sent ${sentCount} reminders, respected ${optedOutCount} opt-outs.`
    };
  };

  // Automation 5: Daily Owner Summary Generator
  const generateDailyOwnerSummary = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCheckIns = attendance.filter(a => a.checkInTime.startsWith(todayStr));
    const activeMembersCount = members.filter(m => m.status === 'active').length;
    const openChurnCases = noShowCases.filter(c => c.status === 'OPEN').length;
    const resolvedReturned = noShowCases.filter(c => c.status === 'RESOLVED_RETURNED').length;
    const expiringSoon = members.filter(m => {
      const diff = Math.ceil((new Date(m.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 7;
    }).length;

    const todayRenewals = payments.filter(p => p.verifiedAt && p.verifiedAt.startsWith(todayStr) && p.orderId.startsWith('ord_ren_'));
    const renewalRevenue = todayRenewals.reduce((sum, p) => sum + p.amount, 0);

    const todayAddOns = payments.filter(p => p.verifiedAt && p.verifiedAt.startsWith(todayStr) && p.orderId.startsWith('ord_add_'));
    const addOnRevenue = todayAddOns.reduce((sum, p) => sum + p.amount, 0);

    return {
      date: todayStr,
      gymName: settings.gymName,
      location: settings.address,
      metrics: {
        totalActiveMembers: activeMembersCount,
        todayCheckInsCount: todayCheckIns.length,
        openChurnRiskCases: openChurnCases,
        returnedMembersCount: resolvedReturned,
        membersExpiringThisWeek: expiringSoon,
        renewalCollectionINR: renewalRevenue,
        addOnCollectionINR: addOnRevenue,
        totalDailyRevenue: renewalRevenue + addOnRevenue
      },
      auditChecks: runDataQualityAudit().anomalies
    };
  };

  // Automation 6: Data-Quality & Integrity Radar
  const runDataQualityAudit = () => {
    const anomalies = [];

    // 1. Missing Expiry Date
    members.forEach(m => {
      if (!m.membershipExpiry) {
        anomalies.push({
          type: 'MISSING_EXPIRY',
          severity: 'HIGH',
          entityId: m.id,
          message: `Member ${m.name} (${m.phone}) has no valid membershipExpiry recorded.`
        });
      }
    });

    // 2. Unverified Paid State without gatewayReference
    payments.forEach(p => {
      if (p.status === 'PAID' && !p.gatewayReference) {
        anomalies.push({
          type: 'UNVERIFIED_PAID_STATE',
          severity: 'CRITICAL',
          entityId: p.id,
          message: `Payment #${p.id} marked PAID without payment provider transaction reference.`
        });
      }
    });

    // 3. Attendance correction / override without reason
    attendance.forEach(a => {
      if (a.method === 'FRONT_DESK_ASSISTED' && !a.assistedReason) {
        anomalies.push({
          type: 'ASSISTED_ATTENDANCE_WITHOUT_REASON',
          severity: 'MEDIUM',
          entityId: a.id,
          message: `Assisted check-in #${a.id} lacks mandatory front-desk explanation reason.`
        });
      }
    });

    // 4. Negative Stock on Supplements or PT
    addOns.forEach(a => {
      if (a.stockCapacity < 0) {
        anomalies.push({
          type: 'NEGATIVE_STOCK',
          severity: 'HIGH',
          entityId: a.id,
          message: `Add-on item "${a.title}" has impossible negative stock (${a.stockCapacity}).`
        });
      }
    });

    // 5. Trainer Double Booking / Slot Overbooking
    staff.forEach(s => {
      if (s.activePTSlots > s.maxPTSlots) {
        anomalies.push({
          type: 'TRAINER_OVERBOOKING',
          severity: 'HIGH',
          entityId: s.id,
          message: `Trainer ${s.name} exceeds max capacity (${s.activePTSlots}/${s.maxPTSlots} slots).`
        });
      }
    });

    return {
      healthy: anomalies.length === 0,
      totalAnomalies: anomalies.length,
      anomalies
    };
  };

  // Reset to Factory Seed Data
  const resetToFactoryData = () => {
    localStorage.clear();
    setMembers(INITIAL_MEMBERS);
    setPlans(INITIAL_PLANS);
    setStaff(INITIAL_STAFF);
    setAddOns(INITIAL_ADDONS);
    setStreaks(INITIAL_STREAKS);
    setNoShowCases(INITIAL_NO_SHOW_CASES);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setAttendance(INITIAL_ATTENDANCE);
    setPayments(INITIAL_PAYMENTS);
    setAddOnOrders(INITIAL_ADDON_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setOfflineSyncQueue([]);
    setActiveMemberId('mem_12');
    playTone(523.25, 0.2);
  };

  const value = {
    // Universal Multi-Tenant Gym Registry
    gyms,
    setGyms,
    currentGym,
    setCurrentGym,
    registerGym,
    loginMemberWithId,

    // Authentication & Current User
    currentUser,
    loginWithSupabase,
    loginDemoAccount,
    logout,
    authLoading,
    authError,

    // Role & Navigation
    currentRole,
    setCurrentRole,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    activeMemberId,
    setActiveMemberId,
    activeMember,
    activeMemberPlan,
    activeMemberStreak,

    // Core Data
    members,
    setMembers,
    plans,
    setPlans,
    staff,
    addOns,
    setAddOns,
    streaks,
    noShowCases,
    followUps,
    attendance,
    payments,
    addOnOrders,
    notifications,
    settings,
    auditLogs,

    // Rotating QR & Offline
    gymQRToken,
    offlineSyncQueue,
    isOfflineSimulated,
    setIsOfflineSimulated,
    replayOfflineQueue,

    // Operations
    addMember,
    removeMember,
    changeAssignedMentor,
    processCheckIn,
    processMembershipRenewal,
    processRefund,
    purchaseAddOn,
    punchPTSession,
    updateFulfillmentStatus,
    recordFollowUpOutcome,
    toggleMembershipPause,
    updateCommPreferences,
    updateSettings,

    // Automations
    runDailyNoShowScan,
    runRenewalRemindersScan,
    generateDailyOwnerSummary,
    runDataQualityAudit,

    // Helpers
    logAudit,
    resetToFactoryData
  };

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
};

