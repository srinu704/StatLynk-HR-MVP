"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Mail, Users, DollarSign, Clock, LineChart as LineChartIcon, Trophy, UserPlus, Settings, Download, Upload, Plus, Edit, Trash2, CheckCircle2, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie } from "recharts";
import Progress from "@/components/ui/Progress";

type Employee = {
  id: number; name: string; email: string; dept: string; role: string; status: string;
  salary: number; joinDate: string; manager: string; location: string; grade: string; attendance: number; performance: number;
};

const seedEmployees: Employee[] = [
  { id: 1, name: "Aisha Khan", email: "aisha@statlynk.io", dept: "Sales", role: "AE", status: "Active", salary: 52000, joinDate: "2024-02-12", manager: "N/A", location: "Remote", grade: "L2", attendance: 96, performance: 82 },
  { id: 2, name: "Ben Carter", email: "ben@statlynk.io", dept: "Marketing", role: "SEO Specialist", status: "Active", salary: 48000, joinDate: "2023-11-01", manager: "Aisha Khan", location: "NYC", grade: "L2", attendance: 92, performance: 78 },
  { id: 3, name: "Chloe Wong", email: "chloe@statlynk.io", dept: "Engineering", role: "Frontend Dev", status: "Active", salary: 82000, joinDate: "2023-09-03", manager: "Dev Lead", location: "Remote", grade: "L3", attendance: 98, performance: 88 },
  { id: 4, name: "Diego Morales", email: "diego@statlynk.io", dept: "Engineering", role: "Backend Dev", status: "Active", salary: 86000, joinDate: "2023-09-03", manager: "Dev Lead", location: "Remote", grade: "L3", attendance: 95, performance: 84 },
  { id: 5, name: "Elena Rossi", email: "elena@statlynk.io", dept: "People Ops", role: "HRBP", status: "Active", salary: 63000, joinDate: "2023-10-14", manager: "COO", location: "Milan", grade: "L2", attendance: 97, performance: 90 },
  { id: 6, name: "Farhan Ali", email: "farhan@statlynk.io", dept: "Finance", role: "Payroll Spec.", status: "Active", salary: 60000, joinDate: "2024-01-10", manager: "CFO", location: "Dubai", grade: "L2", attendance: 93, performance: 80 },
  { id: 7, name: "Grace Kim", email: "grace@statlynk.io", dept: "Support", role: "CSM", status: "Active", salary: 54000, joinDate: "2024-04-01", manager: "COO", location: "Seoul", grade: "L1", attendance: 99, performance: 86 },
  { id: 8, name: "Hassan Malik", email: "hassan@statlynk.io", dept: "Sales", role: "SDR", status: "Active", salary: 45000, joinDate: "2024-03-18", manager: "Aisha Khan", location: "Remote", grade: "L1", attendance: 94, performance: 76 },
  { id: 9, name: "Ivana Petrova", email: "ivana@statlynk.io", dept: "Design", role: "Product Designer", status: "Active", salary: 70000, joinDate: "2023-08-21", manager: "CPO", location: "Berlin", grade: "L3", attendance: 91, performance: 87 },
  { id: 10, name: "Jude O'Connor", email: "jude@statlynk.io", dept: "Engineering", role: "QA Engineer", status: "Active", salary: 62000, joinDate: "2023-12-05", manager: "Dev Lead", location: "Dublin", grade: "L2", attendance: 96, performance: 81 },
];

const payrollHistorySeed = [
  { period: "2025-04", gross: (62000/12)*10, net: (62000/12)*8.2, paid: true },
  { period: "2025-05", gross: (62000/12)*10.2, net: (62000/12)*8.5, paid: true },
  { period: "2025-06", gross: (62000/12)*10.1, net: (62000/12)*8.4, paid: true },
  { period: "2025-07", gross: (62000/12)*10.3, net: (62000/12)*8.6, paid: true },
];

function groupBy<T extends Record<string, any>>(list:T[], key:keyof T){
  return list.reduce((acc: Record<string,T[]>, item:T) => {
    const k = String(item[key]);
    acc[k] ||= []; acc[k].push(item);
    return acc;
  }, {});
}

function Header({ onExport }: { onExport: () => void }){
  return (
    <div className="flex items-center justify-between p-4 md:p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600"/></div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">StatLynk HR & Payroll</h1>
          <p className="text-sm text-gray-500">Core HR • Payroll • Attendance • Performance</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-secondary"><Upload className="h-4 w-4"/>Import</button>
        <button onClick={onExport} className="btn btn-primary"><Download className="h-4 w-4"/>Export CSV</button>
      </div>
    </div>
  )
}

function Stat({ label, value, icon:Icon }:{label:string; value:string; icon:any}){
  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="text-sm text-gray-500">{label}</div>
        <Icon className="h-4 w-4" />
      </div>
      <div className="card-content">
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  )
}

function Dashboard({ employees, payrollHistory }:{employees:Employee[]; payrollHistory:any[]}){
  const headcount = employees.length;
  const avgPerformance = Math.round(employees.reduce((a, e) => a + e.performance, 0) / headcount);
  const avgAttendance = Math.round(employees.reduce((a, e) => a + e.attendance, 0) / headcount);
  const monthlyBurn = employees.reduce((a, e) => a + e.salary/12, 0);

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Headcount" value={`${headcount}`} icon={Users}/>
        <Stat label="Avg Performance" value={`${avgPerformance}%`} icon={Trophy}/>
        <Stat label="Avg Attendance" value={`${avgAttendance}%`} icon={Clock}/>
        <Stat label="Monthly Payroll" value={`$${monthlyBurn.toLocaleString(undefined,{maximumFractionDigits:0})}`} icon={DollarSign}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="card-header"><div className="card-title">Payroll Trend</div></div>
          <div className="card-content h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollHistory} margin={{ left:8, right:8 }}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="gross" strokeWidth={2} />
                <Line type="monotone" dataKey="net" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Dept Distribution</div></div>
          <div className="card-content h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" nameKey="name" data={Object.entries(groupBy(employees,'dept')).map(([name,list]) => ({ name, value: (list as any[]).length }))} outerRadius={100} label />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title flex items-center gap-2"><CalendarDays className="h-5 w-5"/>Today</div></div>
        <div className="card-content grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium mb-2">Upcoming Events</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between"><span>Quarterly Review</span><span className="badge">Fri 3pm</span></li>
              <li className="flex items-center justify-between"><span>Onboarding: New SDR</span><span className="badge">Mon 10am</span></li>
              <li className="flex items-center justify-between"><span>Payroll Cutoff</span><span className="badge">Tue 6pm</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn btn-secondary"><UserPlus className="h-4 w-4"/>Add Employee</button>
              <button className="btn btn-secondary"><Mail className="h-4 w-4"/>Send Mail</button>
              <button className="btn btn-secondary"><CalendarDays className="h-4 w-4"/>Create Event</button>
              <button className="btn btn-secondary"><DollarSign className="h-4 w-4"/>Run Payroll</button>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Org Snapshot</h4>
            <div className="space-y-4">
              <div><div className="text-sm mb-1">Engagement</div><Progress value={82}/></div>
              <div><div className="text-sm mb-1">Goal Completion</div><Progress value={67}/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Employees({ employees, setEmployees }:{ employees:Employee[]; setEmployees:(x:Employee[])=>void }){
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", dept: "Engineering", role: "", salary: 50000, location: "Remote" });

  const filtered = useMemo(() => employees.filter(e =>
    [e.name, e.email, e.dept, e.role].join(" ").toLowerCase().includes(query.toLowerCase())
  ), [employees, query]);

  function addEmployee(){
    const id = Math.max(0, ...employees.map(e=>e.id)) + 1;
    const neo: Employee = { id, status: "Active", grade: "L1", joinDate: new Date().toISOString().slice(0,10), manager: "", attendance: 100, performance: 80, ...form } as Employee;
    setEmployees([neo, ...employees]);
    setOpen(false);
  }
  function remove(id:number){ setEmployees(employees.filter(e=>e.id!==id)); }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <input className="input" placeholder="Search employees, roles, departments…" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <button className="btn btn-primary" onClick={()=>setOpen(true)}><Plus className="h-4 w-4"/>Add Employee</button>
      </div>

      {open && (
        <div className="card">
          <div className="card-header"><div className="card-title">Add Employee</div></div>
          <div className="card-content grid gap-3">
            <input className="input" placeholder="Full name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})}/>
            <input className="input" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})}/>
            <div className="grid grid-cols-2 gap-2">
              <select className="input" value={form.dept} onChange={(e)=>setForm({...form, dept: e.target.value})}>
                {['Engineering','Sales','Marketing','Finance','People Ops','Support','Design'].map(d=> <option key={d} value={d}>{d}</option>)}
              </select>
              <input className="input" placeholder="Role" value={form.role} onChange={(e)=>setForm({...form, role: e.target.value})}/>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="input" type="number" placeholder="Annual Salary" value={form.salary} onChange={(e)=>setForm({...form, salary: Number(e.target.value)})}/>
              <input className="input" placeholder="Location" value={form.location} onChange={(e)=>setForm({...form, location: e.target.value})}/>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={addEmployee}>Save</button>
              <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header"><div className="card-title">Directory</div></div>
        <div className="card-content overflow-x-auto">
          <table className="table">
            <thead><tr>
              <th>Name</th><th>Department</th><th>Role</th><th>Location</th><th>Salary</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="font-medium">{e.name}<div className="text-xs text-gray-500">{e.email}</div></td>
                  <td>{e.dept}</td><td>{e.role}</td><td>{e.location}</td>
                  <td>${(e.salary).toLocaleString()}</td>
                  <td><span className="badge">{e.status}</span></td>
                  <td className="text-right"><button className="btn btn-secondary"><Edit className="h-4 w-4"/></button> <button className="btn btn-secondary" onClick={()=>remove(e.id)}><Trash2 className="h-4 w-4"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Payroll({ employees }:{ employees:Employee[] }){
  const [includeBonus, setIncludeBonus] = useState(true);
  const rows = employees.map(e=>{
    const base = e.salary/12;
    const bonus = includeBonus ? base*0.05 : 0;
    const tax = 0.18 * (base + bonus);
    const net = base + bonus - tax;
    return { name: e.name, dept: e.dept, base, bonus, tax, net };
  });
  const totalNet = rows.reduce((a,r)=>a+r.net,0);
  const data = rows.map(r=>({ name: r.name.split(' ')[0], net: r.net }));

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={includeBonus} onChange={(e)=>setIncludeBonus(e.target.checked)} />
          <span className="text-sm text-gray-600">Include 5% monthly bonus</span>
        </label>
        <span className="badge ml-auto">Estimated Net Payout: ${totalNet.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
        <button className="btn btn-primary"><DollarSign className="h-4 w-4"/>Run Payroll</button>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Pay Breakdown</div></div>
        <div className="card-content overflow-x-auto">
          <table className="table">
            <thead><tr><th>Employee</th><th>Dept</th><th>Base</th><th>Bonus</th><th>Tax</th><th>Net</th></tr></thead>
            <tbody>
              {rows.map(r=> (
                <tr key={r.name} className="border-t">
                  <td>{r.name}</td><td>{r.dept}</td>
                  <td>${r.base.toFixed(0)}</td><td>${r.bonus.toFixed(0)}</td>
                  <td>${r.tax.toFixed(0)}</td><td className="font-medium">${r.net.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Net by Employee</div></div>
        <div className="card-content h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="net" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Attendance({ employees, setEmployees }:{ employees:Employee[]; setEmployees:(x:Employee[])=>void }){
  const [month, setMonth] = useState("2025-07");
  const update = (id:number, pct:number)=> setEmployees(employees.map(e=> e.id===id ? { ...e, attendance: pct } : e));

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <input className="input w-48" type="month" value={month} onChange={(e)=>setMonth(e.target.value)} />
        <span className="badge ml-auto">Policy: 2 WFH / week</span>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Time & Attendance</div></div>
        <div className="card-content overflow-x-auto">
          <table className="table">
            <thead><tr><th>Employee</th><th>Attendance %</th><th>Set</th></tr></thead>
            <tbody>
              {employees.map(e=> (
                <tr key={e.id} className="border-t">
                  <td>{e.name}</td>
                  <td>{e.attendance}%</td>
                  <td><input className="input w-24" type="number" defaultValue={e.attendance} onBlur={(ev)=>update(e.id, Number(ev.target.value))}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Performance({ employees, setEmployees }:{ employees:Employee[]; setEmployees:(x:Employee[])=>void }){
  const [goal, setGoal] = useState("Ship CRM MVP");
  const [review, setReview] = useState("");
  const setScore = (id:number, val:number) => setEmployees(employees.map(e=> e.id===id ? { ...e, performance: val } : e));
  const chart = employees.map(e=>({ name: e.name.split(' ')[0], score: e.performance }));

  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="card-header"><div className="card-title flex items-center gap-2"><Trophy className="h-5 w-5"/> OKR • Q3</div></div>
        <div className="card-content grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div><div className="text-sm mb-1">Objective</div><input className="input" value={goal} onChange={(e)=>setGoal(e.target.value)} /></div>
            <div><div className="text-sm mb-1">Manager Summary</div><textarea className="input h-28" value={review} onChange={(e)=>setReview(e.target.value)} placeholder="Write overall performance notes…"/></div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <XAxis dataKey="name"/><YAxis domain={[0,100]}/><Tooltip/><Line type="monotone" dataKey="score" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Reviews</div></div>
        <div className="card-content overflow-x-auto">
          <table className="table">
            <thead><tr><th>Employee</th><th>Score</th><th>Update</th></tr></thead>
            <tbody>
              {employees.map(e=> (
                <tr key={e.id} className="border-t">
                  <td>{e.name}</td>
                  <td>{e.performance}%</td>
                  <td><input className="input w-24" type="number" defaultValue={e.performance} onBlur={(ev)=>setScore(e.id, Number(ev.target.value))}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Hire(){
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Nina Patel', role: 'SDR', stage: 'Phone Screen' },
    { id: 2, name: 'Omar Dia', role: 'Backend Dev', stage: 'Technical' },
  ]);
  const advance = (id:number)=> setCandidates(candidates.map(c=> c.id===id ? { ...c, stage: nextStage(c.stage) } : c));
  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="card-header"><div className="card-title">Pipeline</div></div>
        <div className="card-content space-y-3">
          {candidates.map(c=> (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
              <div><div className="font-medium">{c.name} • {c.role}</div><div className="text-sm text-gray-500">Stage: {c.stage}</div></div>
              <button className="btn btn-secondary" onClick={()=>advance(c.id)}>Advance<ChevronRight className="h-4 w-4"/></button>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Offer Template</div></div>
        <div className="card-content space-y-2">
          <textarea className="input h-40">{`Hi {name},

We are thrilled to offer you the role of {role} at StatLynk. Base salary: {"{salary}"}. Start date: {date}.

Regards,
People Ops`}</textarea>
          <button className="btn btn-primary">Send Offer</button>
        </div>
      </div>
    </div>
  )
}

function Analytics({ employees }:{ employees:Employee[] }){
  const perf = employees.map(e=>({ name: e.name.split(' ')[0], performance: e.performance, attendance: e.attendance }));
  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="card-header"><div className="card-title">Performance vs Attendance</div></div>
        <div className="card-content h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perf}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="performance"/><Bar dataKey="attendance"/></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function SettingsPane(){
  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="card-header"><div className="card-title">Compliance & Policies</div></div>
        <div className="card-content space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
            <div>
              <div className="font-medium">Global Payroll Compliance</div>
              <div className="text-sm text-gray-500">Enable statutory deductions & localized pay rules</div>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
            <div>
              <div className="font-medium">Leave Policy</div>
              <div className="text-sm text-gray-500">18 PTO days • carryover 5</div>
            </div>
            <button className="btn btn-secondary">Edit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function nextStage(stage:string){
  const stages = ['Sourced','Phone Screen','Technical','Manager','Offer','Hired'];
  const i = stages.indexOf(stage);
  return stages[Math.min(stages.length-1, i+1)] || stages[0];
}

export default function App(){
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [tab, setTab] = useState("dashboard");
  const [payrollHistory] = useState(payrollHistorySeed);

  function exportCSV(){
    const rows = employees.map(e=> ({ id: e.id, name: e.name, email: e.email, dept: e.dept, role: e.role, salary: e.salary, status: e.status }));
    const headers = Object.keys(rows[0]).join(",");
    const body = rows.map(r=> Object.values(r).map(v=>`"${String(v).replaceAll('"','\\"')}"`).join(",")).join("\\n");
    const csv = headers + "\\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "employees.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header onExport={exportCSV}/>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="tabs mb-4">
          {["dashboard","payroll","attendance","performance","hire","analytics","mail","settings"].map(v => (
            <button key={v} onClick={()=>setTab(v)} className={["", tab===v ? "active":""].join(" ")}>{{
              dashboard:"Core HR", payroll:"Payroll", attendance:"Time & Attendance", performance:"Performance", hire:"Hire", analytics:"Analytics", mail:"Mail", settings:"PSA/Settings"
            }[v as any]}</button>
          ))}
        </div>

        {tab==="dashboard" && <Dashboard employees={employees} payrollHistory={payrollHistory}/>}
        {tab==="payroll" && <Payroll employees={employees}/>}
        {tab==="attendance" && <Attendance employees={employees} setEmployees={setEmployees}/>}
        {tab==="performance" && <Performance employees={employees} setEmployees={setEmployees}/>}
        {tab==="hire" && <Hire/>}
        {tab==="analytics" && <Analytics employees={employees}/>}
        {tab==="mail" && (
          <div className="card">
            <div className="card-header"><div className="card-title flex items-center gap-2"><Mail className="h-5 w-5"/>Unified Inbox (Placeholder)</div></div>
            <div className="card-content space-y-2">
              <div className="text-sm text-gray-500">Connect Gmail/Outlook via OAuth to enable send/receive and calendar sync.</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className="btn btn-secondary"><Mail className="h-4 w-4"/>Connect Gmail</button>
                <button className="btn btn-secondary"><CalendarDays className="h-4 w-4"/>Connect Outlook</button>
              </div>
            </div>
          </div>
        )}
        {tab==="settings" && <SettingsPane/>}

        <div className="card mt-6">
          <div className="card-header"><div className="card-title text-base">Employee Directory (Quick Access)</div></div>
          <div className="card-content"><Employees employees={employees} setEmployees={setEmployees}/></div>
        </div>
      </div>

      <footer className="footer">© {new Date().getFullYear()} StatLynk — HR & Payroll MVP</footer>
    </div>
  );
}
