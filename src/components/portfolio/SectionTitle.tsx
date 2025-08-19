interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold text-blog-text mb-6 pb-2 border-b border-blog-grey">
      {children}
    </h2>
  );
}