import Link from "next/link";
import Image from "next/image";

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
  inProgress?: boolean;
  planned?: boolean;
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
  details,
  inProgress = false,
  planned = false
}: ProjectCardProps) {
  return (
    <div className={`bg-blog-black border rounded-lg p-6 transition-all duration-200 hover:border-blog-text ${
      featured ? 'border-blog-text' : 'border-blog-grey'
    }`}>
      <div className="flex gap-2 mb-3">
        {featured && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-blog-white bg-blog-grey rounded-md">
            주요 프로젝트 ⭐
          </span>
        )}
        {inProgress && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-blog-white bg-green-900 rounded-md">
            진행중 🚀
          </span>
        )}
        {planned && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-blog-white bg-blue-900 rounded-md">
            구상중 💡
          </span>
        )}
      </div>
      
      {image && (
        <div className="relative mb-4 rounded-lg overflow-hidden bg-blog-grey h-48">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAQQCAQUBAAAAAAAAAAAAAQIDBAUABhESEyExQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABgRAQEBAQEAAAAAAAAAAAAAAAECABEh/9oADAMBEQCEPwDTNIu9d2LVbKdWRIimr+64w2y6pZZcQhSwoBSOPkA+Z5ydm6/qOuaHrVZCU2Uy68h6bIcHl15xTjiuf3k+ZhhhJm3Nf//Z"
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