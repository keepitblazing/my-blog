import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  featured?: boolean;
  review?: string;
  details?: string[];
}

export default function ProjectCard({
  title,
  description,
  technologies,
  githubUrl,
  demoUrl,
  image,
  featured = false,
  review,
  details
}: ProjectCardProps) {
  return (
    <div className={`bg-blog-black border rounded-lg p-6 transition-all duration-200 hover:border-blog-text ${
      featured ? 'border-blog-text' : 'border-blog-grey'
    }`}>
      {featured && (
        <span className="inline-block px-2 py-1 text-xs font-medium text-blog-white bg-blog-grey rounded-md mb-3">
          주요 프로젝트 ⭐
        </span>
      )}
      
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden bg-blog-grey h-48 flex items-center justify-center">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <h3 className="text-xl font-bold text-blog-text mb-2">{title}</h3>
      
      <p className="text-blog-text-muted mb-4">{description}</p>
      
      {details && details.length > 0 && (
        <div className="mb-4">
          <ul className="list-disc list-inside space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="text-blog-text-muted text-sm">
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies.map((tech) => (
          <span 
            key={tech} 
            className="px-2 py-1 text-xs bg-blog-grey text-blog-text rounded-md"
          >
            {tech}
          </span>
        ))}
      </div>
      
      {review && (
        <div className="mb-4 p-3 bg-blog-grey rounded-md">
          <p className="text-sm text-blog-text-muted italic">회고: {review}</p>
        </div>
      )}
      
      <div className="flex gap-3">
        {githubUrl && (
          <Link 
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blog-text hover:text-blog-white transition-colors"
          >
            GitHub →
          </Link>
        )}
        {demoUrl && (
          <Link 
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blog-text hover:text-blog-white transition-colors"
          >
            Demo →
          </Link>
        )}
      </div>
    </div>
  );
}