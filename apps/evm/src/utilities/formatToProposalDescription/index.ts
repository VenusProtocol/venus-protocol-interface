import type { Proposal } from 'types';

export const formatToProposalDescription = ({ description }: { description: string }) => {
  let result: Proposal['description'] = {
    version: 'v2',
    title: '',
    description: '',
    forDescription: '',
    againstDescription: '',
    abstainDescription: '',
  };

  try {
    result = JSON.parse(description);
  } catch {
    // Split description in half, delimited by the first instance of a break
    // line symbol (\n). The first half corresponds to the title of the
    // proposal, the second to the description
    const [title, descriptionText] = description.split(/\n(.*)/s);

    // Remove markdown characters from title since it's rendered as plain text
    // on the front end
    const plainTitle = title.replaceAll('*', '').replaceAll('#', '');

    result = { version: 'v1', title: plainTitle, description: descriptionText };
  }

  return result;
};
