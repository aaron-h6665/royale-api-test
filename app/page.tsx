import SearchForm from "./components/SearchForm";
import AnimatedContainer from './components/AnimatedComponent';
import { ReactNode } from "react";

interface Card {
  id: number;
  name: string;
  level: number;
  rarity: string;
  iconUrls: {
    medium: string;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  glowColor?: string;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag: rawTag } = await searchParams;

  let playerData = null;
  let errorMessage = "";

  if (rawTag) {
    try {
      const formattedTag = `%23${rawTag}`;
      const url = `https://api.clashroyale.com/v1/players/${formattedTag}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.JWT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 60 }
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Player not found. Double-check the tag!");
        if (response.status === 403) throw new Error("Access denied. Check your API key and IP restrictions.");
        throw new Error(`API Error: ${response.status}`);
      }
      playerData = await response.json();
    } catch (error) {
      console.error("Fetch failed:", error);
      errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white p-8 font-sans selection:bg-pink-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">
            Clash Royale Tracker
          </h1>
          <p className="text-indigo-200/80 tracking-wide">Reveal live battle stats and deck analysis.</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <SearchForm />
        </div>

        {errorMessage && (
          <div className="bg-red-500/20 backdrop-blur-md border-l-4 border-red-500 text-red-200 p-4 rounded-lg mb-6 shadow-lg shadow-red-500/10">
            <p className="font-bold tracking-wider uppercase text-sm mb-1">Error</p>
            <p>{errorMessage}</p>
          </div>
        )}

        {playerData && (
          <div className="space-y-8">
            
            {/* SECTION 1: Player Profile */}
            <AnimatedContainer delay={0.1}>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-4xl font-black text-white flex items-center gap-4">
                      {playerData.name} 
                      <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg shadow-yellow-500/30">
                        Level {playerData.expLevel}
                      </span>
                    </h2>
                    <p className="text-indigo-300 font-mono mt-2 text-lg tracking-wider">{playerData.tag}</p>
                  </div>
                  <div className="text-left md:text-right bg-black/20 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1 font-semibold">Current Arena</p>
                    <p className="font-bold text-xl text-blue-200">{playerData.arena?.name || "Unknown"}</p>
                  </div>
                </div>
                {playerData.clan && (
                  <div className="mt-6 inline-block bg-indigo-900/50 border border-indigo-500/30 px-5 py-2.5 rounded-xl text-indigo-100 backdrop-blur-sm">
                    <span className="font-bold text-white mr-2">🛡️ Clan:</span> {playerData.clan.name} 
                    <span className="text-indigo-400 ml-2 text-sm uppercase tracking-wider">({playerData.role})</span>
                  </div>
                )}
              </div>
            </AnimatedContainer>

            {/* SECTION 2: Full Stats Grid */}
            <AnimatedContainer delay={0.3}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Trophies" value={playerData.trophies} icon="🏆" glowColor="group-hover:shadow-yellow-500/20" />
                <StatCard title="Best Trophies" value={playerData.bestTrophies} icon="🥇" glowColor="group-hover:shadow-yellow-500/20" />
                <StatCard title="Total Wins" value={playerData.wins} icon="⚔️" glowColor="group-hover:shadow-blue-500/20" />
                <StatCard title="Total Losses" value={playerData.losses} icon="💀" glowColor="group-hover:shadow-red-500/20" />
                <StatCard title="3-Crown Wins" value={playerData.threeCrownWins} icon="👑" glowColor="group-hover:shadow-yellow-500/20" />
                <StatCard title="Battle Count" value={playerData.battleCount} icon="📊" glowColor="group-hover:shadow-indigo-500/20" />
                <StatCard title="Donations" value={playerData.donations} icon="🎁" glowColor="group-hover:shadow-green-500/20" />
                <StatCard title="War Day Wins" value={playerData.warDayWins} icon="🛡️" glowColor="group-hover:shadow-purple-500/20" />
              </div>
            </AnimatedContainer>

            {/* SECTION 3: Current Deck with Rarity Mapping */}
            <AnimatedContainer delay={0.5}>
              {playerData.currentDeck && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                  <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 inline-block">
                    Battle Deck
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {playerData.currentDeck.map((card: Card) => {
                      // Rarity Style Map
                      const rarityMap: Record<string, { color: string, icon: string }> = {
                        Champion:  { color: "text-yellow-400", icon: "🏆" },
                        Legendary: { color: "text-purple-400", icon: "★" },
                        Epic:      { color: "text-pink-400",   icon: "♦" },
                        Rare:      { color: "text-orange-300", icon: "●" },
                        Common:    { color: "text-indigo-200", icon: "•" }
                      };
                      const style = rarityMap[card.rarity] || { color: "text-white", icon: "" };

                      return (
                        <div key={card.id} className="group flex flex-col items-center p-3 rounded-2xl hover:bg-white/10 transition-all duration-300">
                          <img 
                            src={card.iconUrls.medium} 
                            alt={card.name} 
                            className="w-20 h-auto drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300 ease-out"
                          />
                          <p className="text-[11px] text-center font-bold text-indigo-100 mt-3 uppercase tracking-wider line-clamp-1">{card.name}</p>
                          <p className={`text-[10px] font-black mt-1 ${style.color}`}>
                            {style.icon} LVL {card.level}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </AnimatedContainer>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, glowColor }: StatCardProps) {
  return (
    <div className={`group bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 ${glowColor}`}>
      <div className="flex justify-between items-center mb-2">
        <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold">{title}</p>
        <span className="text-lg opacity-80 group-hover:scale-125 transition-transform duration-300">{icon}</span>
      </div>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
    </div>
  );
}