import { Card, CardContent } from '@/components/ui/card';
import { selectTechnologies, type TechnologyKey } from '@/lib/technologies';

export default function TechnologyGrid({ keys, className = 'grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto' }: { keys: readonly TechnologyKey[]; className?: string }) {
  return <div className={className}>{selectTechnologies(keys).map((technology) => (
    <Card key={technology.key} className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4 flex flex-col items-center justify-center gap-3 min-h-[100px]">
        <img src={technology.logo} alt="" aria-hidden="true" className="h-9 w-9 object-contain" width="36" height="36" loading="lazy" decoding="async" />
        <span className="text-sm font-medium text-center">{technology.name}</span>
      </CardContent>
    </Card>
  ))}</div>;
}
