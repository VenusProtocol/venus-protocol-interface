import rehypeSanitize from 'rehype-sanitize';

const previewOptions = {
  skipHtml: true,
  allowedElements: ['h1', 'h2', 'h3', 'h4', 'p', 'a', 'ul', 'li', 'strong', 'italic'],
  rehypePlugins: [rehypeSanitize],
};

export default previewOptions;
