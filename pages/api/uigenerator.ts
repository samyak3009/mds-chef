// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


type resData = {
  query : string,
  component : string,
  code : string
}

export default function uigenerator(
  req: NextApiRequest,
  res: NextApiResponse<resData>
) {

  res.status(200).json({ 
    query : req.body.query, 
    component: req.body.component, 
    code: `() => {
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
      }` 
})
}
