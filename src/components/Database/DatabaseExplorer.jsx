import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Database,
  Search,
  Download,
  Copy,
  CheckCircle,
  Table,
  Layers,
  Key,
  ShieldCheck,
  FileCode
} from 'lucide-react';

export default function DatabaseExplorer() {
  const gym = useGym();
  const [selectedTable, setSelectedTable] = useState('Members');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // The 14 Required Data Tables mapped from context state
  const tables = {
    Members: {
      data: gym.members,
      schema: 'id (PK), name, phone, gender, avatar, emergencyContact, joinedDate, preferredSlot, assignedTrainerId (FK), status, planId (FK), membershipExpiry, lastCheckIn, commPreferences',
      indexes: 'idx_members_phone, idx_members_status, idx_members_expiry'
    },
    Plans: {
      data: gym.plans,
      schema: 'id (PK), code, name, durationDays, basePrice, discountPrice, isPopular, features, terms',
      indexes: 'idx_plans_code'
    },
    Memberships: {
      data: gym.members.map(m => ({
        id: 'msh_' + m.id,
        memberId: m.id,
        planId: m.planId,
        expiryDate: m.membershipExpiry,
        status: m.status,
        pauseStart: m.pauseStart || null,
        pauseEnd: m.pauseEnd || null,
        pauseReason: m.pauseReason || null
      })),
      schema: 'id (PK), memberId (FK), planId (FK), expiryDate, status, pauseStart, pauseEnd, pauseReason',
      indexes: 'idx_memberships_member_status, idx_memberships_expiry'
    },
    Attendance: {
      data: gym.attendance,
      schema: 'id (PK), memberId (FK), checkInTime, method, verifiedBy (FK), notes, assistedReason, securityTokenHash',
      indexes: 'idx_attendance_member_time, idx_attendance_time'
    },
    Streaks: {
      data: Object.values(gym.streaks),
      schema: 'memberId (PK/FK), currentStreakDays, bestStreakDays, weeklyGoalDays, weeklyVisitsCompleted, plannedDays, lastVisitDate, isFairStreakPreserved',
      indexes: 'idx_streaks_member'
    },
    NoShowCases: {
      data: gym.noShowCases,
      schema: 'id (PK), memberId (FK), openedAt, daysAbsent, thresholdDays, status, assignedTrainerId (FK), riskScore, lastFollowUpDate',
      indexes: 'idx_noshow_status_openedAt, idx_noshow_member'
    },
    FollowUps: {
      data: gym.followUps,
      schema: 'id (PK), caseId (FK), memberId (FK), staffId (FK), channel, outcome, nextActionDate, notes, loggedAt',
      indexes: 'idx_followups_case, idx_followups_member_date'
    },
    Payments: {
      data: gym.payments,
      schema: 'id (PK), orderId, memberId (FK), amount, currency, method, gatewayReference (UNIQUE), status, verifiedAt, receiptNumber',
      indexes: 'idx_payments_order_status, idx_payments_gateway_ref'
    },
    RenewalOrders: {
      data: gym.payments.filter(p => p.orderId.startsWith('ord_ren_')).map(p => ({
        id: p.orderId,
        memberId: p.memberId,
        amount: p.amount,
        status: p.status,
        receiptNumber: p.receiptNumber,
        verifiedAt: p.verifiedAt
      })),
      schema: 'id (PK), memberId (FK), amount, status, receiptNumber, verifiedAt',
      indexes: 'idx_renewal_orders_member'
    },
    AddOns: {
      data: gym.addOns,
      schema: 'id (PK), category, title, description, price, unit, trainerId (FK), stockCapacity, cancellationTerms, badge',
      indexes: 'idx_addons_category'
    },
    AddOnOrders: {
      data: gym.addOnOrders,
      schema: 'id (PK), memberId (FK), addOnId (FK), quantity, amountPaid, paymentStatus, fulfillmentStatus, sessionsTotal, sessionsCompleted, orderedAt',
      indexes: 'idx_addon_orders_member, idx_addon_orders_fulfillment'
    },
    Notifications: {
      data: gym.notifications,
      schema: 'id (PK), memberId (FK), channel, category, title, message, sentAt, status',
      indexes: 'idx_notifs_member_sentAt'
    },
    Settings: {
      data: [gym.settings],
      schema: 'noShowThresholdDays, renewalNoticeDays, qrRotationIntervalSecs, duplicateScanLockoutMinutes, allowOfflineSync, gymName, address, operatingHours',
      indexes: 'idx_settings_singleton'
    },
    AuditLogs: {
      data: gym.auditLogs,
      schema: 'id (PK), timestamp, actorId (FK), actorRole, actionType, details, ipOrTerminal',
      indexes: 'idx_audit_timestamp, idx_audit_action'
    }
  };

  const activeTableMeta = tables[selectedTable] || tables.Members;
  const rawData = activeTableMeta.data || [];

  const filteredData = rawData.filter(row => {
    if (!searchTerm) return true;
    return JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleExportFullDatabase = () => {
    const fullDump = {};
    Object.keys(tables).forEach(k => {
      fullDump[k] = tables[k].data;
    });

    const blob = new Blob([JSON.stringify(fullDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karnataka_gym_hubli_database_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTableJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(filteredData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8 max-w-7xl mx-auto text-xs">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-orange-400 uppercase tracking-wider text-[11px]">
              Karnataka Gym Hubli • Relational Schema & State Store
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-0.5">
            14 System Data Tables & Live Query Explorer
          </h2>
          <p className="text-slate-400 text-xs">
            Live inspection of all relational tables with foreign keys, indexes, and full export capabilities.
          </p>
        </div>

        <button
          onClick={handleExportFullDatabase}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Full DB (JSON)</span>
        </button>
      </div>

      {/* 14 Table Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Object.keys(tables).map(tbl => {
          const isSelected = tbl === selectedTable;
          const count = tables[tbl].data.length;

          return (
            <button
              key={tbl}
              onClick={() => {
                setSelectedTable(tbl);
                setSearchTerm('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{tbl}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Schema & Foreign Key Metadata */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h4 className="font-extrabold text-white text-sm">
              Table: <span className="text-orange-400">{selectedTable}</span> ({filteredData.length} Records)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTableJSON}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Table JSON'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 font-bold block uppercase text-[10px]">Columns & Schema:</span>
            <code className="text-slate-300 font-mono text-[11px] break-words">
              {activeTableMeta.schema}
            </code>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 font-bold block uppercase text-[10px]">Database Indexes:</span>
            <code className="text-amber-300 font-mono text-[11px] break-words">
              {activeTableMeta.indexes}
            </code>
          </div>
        </div>
      </div>

      {/* Search within table */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder={`Search records inside ${selectedTable}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Records Table Viewer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-xl">
        {filteredData.length === 0 ? (
          <div className="text-center p-6 text-slate-500">No records found.</div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                {Object.keys(filteredData[0] || {}).map(k => (
                  <th key={k} className="py-2 px-3 whitespace-nowrap">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  {Object.entries(row).map(([k, v], cellIdx) => (
                    <td key={cellIdx} className="py-2 px-3 max-w-xs truncate text-slate-300">
                      {typeof v === 'object' && v !== null
                        ? JSON.stringify(v)
                        : String(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

