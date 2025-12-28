import React, { useState } from 'react';
import { useGithubScanner } from './hooks/useGithubScanner';
import { useGeminiAnalyst } from './hooks/useGeminiAnalyst';
import { CyberCard, StatBox } from './components/ui';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { 
  Search, 
  Github, 
  Key, 
  Cpu, 
  Code, 
  Star, 
  GitFork, 
  Terminal, 
  Zap,
  ShieldAlert,
  Loader2
} from 'lucide-react';

const COLORS = ['#00ff41', '#00f3ff', '#bc13fe', '#ff003c', '#ffff00', '#ffffff'];

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  const { 
    scanProfile, 
    data: profile, 
    loading: scanLoading, 
    error: scanError 
  } = useGithubScanner();
  
  const { 
    analyzeProfile, 
    report, 
    isLoading: aiLoading, 
    error: aiError 
  } = useGeminiAnalyst();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    await scanProfile(username);
  };

  const handleAnalyze = () => {
    if (profile) {
      analyzeProfile(profile, apiKey);
    }
  };

  // Calculate a "Hacker Score" based on stats
  const calculateScore = () => {
    if (!profile) return 0;
    const { totalStars, user } = profile;
    const score = Math.min(100, Math.floor((totalStars * 2) + (user.public_repos) + (user.followers / 2)));
    return score;
  };

  return (
    <div className="min-h-screen bg-cyber-black text-gray-300 p-4 md:p-8 selection:bg-cyber-neonGreen selection:text-black">
      
      {/* Header */}
      <header className="mb-10 text-center relative">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-neonGreen via-cyber-neonBlue to-cyber-neonPurple tracking-tighter uppercase mb-2 drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
          GitPunk_Analyst
        </h1>
        <p className="text-cyber-neonBlue font-mono text-sm tracking-widest">v2.0.77 :: SYSTEM_READY</p>
      </header>

      {/* Input Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <CyberCard className="bg-opacity-50 backdrop-blur-sm">
          <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs uppercase text-cyber-neonGreen mb-1 tracking-wider">Target Username</label>
              <div className="relative">
                <Github className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-cyber-dark border border-gray-700 rounded-sm py-2 pl-10 pr-4 focus:outline-none focus:border-cyber-neonGreen text-white font-mono placeholder-gray-700"
                  placeholder="octocat"
                  required
                />
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <label className="block text-xs uppercase text-cyber-neonPurple mb-1 tracking-wider">Gemini API Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-cyber-dark border border-gray-700 rounded-sm py-2 pl-10 pr-4 focus:outline-none focus:border-cyber-neonPurple text-white font-mono placeholder-gray-700"
                  placeholder="Required for AI report"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={scanLoading}
              className="w-full md:w-auto bg-cyber-neonGreen text-black font-bold py-2 px-6 rounded-sm hover:bg-white transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {scanLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
              Scan
            </button>
          </form>
          {scanError && <p className="mt-4 text-cyber-neonRed font-mono text-sm flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> {scanError}</p>}
        </CyberCard>
      </div>

      {/* Dashboard Content */}
      {profile && (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* User Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start">
            <img 
              src={profile.user.avatar_url} 
              alt={profile.user.login} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-sm border-2 border-cyber-neonBlue shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-1">{profile.user.name || profile.user.login}</h2>
              <a href={profile.user.html_url} target="_blank" rel="noreferrer" className="text-cyber-neonBlue hover:underline font-mono text-sm mb-2 block">@{profile.user.login}</a>
              <p className="text-gray-400 max-w-2xl">{profile.user.bio}</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
               <div className="text-right">
                  <span className="text-xs text-cyber-neonPurple uppercase">Hacker Score</span>
                  <div className="text-4xl font-black text-cyber-neonPurple drop-shadow-[0_0_8px_rgba(188,19,254,0.6)]">
                    {calculateScore()}
                  </div>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <CyberCard>
              <StatBox label="Total Stars" value={profile.totalStars} color="text-yellow-400" />
              <Star className="absolute bottom-2 right-2 text-yellow-400/20 w-8 h-8" />
            </CyberCard>
            <CyberCard>
              <StatBox label="Public Repos" value={profile.user.public_repos} color="text-cyber-neonGreen" />
              <GitFork className="absolute bottom-2 right-2 text-cyber-neonGreen/20 w-8 h-8" />
            </CyberCard>
            <CyberCard>
              <StatBox label="Followers" value={profile.user.followers} color="text-cyber-neonBlue" />
              <Cpu className="absolute bottom-2 right-2 text-cyber-neonBlue/20 w-8 h-8" />
            </CyberCard>
            <CyberCard>
              <StatBox label="Top Lang" value={profile.languages[0]?.name || 'N/A'} color="text-cyber-neonRed" />
              <Code className="absolute bottom-2 right-2 text-cyber-neonRed/20 w-8 h-8" />
            </CyberCard>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <CyberCard title="Tech Stack Dist." icon={Zap}>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profile.languages}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {profile.languages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#121212', borderColor: '#333', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                 {profile.languages.map((l, i) => (
                   <span key={l.name} className="text-xs flex items-center gap-1">
                     <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span>
                     {l.name}
                   </span>
                 ))}
              </div>
            </CyberCard>

            <CyberCard title="Top Repositories" icon={Star}>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profile.topRepos} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100} 
                      tick={{ fill: '#9ca3af', fontSize: 10 }} 
                      interval={0}
                    />
                    <RechartsTooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: '#121212', borderColor: '#333', color: '#fff' }}
                    />
                    <Bar dataKey="stargazers_count" fill="#00ff41" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CyberCard>
          </div>

          {/* AI Report Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <Terminal className="text-cyber-neonPurple" />
                 AI Recruiter Insight
               </h3>
               {!report && !aiLoading && (
                 <button 
                   onClick={handleAnalyze}
                   className="bg-cyber-neonPurple text-white px-4 py-1 text-sm font-bold uppercase tracking-wider hover:bg-purple-600 transition-colors rounded-sm"
                 >
                   Generate Report
                 </button>
               )}
            </div>

            <div className="bg-black border border-cyber-gray p-6 rounded-sm min-h-[200px] shadow-inner relative">
               {/* Terminal dots */}
               <div className="flex gap-2 mb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>

               {aiLoading ? (
                 <div className="flex flex-col items-center justify-center h-40 gap-4">
                   <Loader2 className="animate-spin text-cyber-neonPurple w-8 h-8" />
                   <p className="font-mono text-cyber-neonPurple animate-pulse">ANALYZING_DATA_PATTERNS...</p>
                 </div>
               ) : report ? (
                 <div className="prose prose-invert prose-sm max-w-none font-mono">
                   <ReactMarkdown 
                      components={{
                        strong: ({node, ...props}) => <span className="text-cyber-neonGreen font-bold" {...props} />,
                        h1: ({node, ...props}) => <h3 className="text-xl text-cyber-neonBlue border-b border-gray-700 pb-2 mb-4" {...props} />,
                        h2: ({node, ...props}) => <h4 className="text-lg text-cyber-neonPurple mt-6 mb-2" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 text-gray-300" {...props} />,
                      }}
                   >
                     {report}
                   </ReactMarkdown>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-40 text-gray-600 font-mono">
                   <p>{apiKey ? "Ready to analyze." : "Enter API Key to enable AI analysis."}</p>
                   <p className="text-xs mt-2">Waiting for command...</p>
                 </div>
               )}
               
               {aiError && (
                 <div className="mt-4 p-2 bg-red-900/20 border border-red-500/50 text-red-400 text-sm font-mono">
                   ERROR: {aiError}
                 </div>
               )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default App;
