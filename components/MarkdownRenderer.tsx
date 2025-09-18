import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

const processInlineMarkdown = (line: string): React.ReactNode => {
  // A simple and safe way to handle inline formatting without dangerouslySetInnerHTML
  // This regex splits the string by bold syntax (**...**), keeping the delimiters
  const parts = line.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // If the part is bold, return a <strong> element
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    // Otherwise, return the text part as is
    return part;
  });
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-3 pl-2">
          {listItems.map((item, index) => (
            <li key={index}>{processInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line: string, index: number) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-2xl font-bold my-4">{processInlineMarkdown(line.substring(2))}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-bold my-3">{processInlineMarkdown(line.substring(3))}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-lg font-bold my-2">{processInlineMarkdown(line.substring(4))}</h3>);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      listItems.push(line.substring(2));
    } else if (line.trim() !== '') {
      flushList();
      elements.push(<p key={index} className="my-2">{processInlineMarkdown(line)}</p>);
    }
    // Intentionally ignoring empty lines to create more compact spacing, handled by margins.
  });

  flushList(); // Add any remaining list items at the end

  return <div className="whitespace-pre-wrap">{elements}</div>;
};

export default MarkdownRenderer;