import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  PieChart as PieIcon, Briefcase, Download, Calendar 
} from 'lucide-react';

const historicalData = [
  { month: 'Jan', revenue: 420000, expenses: 280000, profit: 140000, cashFlow: 120000, burnRate: 45000, breakdown: { software: 200000, consulting: 150000, services: 70000 } },
  { month: 'Feb', revenue: 450000, expenses: 290000, profit: 160000, cashFlow: 135000, burnRate: 42000, breakdown: { software: 220000, consulting: 150000, services: 80000 } },
  { month: 'Mar', revenue: 480000, expenses: 310000, profit: 170000, cashFlow: 140000, burnRate: 48000, breakdown: { software: 250000, consulting: 140000, services: 90000 } },
  { month: 'Apr', revenue: 510000, expenses: 305000, profit: 205000, cashFlow: 180000, burnRate: 40000, breakdown: { software: 270000, consulting: 150000, services: 90000 } },
  { month: 'May', revenue: 540000, expenses: 330000, profit: 210000, cashFlow: 175000, burnRate: 50000, breakdown: { software: 290000, consulting: 160000, services: 90000 } },
  { month: 'Jun', revenue: 580000, expenses: 340000, profit: 240000, cashFlow: 210000, burnRate: 45000, breakdown: { software: 320000, consulting: 160000, services: 100000 } },
  { month: 'Jul', revenue: 610000, expenses: 360000, profit: 250000, cashFlow: 220000, burnRate: 52000, breakdown: { software: 350000, consulting: 150000, services: 110000 } },
  { month: 'Aug', revenue: 590000, expenses: 355000, profit: 235000, cashFlow: 195000, burnRate: 49000, breakdown: { software: 330000, consulting: 155000, services: 105000 } },
  { month: 'Sep', revenue: 640000, expenses: 370000, profit: 270000, cashFlow: 240000, burnRate: 46000, breakdown: { software: 370000, consulting: 160000, services: 110000 } },
  { month: 'Oct', revenue: 680000, expenses: 390000, profit: 290000, cashFlow: 260000, burnRate: 55000, breakdown: { software: 400000, consulting: 160000, services: 120000 } },
  { month: 'Nov', revenue: 720000, expenses: 410000, profit: 310000, cashFlow: 280000, burnRate: 51000, breakdown: { software: 430000, consulting: 170000, services: 120000 } },
  { month: 'Dec', revenue: 800000, expenses: 440000, profit: 360000, cashFlow: 320000, burnRate: 48000, breakdown: { software: 480000, consulting: 180000, services: 140000 } },
];

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981']; 

export default function App() {
  const [timeFilter, setTimeFilter] = useState('12M');

  const filteredData = useMemo(() => {
    if (timeFilter === '6M') return historicalData.slice(-6);
    if (timeFilter === '3M') return historicalData.slice(-3);
    return historicalData;
  }, [timeFilter]);

  const kpis = useMemo(() => {
    const totalRev = filteredData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalProf = filteredData.reduce((acc, curr) => acc + curr.profit, 0);
    const latestMonth = filteredData[filteredData.length - 1];
    const previousMonth = filteredData[filteredData.length - 2] || filteredData[0];
    const profitMargin = ((totalProf / totalRev) * 100).toFixed(1);
    const revenueGrowth = (((latestMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1);
    return { revenue: totalRev, profit: totalProf, margin: profitMargin, growth: revenueGrowth, cashFlow: latestMonth.cashFlow, burnRate: latestMonth.burnRate };
  }, [filteredData]);

  const pieData = useMemo(() => {
    const totals = filteredData.reduce((acc, curr) => {
      acc.software += curr.breakdown.software;
      acc.consulting += curr.breakdown.consulting;
      acc.services += curr.breakdown.services;
      return acc;
    }, { software: 0, consulting: 0, services: 0 });
    return [
      { name: 'Software', value: totals.software },
      { name: 'Consulting', value: totals.consulting },
      { name: 'Services', value: totals.services }
    ];
  }, [filteredData]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            Mckinsui Financials
          </h1>
          <p className="text-slate-500 mt-1">Real-time enterprise financial command center</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-slate-200 flex">
            {['3M', '6M', '12M'].map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${timeFilter === filter ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Total Revenue" value={formatCurrency(kpis.revenue)} trend={kpis.growth} icon={<DollarSign className="h-5 w-5 text-blue-600" />} color="bg-blue-50" />
          <KpiCard title="Net Profit" value={formatCurrency(kpis.profit)} trend={((kpis.profit / kpis.revenue) * 10).toFixed(1)} icon={<TrendingUp className="h-5 w-5 text-emerald-600" />} color="bg-emerald-50" />
          <KpiCard title="Avg. Profit Margin" value={`${kpis.margin}%`} trend="1.2" icon={<PieIcon className="h-5 w-5 text-purple-600" />} color="bg-purple-50" />
          <KpiCard title="Current Burn Rate" value={formatCurrency(kpis.burnRate)} trend="-2.4" trendReversed icon={<Activity className="h-5 w-5 text-rose-600" />} color="bg-rose-50" subtitle="vs last month" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4">Revenue vs Expenses</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" name="Revenue" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" name="Expenses" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Revenue Breakdown</h2>
            <div className="h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend iconType="circle" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, icon, color, subtitle = "vs previous period", trendReversed = false }) {
  const isPositive = parseFloat(trend) > 0;
  const isGood = trendReversed ? !isPositive : isPositive;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${isGood ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
      </div>
    </div>
  );
}
