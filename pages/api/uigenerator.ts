// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


type resData = {
  query : string,
  component : string,
  code : string
} | {message : string}

/**
 * Generate UI code for a sidesheet modal
 *
 * @route POST /api/uigenerator
 * @param {string} query - Query string to generate UI for
 * @param {string} component - Component name to generate UI for
 * @returns {object} - Generated UI code in string format
 */

export default function uigenerator(
  req: NextApiRequest,
  res: NextApiResponse<resData>
) {

    // Check if the request method is POST
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    // Check if the required query and component fields are present in the request body
    const { query, component } = req.body;
    if (!query || !component) {
      return res.status(400).json({ message: 'Bad Request' });
    }


  // Generate UI code for the provided query and component
  const uiCode = `() => {
    const [open, setOpen] = React.useState(false);
    const onClose = () => {
      setOpen(!open);
    };
    const headerOptions = {
      heading: 'Heading',
      subHeading: 'Subheading'
    };
    const options = {
      onClose,
      open,
      headerOptions,
      footer: (
        <>
          <Button appearance="primary" className="mr-4">Primary</Button>
          <Button appearance="basic">Basic</Button>
        </>
      )
    };
    const modalDescriptionOptions = {
      title: 'Description Title',
      description: 'Adding a subheading clearly indicates the hierarchy of the information.',
      removePadding: true
    };
    const modalDescriptionOptionsWithoutTitle = {
      description: 'Card Sections include supporting text like an article summary or a restaurant description.',
      removePadding: true
    };
    return (
      <div>
        <Button appearance="primary" onClick={() => setOpen(true)}>Open Sidesheet</Button>
        <Sidesheet {...options} dimension="large">
          <Text>Modal Body</Text>
          <ModalDescription {...modalDescriptionOptions} />
          <ModalDescription {...modalDescriptionOptionsWithoutTitle} />
        </Sidesheet>
      </div>
    );
  }`;

  return res.status(200).json({ query, component, code: uiCode });
}
