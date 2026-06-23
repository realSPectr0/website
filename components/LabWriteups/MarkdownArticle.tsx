import Image from 'next/image';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={`${part}-${index}`}
          className='bg-dark-gray-4 border-border-color rounded border px-1.5 py-0.5 text-[0.92em] text-slate-100'
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong
          key={`${part}-${index}`}
          className='font-semibold text-white'
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function MarkdownTable({ lines }: { lines: string[] }) {
  const rows = lines
    .filter((line) => !/^\|\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(line))
    .map((line) =>
      line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim())
    );

  if (rows.length === 0) {
    return null;
  }

  const [head, ...body] = rows;

  return (
    <div className='border-dark-gray-3 overflow-x-auto rounded-xl border'>
      <table className='w-full min-w-[640px] border-collapse text-left text-sm'>
        <thead className='bg-dark-gray-3 text-light-gray-4'>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                className='border-dark-gray-3 border-b px-4 py-3 font-semibold'
              >
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr
              key={`${row.join('-')}-${rowIndex}`}
              className='border-dark-gray-3 border-t'
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cell}-${cellIndex}`}
                  className='text-light-gray-2 px-4 py-3 align-top leading-6'
                >
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MarkdownArticle({ markdown }: { markdown: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = markdown.split('\n');
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }

      blocks.push(
        <pre
          key={`code-${index}`}
          className='bg-almost-black border-dark-gray-3 overflow-x-auto rounded-xl border p-4 text-[13px] leading-6 text-slate-200'
        >
          <code className={language ? `language-${language}` : undefined}>{code.join('\n')}</code>
        </pre>
      );

      index += 1;
      continue;
    }

    const imageMatch = /^!\[(.*)]\((.*)\)$/.exec(line.trim());
    if (imageMatch) {
      blocks.push(
        <figure
          key={`image-${index}`}
          className='space-y-3'
        >
          <div className='bg-dark-gray-3 border-dark-gray-3 relative aspect-[16/7] w-full overflow-hidden rounded-xl border'>
            <Image
              src={imageMatch[2]}
              alt={imageMatch[1] || 'Lab writeup image'}
              fill
              className='object-cover'
              sizes='(min-width: 1024px) 900px, 100vw'
            />
          </div>
          {imageMatch[1] ? (
            <figcaption className='text-light-gray-2 text-sm'>{imageMatch[1]}</figcaption>
          ) : null}
        </figure>
      );
      index += 1;
      continue;
    }

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^#+/)?.[0].length ?? 2;
      const text = line.replace(/^#{1,6}\s/, '');
      const id = slugify(text);
      const className =
        level === 1
          ? 'text-3xl font-bold text-white'
          : level === 2
            ? 'border-dark-gray-4 mt-10 border-b border-dashed pb-3 text-2xl font-bold text-white'
            : 'mt-7 text-xl font-semibold text-white';

      if (level === 1) {
        blocks.push(
          <h1
            key={`heading-${index}`}
            id={id}
            className={className}
          >
            {renderInline(text)}
          </h1>
        );
      } else if (level === 2) {
        blocks.push(
          <h2
            key={`heading-${index}`}
            id={id}
            className={className}
          >
            {renderInline(text)}
          </h2>
        );
      } else {
        blocks.push(
          <h3
            key={`heading-${index}`}
            id={id}
            className={className}
          >
            {renderInline(text)}
          </h3>
        );
      }
      index += 1;
      continue;
    }

    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        tableLines.push(lines[index]);
        index += 1;
      }
      blocks.push(
        <MarkdownTable
          key={`table-${index}`}
          lines={tableLines}
        />
      );
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, ''));
        index += 1;
      }
      blocks.push(
        <ul
          key={`list-${index}`}
          className='text-light-gray-2 list-disc space-y-2 pl-6 text-[15px] leading-7'
        >
          {items.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+\.\s+/, ''));
        index += 1;
      }
      blocks.push(
        <ol
          key={`ordered-${index}`}
          className='text-light-gray-2 list-decimal space-y-2 pl-6 text-[15px] leading-7'
        >
          {items.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.startsWith('>')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith('>')) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(
        <blockquote
          key={`quote-${index}`}
          className='border-light-gray-3 bg-dark-gray-3 text-light-gray-2 rounded-r-xl border-l-4 p-4 text-[15px] leading-7'
        >
          {quote.map((quoteLine) => (
            <p key={quoteLine}>{renderInline(quoteLine)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith('```') &&
      !/^#{1,6}\s/.test(lines[index]) &&
      !lines[index].trim().startsWith('|') &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index]) &&
      !lines[index].startsWith('>') &&
      !/^!\[(.*)]\((.*)\)$/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }

    blocks.push(
      <p
        key={`paragraph-${index}`}
        className='text-light-gray-2 text-[15px] leading-7'
      >
        {renderInline(paragraph.join(' '))}
      </p>
    );
  }

  return <div className='space-y-5'>{blocks}</div>;
}
