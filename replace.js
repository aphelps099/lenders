import fs from 'fs';

const appCode = fs.readFileSync('src/App.tsx', 'utf8');

const lenderDataMatch = appCode.match(/const lenderData = \[[\s\S]*?\];/);
if (!lenderDataMatch) {
  console.error("Could not find lenderData");
  process.exit(1);
}

const lenderDataCode = lenderDataMatch[0];

const newAppCode = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Phone, Briefcase, Target, Building2, ChevronDown, FileText, CheckCircle2, Loader2, Database, LayoutDashboard, ArrowRight, Globe, Sparkles, ArrowLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';

${lenderDataCode}

const getCategoryColor = (category: string) => {
  switch(category) {
    case "Commercial & Regional Bank": return "bg-blue-50 text-blue-700 border-blue-200";
    case "Credit Union": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CDFI & Mission-Driven": return "bg-violet-50 text-violet-700 border-violet-200";
    case "State-Supported": return "bg-amber-50 text-amber-800 border-amber-200";
    case "SBA 504 CDC": return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Private Equity & Venture Debt": return "bg-rose-50 text-rose-700 border-rose-200";
    case "Alternative & FinTech": return "bg-indigo-50 text-indigo-700 border-indigo-200";
    default: return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const MaterialInput = ({ label, id, type = "text", value, onChange, placeholder = " " }: any) => (
  <div className="relative">
    <input 
      type={type} 
      id={id} 
      className="peer w-full bg-white border-b-2 border-slate-200 px-4 pt-6 pb-2 focus:outline-none focus:border-blue-600 focus:bg-slate-50 transition-all rounded-t-lg placeholder-transparent text-slate-900 font-medium" 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    <label 
      htmlFor={id} 
      className="absolute left-4 top-2 text-[11px] font-bold tracking-wider uppercase text-slate-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-blue-600 pointer-events-none"
    >
      {label}
    </label>
  </div>
);

const MaterialSelect = ({ label, id, value, onChange, options }: any) => (
  <div className="relative">
    <select 
      id={id} 
      className="peer w-full bg-white border-b-2 border-slate-200 px-4 pt-6 pb-2 focus:outline-none focus:border-blue-600 focus:bg-slate-50 transition-all rounded-t-lg text-slate-900 font-medium appearance-none cursor-pointer" 
      value={value}
      onChange={onChange}
    >
      <option value="" disabled className="text-slate-400"></option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <label 
      htmlFor={id} 
      className={\`absolute left-4 transition-all pointer-events-none \${value ? 'top-2 text-[11px] font-bold tracking-wider uppercase text-slate-400' : 'top-4 text-sm font-medium text-slate-400'} peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-blue-600\`}
    >
      {label}
    </label>
    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
  </div>
);

function AssessmentTool({ lenderData, onBack }: { lenderData: any[], onBack: () => void }) {
  const [formData, setFormData] = useState({
    industry: '',
    timeInBusiness: '',
    revenue: '',
    creditScore: '',
    loanAmount: '',
    loanPurpose: '',
    narrative: '',
    websiteUrl: ''
  });
  const [isAssessing, setIsAssessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState('');
  const [error, setError] = useState('');

  const handleScanWebsite = async () => {
    if (!formData.websiteUrl) {
      setError('Please enter a website URL to scan.');
      return;
    }
    setIsScanning(true);
    setError('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = \`Scan the business website at \${formData.websiteUrl} and write a 2-3 sentence pitch summary explaining what the business does, its target market, and its value proposition. This will be used for a loan application narrative. Do not include any PII.\`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ urlContext: {} }]
        }
      });
      
      setFormData(prev => ({ ...prev, narrative: response.text || '' }));
    } catch (err: any) {
      console.error(err);
      setError('Failed to scan website. Please try writing the narrative manually.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAssess = async () => {
    if (!formData.timeInBusiness || !formData.revenue || !formData.creditScore || !formData.loanAmount) {
      setError('Please fill in all required fields (Time in Business, Revenue, Credit Score, Loan Amount).');
      return;
    }

    setIsAssessing(true);
    setError('');
    setAssessmentResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const prompt = \`
You are an expert SBDC (Small Business Development Center) capital advisor. Your goal is to help match a small business client with the most appropriate lenders from our database based on their profile.

Client Profile:
- Industry/Sector: \${formData.industry || 'Not specified'}
- Time in Business: \${formData.timeInBusiness}
- Annual Revenue: \${formData.revenue}
- Estimated Credit Score (FICO): \${formData.creditScore}
- Loan Amount Requested: $\${formData.loanAmount}
- Purpose of Loan: \${formData.loanPurpose || 'Not specified'}
- Narrative/Additional Details: \${formData.narrative || 'None provided'}

Available Lenders Database:
\${JSON.stringify(lenderData, null, 2)}

Task:
1. Analyze the client's profile against the underwriting criteria (FICO, time in business, revenue, loan types) of the lenders in the database.
2. Identify the top 3 to 5 most appropriate lender matches.
3. For each match, explain exactly *why* they are a good fit and any potential hurdles the client might face with that specific lender.
4. Provide a "Review and Next Steps" section for the SBDC advisor. This should include specific recommendations on how the advisor can help the client prepare for these applications (e.g., documents to gather, narrative to refine, credit score improvements needed).

Format your response in clean, professional Markdown. Use headings, bullet points, and bold text for readability. Do not include any PII.
\`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAssessmentResult(response.text || 'No response generated.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the assessment.');
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12 relative"
    >
      <Target className="absolute -left-20 top-20 w-96 h-96 text-slate-900 opacity-[0.02] pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className="p-3 bg-white hover:bg-slate-100 text-slate-600 rounded-full transition-colors shadow-sm border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Capital Assessment</h2>
          <p className="text-slate-500">Generate an AI-powered match report for your client.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Form Section */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <MaterialInput 
                id="industry" 
                label="Industry / Sector" 
                value={formData.industry} 
                onChange={(e: any) => setFormData({...formData, industry: e.target.value})} 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <MaterialSelect 
                  id="timeInBusiness" 
                  label="Time in Business *" 
                  value={formData.timeInBusiness} 
                  onChange={(e: any) => setFormData({...formData, timeInBusiness: e.target.value})}
                  options={[
                    { value: "Startup (< 6 months)", label: "Startup (< 6 months)" },
                    { value: "6-12 months", label: "6-12 months" },
                    { value: "1-2 years", label: "1-2 years" },
                    { value: "2+ years", label: "2+ years" }
                  ]}
                />
                <MaterialSelect 
                  id="revenue" 
                  label="Annual Revenue *" 
                  value={formData.revenue} 
                  onChange={(e: any) => setFormData({...formData, revenue: e.target.value})}
                  options={[
                    { value: "Pre-revenue", label: "Pre-revenue" },
                    { value: "< $100k", label: "< $100k" },
                    { value: "$100k - $500k", label: "$100k - $500k" },
                    { value: "$500k - $1M", label: "$500k - $1M" },
                    { value: "$1M+", label: "$1M+" }
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MaterialInput 
                  id="creditScore" 
                  type="number"
                  label="Est. Credit Score *" 
                  value={formData.creditScore} 
                  onChange={(e: any) => setFormData({...formData, creditScore: e.target.value})} 
                />
                <MaterialInput 
                  id="loanAmount" 
                  type="number"
                  label="Loan Amount *" 
                  value={formData.loanAmount} 
                  onChange={(e: any) => setFormData({...formData, loanAmount: e.target.value})} 
                />
              </div>

              <MaterialSelect 
                id="loanPurpose" 
                label="Purpose of Loan" 
                value={formData.loanPurpose} 
                onChange={(e: any) => setFormData({...formData, loanPurpose: e.target.value})}
                options={[
                  { value: "Working Capital", label: "Working Capital" },
                  { value: "Equipment Purchase", label: "Equipment Purchase" },
                  { value: "Real Estate Acquisition", label: "Real Estate Acquisition" },
                  { value: "Business Acquisition", label: "Business Acquisition" },
                  { value: "Debt Refinance", label: "Debt Refinance" }
                ]}
              />

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-bold tracking-wider uppercase text-slate-400 mb-3">Auto-Fill Narrative</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="url" 
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                      placeholder="https://client-website.com"
                      value={formData.websiteUrl}
                      onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                    />
                  </div>
                  <button 
                    onClick={handleScanWebsite}
                    disabled={isScanning || !formData.websiteUrl}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-blue-400" />}
                    Scan
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea 
                  id="narrative"
                  className="peer w-full bg-slate-50 border-b-2 border-slate-200 px-4 pt-6 pb-2 focus:outline-none focus:border-blue-600 focus:bg-slate-100 transition-all rounded-t-lg min-h-[120px] resize-y text-slate-900 font-medium placeholder-transparent"
                  placeholder="Narrative"
                  value={formData.narrative}
                  onChange={e => setFormData({...formData, narrative: e.target.value})}
                />
                <label 
                  htmlFor="narrative" 
                  className={\`absolute left-4 transition-all pointer-events-none \${formData.narrative ? 'top-2 text-[11px] font-bold tracking-wider uppercase text-slate-400' : 'top-4 text-sm font-medium text-slate-400'} peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-blue-600\`}
                >
                  Short Narrative
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleAssess}
                  disabled={isAssessing}
                  className="flex-1 py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isAssessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Generate Matches
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setFormData({
                      industry: '', timeInBusiness: '', revenue: '', creditScore: '', loanAmount: '', loanPurpose: '', narrative: '', websiteUrl: ''
                    });
                    setAssessmentResult('');
                    setError('');
                  }}
                  disabled={isAssessing}
                  className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="xl:col-span-8">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 min-h-[600px] h-full relative overflow-hidden">
            <FileText className="absolute -right-20 -bottom-20 w-96 h-96 text-slate-900 opacity-[0.02] pointer-events-none" />
            
            {assessmentResult ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-blue-500">
                <Markdown remarkPlugins={[remarkGfm]}>{assessmentResult}</Markdown>
              </motion.div>
            ) : isAssessing ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6 py-24 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <Loader2 className="w-16 h-16 animate-spin text-blue-600 relative z-10" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900 mb-2">Evaluating Criteria...</p>
                  <p className="text-slate-500 max-w-md mx-auto">Our AI is analyzing the client profile against the underwriting standards of all lenders in the database.</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6 py-24 relative z-10">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900 mb-2">Ready for Assessment</p>
                  <p className="text-slate-500 max-w-md mx-auto">Fill out the client profile on the left and click "Generate Matches" to see recommended lenders and next steps.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'database' | 'assessment'>('home');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(lenderData.map(l => l.category));
    return Array.from(uniqueCategories).sort();
  }, []);

  const filteredLenders = useMemo(() => {
    return lenderData.filter(lender => {
      const matchesCategory = selectedCategory === "All Categories" || lender.category === selectedCategory;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        lender.name.toLowerCase().includes(searchLower) ||
        lender.loanTypes.toLowerCase().includes(searchLower) ||
        lender.profile.toLowerCase().includes(searchLower) ||
        lender.geography.toLowerCase().includes(searchLower);
      
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveView('home')}
          >
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-black tracking-tight text-xl">NorCal SBDC</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveView('database')}
              className={\`text-sm font-bold transition-colors \${activeView === 'database' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}\`}
            >
              Database
            </button>
            <button 
              onClick={() => setActiveView('assessment')}
              className={\`text-sm font-bold transition-colors \${activeView === 'assessment' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}\`}
            >
              Assessment
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="relative min-h-[calc(100vh-80px)] flex items-center"
            >
              {/* Background gradient & icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/50 pointer-events-none" />
              <Database className="absolute -right-40 top-1/2 -translate-y-1/2 w-[800px] h-[800px] text-slate-900 opacity-[0.02] pointer-events-none transform -rotate-12" />
              
              <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10 w-full py-20">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs tracking-widest uppercase mb-8 border border-blue-100">
                    <Sparkles className="w-4 h-4" />
                    Capital Readiness Tool
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.95]">
                    Match clients with<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">the right capital.</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed mb-12 font-medium">
                    An intelligent platform for SBDC advisors to assess client readiness and navigate the Northern California lending landscape.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setActiveView('assessment')}
                      className="px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Sparkles className="w-6 h-6" />
                      Start New Assessment
                    </button>
                    <button 
                      onClick={() => setActiveView('database')}
                      className="px-8 py-5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Database className="w-6 h-6 text-slate-400" />
                      Browse Database
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeView === 'database' && (
            <motion.div 
              key="database"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12 relative"
            >
              <Building2 className="absolute -right-20 top-20 w-96 h-96 text-slate-900 opacity-[0.02] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="mb-12">
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Lender Database</h2>
                  <p className="text-xl text-slate-500 max-w-2xl">Search and filter our curated network of lending partners.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Search by name, loan type, profile, or location..." 
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-px bg-slate-200 hidden md:block mx-2"></div>
                  <div className="relative w-full md:w-80">
                    <select 
                      className="w-full appearance-none pl-4 pr-12 py-3.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-bold cursor-pointer"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All Categories">All Categories</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Results Count */}
                <div className="mb-8 text-sm font-bold tracking-wider uppercase text-slate-400">
                  Showing {filteredLenders.length} {filteredLenders.length === 1 ? 'lender' : 'lenders'}
                </div>

                {/* Grid */}
                {filteredLenders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLenders.map((lender, idx) => (
                      <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full group">
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="mb-6">
                            <span className={\`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider uppercase border \${getCategoryColor(lender.category)}\`}>
                              {lender.category}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 leading-tight mb-6 group-hover:text-blue-600 transition-colors">{lender.name}</h3>
                          
                          <div className="space-y-6 flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                                <Briefcase className="w-4 h-4 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Loan Types</p>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">{lender.loanTypes}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                                <Target className="w-4 h-4 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Profile</p>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">{lender.profile}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                                <MapPin className="w-4 h-4 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Geographic Focus</p>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">{lender.geography}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 mt-auto">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                              <Phone className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact</p>
                              <p className="text-sm font-bold text-slate-900">{lender.contact}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-900 mb-3">No lenders found</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">We couldn't find any lenders matching your current search and filter criteria.</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setSelectedCategory('All Categories'); }}
                      className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors shadow-sm"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeView === 'assessment' && (
            <AssessmentTool lenderData={lenderData} onBack={() => setActiveView('home')} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', newAppCode);
console.log('Done replacing App.tsx');
