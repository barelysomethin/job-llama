import parse, { domToReact } from 'html-react-parser';

const options = {
  replace: (domNode) => {
    if (domNode.type === 'tag') {
      // Beautify Headings
      if (domNode.name === 'h1' || domNode.name === 'h2' || domNode.name === 'h3') {
        const HeaderTag = domNode.name;
        return (
          <HeaderTag className="text-2xl font-bold mb-4 mt-6 border-b-4 border-black pb-2 inline-block">
            {domToReact(domNode.children, options)}
          </HeaderTag>
        );
      }
      
      // Beautify Lists
      if (domNode.name === 'ul') {
        return (
          <ul className="list-none space-y-2 mb-4 bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
            {domToReact(domNode.children, options)}
          </ul>
        );
      }
      
      // Beautify List Items
      if (domNode.name === 'li') {
        return (
          <li className="flex items-start">
             <span className="mr-2 text-orange-500 font-bold">➢</span>
             <span>{domToReact(domNode.children, options)}</span>
          </li>
        );
      }

      // Beautify Paragraphs
      if (domNode.name === 'p') {
         // check if p is empty
         if (domNode.children.length === 0) return null;
         return <p className="mb-4 leading-relaxed text-lg">{domToReact(domNode.children, options)}</p>;
      }
      
      // Beautify Links
      if (domNode.name === 'a') {
        return (
          <a
            {...domNode.attribs}
            className="text-blue-600 font-bold underline decoration-2 hover:text-orange-500 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
             {domToReact(domNode.children, options)}
          </a>
        );
      }
    }
  }
};

export default function parseHtml(html) {
  if (!html) return null;
  return parse(html, options);
}
