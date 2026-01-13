interface SkillBadgeProps {
  name: string;
  starred?: boolean;
}

export default function SkillBadge({ name, starred = false }: SkillBadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
      starred 
        ? 'bg-blog-grey text-blog-white border border-blog-text hover:bg-blog-grey-hover' 
        : 'bg-blog-black text-blog-text border border-blog-grey hover:bg-blog-grey hover:text-blog-white'
    }`}>
      {name}
      {starred && <span className="ml-1">⭐</span>}
    </span>
  );
}