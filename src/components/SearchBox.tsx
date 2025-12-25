import { useState, useMemo, useCallback } from 'react';
import { Search, X, Star, Globe, Sparkles, Orbit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { brightStars, deepSkyObjects, constellations } from '@/data/starCatalog';

interface SearchResult {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'constellation' | 'galaxy' | 'nebula' | 'cluster';
  ra: number;
  dec: number;
  magnitude?: number;
  description?: string;
}

interface SearchBoxProps {
  onSelectObject: (result: SearchResult) => void;
}

const planets = [
  { id: 'mercury', name: 'Mercury', type: 'planet' as const, ra: 0, dec: 0 },
  { id: 'venus', name: 'Venus', type: 'planet' as const, ra: 0, dec: 0 },
  { id: 'mars', name: 'Mars', type: 'planet' as const, ra: 0, dec: 0 },
  { id: 'jupiter', name: 'Jupiter', type: 'planet' as const, ra: 0, dec: 0 },
  { id: 'saturn', name: 'Saturn', type: 'planet' as const, ra: 0, dec: 0 },
];

export function SearchBox({ onSelectObject }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const allObjects = useMemo((): SearchResult[] => {
    const stars: SearchResult[] = brightStars.map(star => ({
      id: star.id,
      name: star.name,
      type: 'star',
      ra: star.ra,
      dec: star.dec,
      magnitude: star.magnitude,
      description: `${star.spectralType}-type star in ${star.constellation || 'unknown'}`,
    }));

    const dsos: SearchResult[] = deepSkyObjects.map(dso => ({
      id: dso.id,
      name: dso.name,
      type: dso.type === 'galaxy' ? 'galaxy' : dso.type === 'nebula' || dso.type === 'planetary' ? 'nebula' : 'cluster',
      ra: dso.ra,
      dec: dso.dec,
      magnitude: dso.magnitude,
      description: dso.description,
    }));

    const consts: SearchResult[] = constellations.map(c => ({
      id: c.id,
      name: c.name,
      type: 'constellation',
      ra: brightStars.find(s => c.stars.includes(s.id))?.ra || 0,
      dec: brightStars.find(s => c.stars.includes(s.id))?.dec || 0,
      description: `${c.abbr} constellation`,
    }));

    return [...stars, ...dsos, ...consts, ...planets];
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allObjects
      .filter(obj => obj.name.toLowerCase().includes(lowerQuery))
      .slice(0, 10);
  }, [query, allObjects]);

  const handleSelect = useCallback((result: SearchResult) => {
    onSelectObject(result);
    setQuery('');
    setIsOpen(false);
  }, [onSelectObject]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'star': return <Star className="w-4 h-4 text-yellow-400" />;
      case 'planet': return <Globe className="w-4 h-4 text-orange-400" />;
      case 'constellation': return <Sparkles className="w-4 h-4 text-blue-400" />;
      case 'galaxy': return <Orbit className="w-4 h-4 text-purple-400" />;
      case 'nebula': return <Sparkles className="w-4 h-4 text-pink-400" />;
      case 'cluster': return <Star className="w-4 h-4 text-cyan-400" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center px-3 py-2 gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stars, planets, constellations..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {isOpen && results.length > 0 && (
          <div className="border-t border-glass-border">
            <ScrollArea className="max-h-64">
              <div className="p-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-left"
                  >
                    {getIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {result.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {result.description || result.type}
                        {result.magnitude !== undefined && ` • Mag ${result.magnitude.toFixed(1)}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {isOpen && query && results.length === 0 && (
          <div className="border-t border-glass-border p-4 text-center text-sm text-muted-foreground">
            No objects found matching "{query}"
          </div>
        )}
      </div>
    </div>
  );
}